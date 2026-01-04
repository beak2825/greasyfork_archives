// ==UserScript==
// @name         wcdn batch job transfer ex
// @namespace    http://tampermonkey.net/
// @version      1.3.3
// @description  make job transfer easier!
// @author       A RUN
// @match        http://wcdn.dnweb.cc/user/*
// @require      https://cdn.jsdelivr.net/npm/jquery.min.js@3.5.1/jquery.min.js
// @require      https://cdn.jsdelivr.net/npm/vue@2.5.16/dist/vue.js
// @require      https://cdn.jsdelivr.net/npm/element-ui@2.15.14/lib/index.min.js
// @require      https://cdn.jsdelivr.net/npm/axios@1.6.2/dist/axios.min.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/482404/wcdn%20batch%20job%20transfer%20ex.user.js
// @updateURL https://update.greasyfork.org/scripts/482404/wcdn%20batch%20job%20transfer%20ex.meta.js
// ==/UserScript==

(function () {
    'use strict';

    var header_link = '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/element-ui@2.15.14/lib/theme-chalk/index.min.css">';
    var header_link_tag = $("head");
    if (header_link_tag) {
        header_link_tag.append(header_link);
    }

    var divApp = $(`
    <div id="vueApp">
        <div v-if="isShowProgress" class="popContainer" style="position: fixed;top: 0;left: 0;right: 0;bottom: 0;z-index: 999998;background: rgba(0, 0, 0, 0.6);">
            <el-progress :percentage="progressPercentage" :text-inside="true" :stroke-width="24" v-if="isShowProgress" style="top: 30%; left: 28%; width: 44%;z-index: 999999"></el-progress>
        </div>
        <el-button type="primary" @click="showBatchJobTransferDiv">批量转职</el-button>
        <el-button type="primary" @click="showBatchPotentialExTransferDiv">批量转潜力</el-button>
        <el-dialog title="批量潜力转换" :visible.sync="batchPotentialExTransferDialogVisible"
            @close="cancel" width="80%" destroy-on-close :close-on-click-modal=false>
            <el-form :model="baseFrom" ref="baseFrom" label-width="100px" :inline="true">
            <el-form-item label="权限角色选择" prop="powerfulCharacterID">
                <el-select v-model="powerfulCharacterID" placeholder="请选择拥有权限的角色" @change="initPotentialExTable">
                    <el-option v-for="item in characters" :key="item.characterID" :label="item.characterName" :value="item.characterID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="角色选择" prop="characterID">
                <el-select v-model="characterID" placeholder="请选择角色" @change="initPotentialExTable">
                    <el-option v-for="item in characters" :key="item.characterID" :label="item.characterName" :value="item.characterID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关联潜力选择" prop="relatedPotentialEx">
                <el-switch v-model="relatedPotentialEx"></el-switch>
            </el-form-item>
            <el-table :data="potentialExTableData" style="width: 100%" max-height="500px">
                <el-table-column prop="itemName" label="物品名称" width="280"></el-table-column>
                <el-table-column prop="itemLevel" label="强化等级" width="180"></el-table-column>
                <el-table-column label="转换后" prop="targetTransferId">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.targetTransferId" filterable clearable placeholder="请选择要转换成什么"
                    @change="associationPotentialExSelection($event,scope.row)">
                    <el-option v-for="item in scope.row.potentialExs" :key="item.id" :label="item.potentialExName"
                        :value="item.id"></el-option>
                    </el-select>
                </template>
                </el-table-column>
            </el-table>
            <span class="dialog-footer">
                <el-button @click="batchPotentialExTransferDialogVisible=false">取 消</el-button>
                <el-button type="primary" @click="confirmPotential">批 量 转 潜 力</el-button>
            </span>
        </el-dialog>
        <el-dialog title="批量职业转换" :visible.sync="batchJobTransferDialogVisible"
            @close="cancel" width="80%" destroy-on-close :close-on-click-modal=false>
            <el-form :model="baseFrom" ref="baseFrom" label-width="100px" :inline="true">
            <el-form-item label="角色选择" prop="characterID">
                <el-select v-model="characterID" placeholder="请选择角色" @change="initTable">
                    <el-option v-for="item in characters" :key="item.characterID" :label="item.characterName" :value="item.characterID"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="关联龙玉" prop="batchLunarEclipse">
                <el-switch v-model="batchLunarEclipse"></el-switch>
            </el-form-item>
            <el-form-item label="关联符文" prop="batchRunes">
                <el-switch v-model="batchRunes"></el-switch>
            </el-form-item>
            <el-form-item label="转职方式" prop="universal">
                <el-radio v-model="universal" label="universal">万能转职</el-radio>
                <el-radio v-model="universal" label="frequency">件数转职</el-radio>
            </el-form-item>
            <br/>
            <span style="font-size: 10px;color:#E6A23C;" v-if="universalNum>0 || frequencyNum>0 || universalStartTime!=''">
                <span>当前角色剩余万能次数：{{universalNum}}，剩余件数次数：{{frequencyNum}}</span>
                <span v-if="universalStartTime!=''">，万能次数区间内已使用{{universalUsed}}次，剩余{{universalUnUsed}}次，截止：{{universalEndTime}}</span>
            </span>
            <el-table :data="tableData" style="width: 100%" max-height="500px">
                <el-table-column prop="itemName" label="物品名称" width="280"></el-table-column>
                <el-table-column prop="itemLevel" label="强化等级" width="180"></el-table-column>
                <el-table-column label="转换后" prop="targetTransferId">
                <template slot-scope="scope">
                    <el-select v-model="scope.row.targetTransferId" filterable clearable placeholder="请选择要转换成什么"
                    @change="associationSelection($event,scope.row)">
                    <el-option v-for="item in scope.row.convertibleTypes" :key="item.id" :label="item.itemName"
                        :value="item.id"></el-option>
                    </el-select>
                </template>
                </el-table-column>
            </el-table>
            <span class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="confirm">批 量 转 职</el-button>
            </span>
        </el-dialog>
    </div>
    `);

    var ul_tag = $("body");
    if (ul_tag && document.querySelectorAll("#vueApp").length == 0) {
        ul_tag.append(divApp);
    };

    var app2 = new Vue({
        el: '#vueApp',
        data() {
            return {
                baseFrom: {},
                batchJobTransferDialogVisible: false,
                batchPotentialExTransferDialogVisible: false,
                token: '',
                characters: [],
                characterID: '',
                powerfulCharacterID: '',
                changeItems: [],
                universal: '',
                progressPercentage: 0,
                batchLunarEclipse: true,
                isShowProgress: false,
                batchRunes: true,
                tableData: [],
                potentialExTableData: [],
                confirmAble: true,
                universalNum: 0,
                frequencyNum: 0,
                universalUsed: 0,
                universalUnUsed: 0,
                universalStartTime: '',
                universalEndTime: '',
                relatedPotentialEx: true,
                equipmentBelongNames: [["头盔", "上装", "下装", "手套", "鞋子"], ["主武器", "辅助武器"], ["项链", "耳环"]],
            };
        },
        mounted() {

        },
        methods: {
            destroyData() {
                this.characters = [];
                this.characterID = '';
                this.powerfulCharacterID = '';
                this.baseFrom = {};
                this.universal = '';
                this.tableData = [];
                this.potentialExTableData = [];
                this.confirmAble = true;
            },
            showBatchJobTransferDiv() {
                this.token = getSession('accountToken');
                if (this.token == null || this.token == '') {
                    this.$message('小老弟,要先登录噢');
                    return;
                }
                this.destroyData();
                this.$confirm(`1.需要转职的装备请提前放入背包一般或点券物品中,接下来<strong>只会显示可以转职的道具</strong><br/>
                               2.<strong>一次万能次数内如果不足以全部转换,将激活使用下一次万能转次数</strong><br/>
                               3.支持给各项<strong>单独设置</strong>转职后是什么;支持龙玉和符文的<strong>批量选择</strong>(多个转属龙玉之间不支持联动)<br/>
                               4.免责声明：本人是第一只小白鼠,在使用中没遇到什么问题;但无法保证100%无误,<strong>因使用本脚本造成损失概不负责</strong><br/>
                               5.有建议和bug联系我,虽然不一定改<br/>
                               <strong>~用的愉快~</strong><br/>`,
                    '批量转职须知', {
                        dangerouslyUseHTMLString: true,
                        distinguishCancelAndClose: true,
                        confirmButtonText: '确认并继续',
                        cancelButtonText: '放弃转职'
                    }).then(() => {
                    this.batchJobTransferDialogVisible = true;
                    this.getCharacters();
                    this.initTable();
                }).catch(action => {
                    this.$message({
                        type: 'info',
                        message: '不转了~'
                    })
                });
            },
            showBatchPotentialExTransferDiv() {
                this.token = getSession('accountToken');
                if (this.token == null || this.token == '') {
                    this.$message('小老弟,要先登录噢');
                    return;
                }
                this.destroyData();
                this.$confirm(`1.需要变更潜力的龙玉请提前放入背包中<br/>
                               2.先选择拥有月蚀权限的角色,再选择转换哪个角色的龙玉<br/>
                               3.支持龙玉潜力<strong>单独设置</strong>;支持潜力联动选择(戒指不支持),若潜力联动有误,关闭关联潜力选项<br/>
                               4.免责声明：本人是第一只小白鼠,在使用中没遇到什么问题;但无法保证100%无误,<strong>因使用本脚本造成损失概不负责</strong><br/>
                               5.有建议和bug联系我,虽然不一定改<br/>
                               <strong>~用的愉快~</strong><br/>`,
                    '潜力转换须知', {
                        dangerouslyUseHTMLString: true,
                        distinguishCancelAndClose: true,
                        confirmButtonText: '确认并继续',
                        cancelButtonText: '放弃转换'
                    }).then(() => {
                    this.batchPotentialExTransferDialogVisible = true;
                    this.getCharacters();
                    this.initPotentialExTable();
                }).catch(action => {
                    this.$message({
                        type: 'info',
                        message: '不转了~'
                    })
                });
            },
            getCharacters() {
                axios.get(`/api/character/GetWorldCharacters?bear=${this.token}`).then((response) => {
                    if (response.data.success) {
                        this.characters = response.data.data;
                    } else {
                        this.$message.error(response.data.message);
                    }
                })
            },
            getTransferBalance() {
                axios.get(`/api/character/GetCharacterProfile?bear=${this.token}&characterID=${this.getPowerfulCharacterID()}`).then((response) => {
                    if (response.data.success) {
                        var c = response.data.data;
                        if (c != null) {
                            this.universalNum = c.currency;
                            this.frequencyNum = c.piece;
                            this.universalUsed = c.currencyUsed;
                            this.universalUnUsed = c.unUsed;
                            this.universalStartTime = c.startTime;
                            this.universalEndTime = c.endTime;
                        }
                    } else {
                        this.$message.error(response.data.message);
                    }
                })
            },
            async initTable() {
                if (this.characterID == '')
                    return;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                this.tableData = await this.queryCharacterMaterializedItems(2, '');

                this.getTransferBalance();
                loading.close();
            },
            async queryCharacterMaterializedItems(localCode, itemName) {
                let materializedItems = [];
                await axios.get(`/api/character/GetCharacterMaterializedItems?bear=${this.token}&itemID=0&characterID=${this.characterID}&localCode=${localCode}&itemName=${itemName}&pageIndex=1&pageSize=300`).then(async (response) => {
                    if (response.data.success) {
                        materializedItems = response.data.data.list.filter(item => { if (item.canChange) { return item } });

                        for (let materializedItem of materializedItems) {
                            await this.setChangeItems(materializedItem);
                            this.interfaceSleep();
                        }
                    } else {
                        this.$message.error(response.data.message);
                    }
                }).catch(function(err) {
                    console.info(err);
                });
                return materializedItems;
            },
            async initPotentialExTable() {
                if (this.powerfulCharacterID == '' || this.characterID == '')
                    return;
                const loading = this.$loading({
                    lock: true,
                    text: 'Loading',
                    spinner: 'el-icon-loading',
                    background: 'rgba(0, 0, 0, 0.7)'
                });

                await axios.get(`/api/character/GetCharacterMaterializedItems?bear=${this.token}&itemID=0&characterID=${this.characterID}&localCode=2&itemName=之月蚀龙玉&pageIndex=1&pageSize=300`).then(async (response) => {
                    if (response.data.success) {
                        this.potentialExTableData = response.data.data.list;
                        for (let item of this.potentialExTableData) {
                            await this.setChangePotentialExs(item);
                            this.interfaceSleep();
                        }
                        this.potentialExTableData = this.potentialExTableData.filter(item => item.potentialExs != null && item.potentialExs.length > 0);
                    } else {
                        this.$message.error(response.data.message);
                    }
                    loading.close();
                }).catch(function(err) {
                    console.info(err);
                    this.$message.error('加载出错');
                    loading.close();
                });
            },
            async setChangeItems(item) {
                await axios.get(`/api/character/GetChangeItems?bear=${this.token}&characterID=${this.characterID}&materializedItemID=${item.materializedItemID}`).then((response) => {
                    if (response.data.success) {
                        Vue.set(item, 'convertibleTypes', response.data.data);
                    } else {
                        this.$message.error(response.data.message);
                    }
                }).catch(function(err) {
                    console.info(err);
                });
            },
            async setChangePotentialExs(item) {
                await axios.get(`/api/character/GetPotentialExList?bear=${this.token}&materializedItemID=${item.materializedItemID}&characterID=${this.getPowerfulCharacterID()}`).then((response) => {
                    if (response.data.success) {
                        Vue.set(item, 'potentialExs', response.data.data);
                    } else {
                        this.$message.error(response.data.message);
                    }
                }).catch(function(err) {
                    console.info(err);
                });
            },
            associationPotentialExSelection(id, row) {
                if (!this.relatedPotentialEx) {
                    return;
                }
                if (id === '' || id === null) {
                    return;
                }
                if (row.itemName.includes('戒指')) {
                    return;
                }
                let potentialEx = row.potentialExs.find(exInfo => {
                    return exInfo.id === id;
                });
                let potentialExName = potentialEx.potentialExName;
                let itemName = row.itemName;
                let jadeBelong = this.getJadeBelong(itemName);

                let attackJade = false;
                if (itemName.includes('攻击')) {
                    attackJade = true;
                }

                this.potentialExTableData.forEach(item => {
                    if (item.itemName.includes('戒指')) {
                        return;
                    }
                    if (attackJade && !itemName.includes('攻击')) {
                        return;
                    }
                    if (!attackJade && itemName.includes('攻击')) {
                        return;
                    }
                    if (jadeBelong !== this.getJadeBelong(item.itemName)) {
                        return;
                    }

                    let tempExInfo = item.potentialExs.find(exInfo => {
                        return exInfo.potentialExName === potentialExName;
                    });
                    if (tempExInfo !== null && tempExInfo !== undefined) {
                        Vue.set(item, 'targetTransferId', tempExInfo.id);
                    }
                });
            },
            getJadeBelong(itemName) {
                for (let i = 0; i < this.equipmentBelongNames.length; i++) {
                    let findBelongName = this.equipmentBelongNames[i].find(belongName => {
                        return itemName.includes(belongName);
                    });
                    if (findBelongName !== null && findBelongName !== undefined && findBelongName !== '') {
                        return i;
                    }
                }
                return -1;
            },
            associationSelection(id, row) {
                if (id === '' || id === null) {
                    return;
                }
                if (row.itemName.includes('月蚀龙玉')) {
                    this.batchTransferJade(id, row);
                }

                if (row.itemName.includes('符文')) {
                    this.batchTransferRunes(id, row);
                }
            },
            batchTransferJade(id, row) {
                if (!this.batchLunarEclipse) {
                    return;
                }
                let dragonJadeJobName = this.getDragonJadeJobName(id, row);
                // console.info(dragonJadeJobName);
                this.tableData.forEach(item => {
                    if (!item.itemName.includes('月蚀龙玉')) {
                        return;
                    }
                    if (item.materializedItemID === row.materializedItemID) {
                        Vue.set(item, 'targetTransferId', id);
                    } else {
                        let convertibleType = item.convertibleTypes.find(typeInfo => {
                            return typeInfo.itemName.includes(dragonJadeJobName);
                        });
                        if (convertibleType != null && convertibleType != undefined) {
                            Vue.set(item, 'targetTransferId', convertibleType.id);
                        }
                    }
                });
            },
            batchTransferRunes(id, row) {
                if (!this.batchRunes) {
                    return;
                }
                let runesName = this.getRunesName(id, row);
                // console.info(runesName);
                this.tableData.forEach(item => {
                    if (!item.itemName.includes('符文')) {
                        return;
                    }
                    let convertibleType = item.convertibleTypes.find(typeInfo => {
                        return typeInfo.itemName === runesName;
                    });
                    if (convertibleType != null && convertibleType != undefined) {
                        Vue.set(item, 'targetTransferId', convertibleType.id);
                    }
                });
            },
            getDragonJadeJobName(id, row) {
                let convertibleType = row.convertibleTypes.find(typeInfo => {
                    return typeInfo.id === id;
                });

                let name = convertibleType.itemName;
                if (name.startsWith('冱龙')) {
                    return name.slice(2, 4);
                } else {
                    return name.slice(0, 2);
                }
            },
            getRunesName(id, row) {
                let convertibleType = row.convertibleTypes.find(typeInfo => {
                    return typeInfo.id === id;
                });

                return convertibleType.itemName;
            },
            async doJobTransfer(changeitemID, changeitemName, targetTransferId, materializedItemID, changeitePotential, transferType) {
                let result;
                await $.ajax({
                    type: 'get',
                    url: `/api/character/UseFrequency?bear=${this.token}&characterID=${this.getPowerfulCharacterID()}&t=${transferType}&itemID=${changeitemID}&itemName=${changeitemName}&local=2&id=${targetTransferId}&materializedItemID=${materializedItemID}&potential=${changeitePotential}`,
                    async: true,
                    data: {},
                    success: function (response) {
                        // console.info(JSON.stringify(response));
                        result = response.success;
                    },
                    error: function () {

                    }
                });

                return result;
            },
            async doChangePotentialEx(materializedItemID, potentialExId) {
                let result;
                await $.ajax({
                    type: 'get',
                    url: `/api/character/ChangePotentialEx?bear=${this.token}&materializedItemID=${materializedItemID}&potentialExId=${potentialExId}&characterID=${this.getPowerfulCharacterID()}`,
                    async: true,
                    data: {},
                    success: function (response) {
                        // console.info(JSON.stringify(response));
                        result = response.success;
                    },
                    error: function () {

                    }
                });

                return result;
            },
            getCharacterItemChangeCount() {
                axios.get(`/api/character/GetCharacterItemChangeCount?bear=${this.token}&characterID=${this.characterID}`).then((response) => {
                    if (response.data.success) {
                        if (response.data.data.inTime) {
                            return response.data.data.unUsed;
                        }
                    }
                    return 0;
                })
            },
            sleep(delay) {
                var start = (new Date()).getTime();
                while((new Date()).getTime() - start < delay) {
                    continue;
                }
            },
            interfaceSleep() {
                this.sleep(100);
            },
            cancel() {
                this.batchJobTransferDialogVisible = false;
            },
            async confirmPotential() {
                if (!this.confirmAble) {
                    return;
                }
                let changeItems = this.potentialExTableData.filter(item => { if (item.targetTransferId != null && item.targetTransferId != '') { return item } });
                console.info(JSON.stringify(changeItems));

                if (changeItems.length === 0) {
                    this.$message({
                        type: 'info',
                        message: '要先选择变更后是什么哦~'
                    })
                    return;
                }
                this.confirmAble = false;

                let toBeTransferItem = '';
                changeItems.forEach(changeItem => {
                    toBeTransferItem = toBeTransferItem + `<div>${changeItem.itemName}</div>`;
                    console.info('updateInfo=', {
                        itemID: changeItem.itemID,
                        changeitemName: changeItem.itemName,
                        targetTransferId: changeItem.targetTransferId,
                        materializedItemID: changeItem.materializedItemID,
                        changeitePotential: changeItem.itemPotential
                    });
                });

                const confirmRes = await this.$confirm(`<strong>将对以下物品进行潜力转换</strong><br/><div style="max-height:300px;overflow:auto">${toBeTransferItem}</div>`,
                    '潜力转换确认', {
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确认转换',
                        cancelButtonText: '放弃转换'
                    }).catch(action => {
                    console.info(action);
                    this.confirmAble = true;
                });

                if (confirmRes !== 'confirm') {
                    this.$message({
                        type: 'info',
                        message: '你怕了？'
                    })
                    this.confirmAble = true;
                    return;
                }

                this.showProgress();
                let totalCnt = changeItems.length;
                let transferCnt = 0;

                for (let changeItem of changeItems) {
                    let targetTransferId = changeItem.targetTransferId;
                    let materializedItemID = changeItem.materializedItemID;
                    let changeitemName = changeItem.itemName;

                    let transferResult = await this.doChangePotentialEx(materializedItemID, targetTransferId);
                    console.info(JSON.stringify(transferResult));
                    if (!transferResult) {
                        this.$message.error(`${changeitemName}转换潜力失败,停止转换`);
                        this.hideProgress();
                        return;
                    }
                    await this.$message({
                        type: 'success',
                        message: `${changeitemName}转换潜力成功~`
                    })
                    transferCnt += 1;
                    this.loadProcess(transferCnt, totalCnt);
                    this.interfaceSleep();
                }
                this.confirmAble = true;
            },
            getPowerfulCharacterID() {
                let characterID = this.characterID;
                if (this.powerfulCharacterID != '') {
                    characterID = this.powerfulCharacterID;
                }
                return characterID;
            },
            async confirm() {
                if (!this.confirmAble) {
                    return;
                }
                let changeItems = this.tableData.filter(item => { if (item.targetTransferId != null && item.targetTransferId != '') { return item } });
                if (changeItems.length === 0) {
                    this.$message({
                        type: 'info',
                        message: '要先选择变更后是什么哦~'
                    })
                    return;
                }

                if (this.universal === '') {
                    this.$message({
                        type: 'info',
                        message: '请选择转职方式'
                    })
                    return;
                }

                let transferTypeName = '';
                if (this.universal === 'universal') {
                    transferTypeName = '万能';
                } else if (this.universal === 'frequency') {
                    transferTypeName = '件数';
                } else {
                    this.$message({
                        type: 'info',
                        message: '不支持的转职方式'
                    })
                    return;
                }
                this.confirmAble = false;

                let toBeTransferItem = '';
                changeItems.forEach(changeItem => {
                    toBeTransferItem = toBeTransferItem + `<div>${changeItem.itemName}</div>`;
                    console.info('updateInfo=', {
                        itemID: changeItem.itemID,
                        changeitemName: changeItem.itemName,
                        targetTransferId: changeItem.targetTransferId,
                        materializedItemID: changeItem.materializedItemID,
                        changeitePotential: changeItem.itemPotential
                    });
                });

                const confirmRes = await this.$confirm(`将对以下物品进行<strong>${transferTypeName}转职</strong><br/><div style="max-height:300px;overflow:auto">${toBeTransferItem}</div>`,
                    '转职确认', {
                        dangerouslyUseHTMLString: true,
                        confirmButtonText: '确认转职',
                        cancelButtonText: '放弃转职'
                    }).catch(action => {
                    console.info(action);
                    this.confirmAble = true;
                });

                if (confirmRes !== 'confirm') {
                    this.$message({
                        type: 'info',
                        message: '你怕了？'
                    })
                    this.confirmAble = true;
                    return;
                }

                this.showProgress();
                let totalCnt = changeItems.length;
                let transferCnt = 0;
                for (let changeItem of changeItems) {
                    let targetTransferId = changeItem.targetTransferId;
                    let materializedItemID = changeItem.materializedItemID;
                    let changeitemID = changeItem.itemID;
                    let changeitemName = changeItem.itemName;
                    let changeitePotential = changeItem.itemPotential;

                    let transferResult = false;
                    if (this.universal === 'universal') {
                        transferResult = await this.doJobTransfer(changeitemID, changeitemName, targetTransferId, materializedItemID, changeitePotential, 2);
                    } else if (this.universal === 'frequency') {
                        transferResult = await this.doJobTransfer(changeitemID, changeitemName, targetTransferId, materializedItemID, changeitePotential, 1);
                    } else {
                        this.$message.error(`不支持的职业转换方式,停止转换`);
                        return;
                    }
                    if (!transferResult) {
                        this.$message.error(`${changeitemName}转换职业失败,停止转换`);
                        return;
                    }
                    await this.$message({
                        type: 'success',
                        message: `${changeitemName}转换职业成功~`
                    })
                    transferCnt += 1;
                    this.loadProcess(transferCnt, totalCnt);
                    this.interfaceSleep();
                }
                this.confirmAble = true;
                this.initTable();
            },
            showProgress() {
                this.isShowProgress = true;
            },
            hideProgress() {
                this.isShowProgress = false;
            },
            loadProcess(curent, total) {
                this.progressPercentage = Math.floor((curent * 100 / total).toFixed(2));
                if (this.progressPercentage === 100) {
                    setTimeout(() => {
                        this.progressPercentage = 0;
                        this.hideProgress();
                        this.$message({
                            type: 'success',
                            message: `批处理成功~`
                        })
                    }, 1000);
                }
            }
        },
        destroyed() {
            $('#vueApp').remove()
        }
    })
})();