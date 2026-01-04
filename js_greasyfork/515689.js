// ==UserScript==
// @name         小助手
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  预审助手2
// @author       大魔王
// @match        http://172.20.234.92:7018/iaic-vue/business/common/TabControlPre*
// @match        http://172.20.234.92:7018/iaic-vue/approve/approvePre/nz/*
// @match        http://172.20.234.92:7018/iaic-vue/approve/approvePre/hzs/*
// @match        http://172.20.234.92:7018/iaic-vue/approve/approvePre/*/*
// @match        http://172.20.234.92:8000/auth/jsp/optimus/public/signin.jsp*

// @require https://update.greasyfork.org/scripts/455943/1270016/ajaxHooker.js
// @require https://update.greasyfork.org/scripts/474584/1245726/ElementGetter%E5%BC%80%E6%BA%90%E5%BA%93.js
// @grant        GM_xmlhttpRequest
// @connect      172.20.234.92
// @grant        GM_addStyle
// @grant        unsafeWindow
// @grant        GM_info



// @downloadURL https://update.greasyfork.org/scripts/515689/%E5%B0%8F%E5%8A%A9%E6%89%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/515689/%E5%B0%8F%E5%8A%A9%E6%89%8B.meta.js
// ==/UserScript==

(function() {
    'use strict';
    /*
    v0.21 账号信息修正、预审列表请求秘钥动态获取
    v0.22 1.合作社页面网址适配/2.增加切换公司、合作社按钮/3、更稳定的获取当前用户getUserInfo
    v0.23 username.trim()
    v0.3 1.分公司判断条件增加orgform.length<3 2.预审通过时警示信息提前看（未完成） 3.自行撤回时统计有误BUG修改 4.统计数据出错BUG 5.获取用户名优化
    */
    // 预审列表1私营 5个体 6合作社 http://172.20.234.92:7018/iaic-vue/approve/approvePre/nz/1


    var runCount=0;//运行次数
    let updateUrl = 'https://greasyfork.org/zh-CN/scripts/515689-%E5%B0%8F%E5%8A%A9%E6%89%8B';
    let dataJBXX,dataCZXX,dataRYXX,dataLLR,dataWTRXX;//基本信息，出资信息，人员信息，联络员，委托人
    //山东中亚宝丰餐饮管理服务有限公司 物理分割 ；临沂魔方跨境电子商务有限公司 地址与临沂佩轩电子商贸有限公司重复 ；
    let sotpArr = ['天同食品','泰鲁','群盈','国尧','访惠汽车','东进中小','汇智信','风清气正（临沂）产业发展有限公司','临沂福星建筑劳务分包有限公司','临沂魔方跨境电子商务有限公司'];//限制办理业务企业名单，可写部分名称，也可写全称
    let findArr = ['实业', '发展', '建设', '传媒', '科技', '工程', '实业发展', '集团','资本投资'];
    let findArray = ['制造','生产','加工','危险','化工','化学','投资','金融','融资','破产清算','园林绿化工程施工','单用途商业预付卡代理销售','养殖'];//禁用的关键字，可增加
    let _userName;
    console.log(GM_info,`【${GM_info.script.name}】当前版本【${GM_info.script.version}】`);
    hookXhr();
    unsafeWindow.onload = function(){

        let url = unsafeWindow.location.pathname;
        isTag(url);
        if(document.querySelector("#app")){
            document.querySelector("#app").__vue__.$router.afterHooks.push(() => {//监听vue前端路由改变
                console.log("路由发生改变");
                url = unsafeWindow.location.pathname;
                isTag(url);


            });
        }




    }
    async function isTag(url){

        if('/auth/jsp/optimus/public/signin.jsp'===url){//登陆界面
            console.log('登陆界面');
            myLogin(document.querySelector('#userName'),document.querySelector('#password'),document.querySelector('.login-msg-div ').parentNode);
        }
        if('/iaic-vue/business/common/TabControlPre'===url){//预审页面
            console.log('预审页面');
            createModal();
            getBusinessType().then(result=>{//获取业务类型
                console.log('业务类型：',result);
                getAllDataSL().then(() =>{
                    console.log('基本信息',dataJBXX[0].ENTNAME);
                    queryMcglJbxxZs(dataJBXX[0].ENTNAME).then((data)=>{
                        //名称核验  (entname, nameDistrict, enttra, nameind, orgform) {//全称、区划、字号、行业、组织形式
                        console.log('tttttttttttttttt',data);
                        parseCompanyName(data.entname,data.namedistrict,data.enttra,data.nameind,data.orgform);
                    });
                });//默认执行一次


                if('设立'===result){

                }
                if('变更'===result){

                }
                if('注销'===result){

                }
                if('备案'===result){

                }
                if('增补照'===result){

                }
            });
        }
        if('/iaic-vue/approve/approvePre/nz/'===url.slice(0,-1)||'/iaic-vue/approve/approvePre/hzs/'===url.slice(0,-1)){//预审列表页面   slice(0, -1) 的意思是从索引 0 开始提取，直到倒数第一个字符之前（不包括倒数第一个字符）。
            console.log('列表页面');
            if(document.querySelector('#draggableModal')){
                document.querySelector('#draggableModal').remove();

            }
            if(document.querySelector('#modalBtn')){
                document.querySelector('#modalBtn').remove();
            }
            setListStyle();
            if(!_userName){
                _userName= await getUserInfo();
                console.log('_userName',_userName);
            }
            /*             const ob = styleMutationObserver(url);
            console.log('obbbbbbbbbbbbbbbb',ob); */

        }
    }
    function parseCompanyName(entname, nameDistrict, enttra, nameind, orgform) {//全称、区划、字号、行业、组织形式
        //将传入的企业名称，同时传入公司类型  进行检查0、是否为限制做业务的企业 1、集团2、五大行业3、无区划
        //解析名字：区划、字号、行业、组织形式

        let str = '警惕名称中的陷阱！！！';
        let flage = false;
        let reco = -1;
        //名称有陷阱，则true
        console.log(`${entname}=>\n区划【${nameDistrict}】,字号【 ${enttra}】, 行业【${nameind}】,组织形式【${orgform}】`);
        //是否是限制做业务的企业sotpArr
        for(let i=0;i<sotpArr.length;i++){
            if(entname.indexOf(sotpArr[i]) >= 0){//找到限制企业
                alert("该企业为限制名单中禁止做业务的企业，禁止预审！！！");
                return;
            }
        }

        if(orgform){//组织形式为分公司，或者queryMcjbxxZs()获取不到字号信息
            if(orgform.indexOf('分公司')>=0||!enttra||orgform.length<3){//orgform.length 店 铺 中心 不一定准确
                console.log('分公司，不做判断');
                return;//*********************分公司不限制区划***
            }
        }else{
            if(!enttra){
                console.log('分公司，不做判断');
                return;//*********************分公司不限制区划***
            }
        }
        //若是 查询不到 山东、临沂、河东字样，怀疑为无字号。除了分公司
        for (let i = 0; i < findArr.length; i++) {
            if(!nameind){
                str +=`【无行业】`;
                flage = true;
                break;
            }
            if (nameind == findArr[i]) {//找到行业
                str += `【${findArr[i]}】`;
                flage = true;
            }

        }
        if(orgform){//集团在组织形式中，单独判断
            if(orgform.indexOf('集团')>=0){
                str += `【集团】`;
                flage = true;
            }
        }
        if(!nameDistrict){//无区划
            str +=`【无区划】`;
            flage = true;
        }
        if (flage) {
            console.log(str);
            alert(str);
            flage = false;
        }


    }
    async function getBusinessType(){//获取业务类型
        //let t = document.querySelector('.el-step__title.is-doing');
        let type=0;
        let t = await elmGetter.get('.el-step__title.is-doing');

        if('基本信息'===t.textContent){
            type = '设立';
        }
        if('变更事项'===t.textContent){
            type = '变更';
        }
        if('注销信息'===t.textContent){
            type = '注销';
        }
        if('备案事项'===t.textContent){
            type = '备案';
        }
        if('私营增补照信息'===t.textContent){
            type = '增补照';
        }
        //console.log(type,t);
        return type;
    }
    function setListStyle() {//预审列表优化

        console.log('预审列表优化');
        document.querySelectorAll('th div.cell').forEach((ele,index)=>{
            //console.log(index,ele);
            if ('负责人' === ele.textContent) {
                ele.textContent = '负责人/代理';
            }
            if ('退回人/撤回人' === ele.textContent) {
                ele.textContent = '退回人/在看人';
            }
        } );

        elmGetter.each('.el-tabs__content #pane-1 .list-body .el-table__row',(elm)=>{
            if(elm.cells.length!=15) return;//未测试是否有效,预审通过后返回预审页面下面会报错
            elm.children[7].children[0].style = 'font-size: 12px;text-align: left;padding:0;';
            elm.children[8].children[0].style = 'font-size: 12px;text-align: left;';


        });
        let update = document.createElement('button');
        update.textContent = '✎小助手更新';
        update.id = 'zsUpdate';
        //update.style="cursor:pointer;";
        update.className = 'el-button';
        update.title = `当前版本【${GM_info.script.version}】`;
        update.onclick = function(){
            window.open(updateUrl,'_blank');
        }
        //公司 合作社切换
        //切换按钮，切换 【公司】、【合作社】
        let changeButton = document.createElement('button');
        let tagNum = unsafeWindow.location.pathname.slice(-1);//获取地址最后一位，1 公司  6：合作社
        changeButton.textContent = tagNum==1?"切换至合作社◑":"◐切换至公司";
        changeButton.id = 'gsButton';
        changeButton.className = 'el-button ';
        changeButton.style="margin-left: 15%;";
        changeButton.onclick = function(){
            let newUrl ;
            if("/iaic-vue/approve/approvePre/nz/1"===unsafeWindow.location.pathname){
                newUrl = "http://172.20.234.92:7018/iaic-vue/approve/approvePre/hzs/6";
            }else{
                newUrl = "http://172.20.234.92:7018/iaic-vue/approve/approvePre/nz/1";
            }

            window.location.href = newUrl;
        }


        //数据统计显示栏
        let countSpan = document.createElement('span');
        countSpan.id = 'countSpan';
        countSpan.style = "margin: 0 0 0 1%;cursor:pointer;border-bottom-style: inset;";
        countSpan.title = '点击可刷新数据';
        countSpan.textContent = '数据统计： 总数，退回重报，我退回的，今日新报 ';


        elmGetter.get('.el-tabs__nav.is-top').then(elm=>{
            elm.append(update);
            elm.append(countSpan);
            document.querySelector('#pane-1>.com-list-area.page-box').firstChild.append(changeButton);

        });
        //document.querySelector('.el-tabs__nav.is-top').append(countSpan);
        countSpan.onclick = function(){
            queryAllList(1).then(reslut=>{
                getCount(reslut.data);
            }).catch(error=>{
                console.error('hook函数中调用queryAllList错误:', error);
            }
                    );
        }
    }

    /*     function styleMutationObserver(url) {
        //监听预审列表刷新
        if('/iaic-vue/approve/approvePre/nz/'!= url.slice(0,-1)){
            // 你可以通过以下方式停止观察
            //console.log('停止监听预审列表',url);
            //observer.disconnect();

        }

        // 选择目标节点
        const target = document.querySelector('.el-loading-mask');
        // 创建一个观察者对象
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.attributeName === 'style') {
                    const displayValue = target.style.display;
                    if (!displayValue) {
                        console.log('检测到数据刷新');
                    } else {
                        console.log('数据刷新完成，display变化:', displayValue);
                        //调用列表优化函数
                        queryAllList();
                    }

                }
            });
        }
                                             );
        // 观察者的配置（观察目标节点的哪些属性变化）
        const config = {
            attributes: true,
            attributeOldValue: true,
            attributeFilter: ['style']
        };
        // 传入目标节点和观察选项并开始观察
        observer.observe(target, config);
        console.log('开始监听预审列表',url);
        return Math.random();
    } */


    function createModal(){//创建蓝色阴影边框透明弹窗
        if(!document.querySelector('#draggableModal')){
            const closeSvgString =`
        <?xml version="1.0" encoding="UTF-8"?><svg width="24" id ="closeSvg"  height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg" ><path d="M14 14L34 34" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 34L34 14" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        `;
            const searchSvgString =`
        <?xml version="1.0" encoding="UTF-8"?><svg width="24" id="searchSvg" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M40 27V6C40 4.89543 39.1046 4 38 4H10C8.89543 4 8 4.89543 8 6V42C8 43.1046 8.89543 44 10 44H21" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 12L31 12" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 20L31 20" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M17 28H23" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M37 37C37 38.3807 36.4404 39.6307 35.5355 40.5355C34.6307 41.4404 33.3807 42 32 42C29.2386 42 27 39.7614 27 37C27 34.2386 29.2386 32 32 32C34.7614 32 37 34.2386 37 37Z" fill="none"/><path d="M39 44L35.5355 40.5355M35.5355 40.5355C36.4404 39.6307 37 38.3807 37 37C37 34.2386 34.7614 32 32 32C29.2386 32 27 34.2386 27 37C27 39.7614 29.2386 42 32 42C33.3807 42 34.6307 41.4404 35.5355 40.5355Z" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        `;
            const dragSvgSting = `
        <?xml version="1.0" encoding="UTF-8"?><svg width="24" id="dragSvg" height="24" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M9.58303 27.1824C7.86719 28.3542 7.00928 30.2934 7.00928 33.0002C7.00928 37.0602 12.0001 44.0002 16.5006 44.0002C21.001 44.0002 23.6111 44.0002 28.016 44.0002C32.421 44.0002 35.0965 40.1495 35.0965 37.0602C35.0965 32.9069 35.0965 28.7536 35.0965 24.6002C35.0965 22.8072 33.6456 21.3522 31.8525 21.3472C30.0659 21.3422 28.6135 22.7865 28.6085 24.5731C28.6085 24.5761 28.6085 24.5791 28.6085 24.5821V24.6836" stroke="#333" stroke-width="4" stroke-linecap="round"/><path d="M10.9814 29.4453V7.66246C10.9814 5.88568 12.4218 4.44531 14.1986 4.44531C15.9754 4.44531 17.4157 5.88568 17.4157 7.66246V23.6479" stroke="#333" stroke-width="4" stroke-linecap="round"/><path d="M17.4155 24.0001V19.8076C17.4155 18.2589 18.671 17.0034 20.2197 17.0034C21.7684 17.0034 23.0239 18.2589 23.0239 19.8076V24.4272" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M23 24.6583V21.8076C23 20.2589 24.2555 19.0034 25.8042 19.0034C27.3529 19.0034 28.6084 20.2589 28.6084 21.8076V25.0034" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/><path d="M11 8H41" stroke="#333" stroke-width="4" stroke-linecap="round"/><path d="M36 12.5L37.6667 11L41 8L37.6667 5L36 3.5" stroke="#333" stroke-width="4" stroke-linecap="round" stroke-linejoin="round"/></svg>
        `;


            let modalStyle = `#draggableModal{position:fixed;right:30%;bottom:14%;height:60%;width:40%;display:none;border:1px solid #ccc;box-shadow:#3164f6 0 2px 10px;z-index:1000;padding:20px;box-sizing:border-box;cursor:move}#searchSvg{cursor:pointer}#closeSvg{--margin-left:75%;cursor:pointer}#dragSvg{margin-left:40%;margin-right:40%}`;

            let modal = document.createElement('div');
            modal.id = 'draggableModal';
            modal.innerHTML = `${searchSvgString}${dragSvgSting}${closeSvgString}</br> <span id='modalSpan'>
     ↑↑↑  <span style="display:inline-block; width:40%; height:1px;"></span>
     ↑↑↑  <span style="display:inline-block; width:40%; height:1px;"></span>
     ↑↑↑<br>
     点击获取或刷新数据  <span style="display:inline-block; width:14%; height:1px;"></span>  可拖动窗口  &nbsp;&nbsp; &nbsp;&nbsp; &nbsp;&nbsp;关闭或再次点击小助手按钮
  </span></br>`;
            //GM_addStyle(modalStyle);
            if(runCount===0){
                GM_addStyle(modalStyle);
            }
            document.body.appendChild(modal);
            let isDragging = false;
            let offsetX, offsetY;
            const dragBtn = document.querySelector('#dragSvg');

            modal.addEventListener('mousedown', function(e) {
                isDragging = true;
                offsetX = e.clientX - modal.offsetLeft;
                offsetY = e.clientY - modal.offsetTop;
                document.body.style.userSelect = 'none'; // 防止拖拽过程选择文本
            });
            document.addEventListener('mousemove', function(e) {
                if (isDragging) {
                    modal.style.left = e.clientX - offsetX + 'px';
                    modal.style.top = e.clientY - offsetY + 'px';
                }
            });
            document.addEventListener('mouseup', function() {
                isDragging = false;
                document.body.style.userSelect = ''; // 再次允许文本选择
            });
            const closeBtn = document.querySelector('#closeSvg');
            const searchBtn = document.querySelector('#searchSvg');
            closeBtn.title = '关闭';
            searchBtn.title = '一键获取数据';



            closeBtn.addEventListener('click',function(e){
                //this.parentNode.style.display = 'none';
                closeModal();
            });
            searchBtn.addEventListener('click',function(e){
                console.log(this.title);
                getAllDataSL();

            });

        }

        if(!document.querySelector('#modalBtn')){
            //创建显示按钮
            let modalBtn = document.createElement('div');
            modalBtn.className = 'btn-animate btn-animate__surround';
            modalBtn.id = 'modalBtn';
            modalBtn.innerHTML = `
        <span>
     小助手
  </span>`;
            const btnStyle=`
.btn-animate {
    position: relative;
    width: 130px;
    height: 40px;
    line-height: 40px;
    border: 0;
    border-radius: 5px;
    background: #027efb;
    color: #fff;
    text-align: center;
    margin: -3% 1% 1% 1%;
    z-index: 1000;
    cursor:pointer;
}


.btn-animate__surround {
  &::before, &::after {
    content: '';
    position: absolute;
    right: 0;
    top: 0;
    background: #027efb;
    transition: all 0.3s ease;
  }

  &::before {
    height: 0%;
    width: 2px;
  }

  &::after {
    width: 0%;
    height: 2px;
  }

  &:hover {
    background: transparent;

    &::before {
      height: 100%;
    }

    &::after {
      width: 100%;
    }
  }

  & > span {
    display: block;

    &:hover {
      color: #027efb;

      &::before {
        height: 100%;
      }

      &::after {
        width: 100%;
      }
    }

    &::before, &::after {
      content: '';
      position: absolute;
      left: 0;
      bottom: 0;
      background: #027efb;
      transition: all 0.3s ease;
    }

    &:before {
      width: 2px;
      height: 0%;
    }

    &:after {
      width: 0%;
      height: 2px;
    }
  }
}
            `;

            //document.body.append(modalBtn);
            /*         setTimeout(function(){//测试百度首页
            console.log('1111',document.querySelector('#s-top-left'));
        document.querySelector('#s-top-left').append(modalBtn);
        },300); */

            if(runCount===0){
                GM_addStyle(btnStyle);
            }

            //document.querySelector('.page-wrap.page-flex').appendChild(modalBtn);
            document.body.appendChild(modalBtn);


            modalBtn.addEventListener('click',function(){
                let display = document.querySelector('#draggableModal').style.display;
                if('block'==display){
                    closeModal();
                }else{
                    showModal();

                }

            });
        }
        runCount++;
        console.log('创建modal完毕');

    }
    function showModal(){
        document.querySelector('#draggableModal').style.display = 'block';
    }
    function closeModal(){
        document.querySelector('#draggableModal').style.display = 'none';
    }

    async function getAllDataSL(){//设立时候获取所有信息
        dataJBXX = await queryAllCreate("GSDJ_JBXX_EDIT","QYDJ_JBXX_LC","JBXX_KZXX_LC");
        /*         dataCZXX = await queryAllCreate("QYDJ_CZXX_EDIT", "QYDJ_CZXX_LC");
        dataRYXX = await queryAllCreate("QYDJ_RYXX_EDIT", "QYDJ_RYXX_LC");
        dataLLR = await queryAllCreate("WZFR_LLR_EDIT","QYDJ_LLR_LC");
        dataWTRXX = await queryAllCreate("QYDJ_YWBLWTRXX_EDIT","QYDJ_YWBL_WTRXX"); */
        console.log(dataJBXX);
    }
    async function getCount(data){
        console.log('getCount',data);
        //console.log(data.total,data.list); // 这里你可以处理你的数据
        //退回时间 backdate  申请日期 recentSavetime   退回人   opper
        let userName = unsafeWindow.username;
        let total = data.total;
        //总数
        let backCount = 0;
        //退回重报数
        let myBackCount = 0;
        let myBackCountArray = new Array();
        //我退回的
        let newDayCount = 0;
        //今日新报
        let noOpperCount = 0;//未审核
        let oldNoOpperCount = 0;//往日未审

        let backDateArray = new Array();
        //退回时间
        let opperArray = new Array();
        //退回人
        let apprperArray = new Array();//在看人
        let newDay = getCurrentDateFormatted();//今天日期，格式"2024-09-03"
        if(!_userName){
            _userName= await getUserInfo();
            console.log('_userName',_userName);
        }

        if(!userName){
            userName = _userName;
            console.log('设置userName为_userName',userName);
        }
        if('王昭媛'===userName){//账号信息不对
            userName = '郇梦娇2';
            console.log('账号信息修正userName',userName);
        }
        let o =0;

        for (let i = 0; i < data.list.length; i++) {
            if(data.list[i].apprper){//我在看的,需排除我退回的
                if(userName === data.list[i].apprper){
                    if(data.list[i].opper != userName){
                        apprperArray.push(data.list[i].entname);
                    }

                }

            }
            if (data.list[i].backdate) {
                data.list[i].backdate = data.list[i].backdate.split(' ')[0];//去掉退回日期后的时分秒
                backDateArray[i] = data.list[i].backdate;
            }

            if (data.list[i].recentSavetime) {
                data.list[i].recentSavetime = data.list[i].recentSavetime.split(' ')[0];
                //console.log('recentSavetime',data.list[i].recentSavetime,newDay,data.list[i].recentSavetime==newDay,data.list[i].opper);
                if(data.list[i].recentSavetime == newDay && data.list[i].appropin==null){//今日申报,需去掉退回的(没退回意见说明是新报的-撤回的会没有退回人)

                    newDayCount++;

                    //console.log('今日新报',newDayCount,data.list[i].entname,data.list[i].opper,data.list[i].recentSavetime);
                }
            }
            if (data.list[i].appropin) {//appropin 退回意见
                //console.log('退回重报:',data.list[i].entname);

                if (data.list[i].opper === userName) {//我退回的
                    myBackCount++;//我退回的第一种统计方法
                    myBackCountArray.push(data.list[i].entname);
                }else if(data.list[i].opper==null&&data.list[i].appropin){//有退回意见没有退回人，说明是自行撤回
                    data.list[i].opper ='自行撤回';
                    console.log('自行撤回:',data.list[i].entname,data.list[i].appropin);
                }
                opperArray[o++] = data.list[i].opper;//opperArray不能使用i计数，会有跳过对应data中的空值赋值
            }else{
                if(data.list[i].recentSavetime!=newDay){
                    //console.log('往日未审',data.list[i].entname);
                    oldNoOpperCount++;//往日未审
                }
                noOpperCount++;//未审核
                //console.log('未审核',data.list[i].entname);
            }
        }

        console.log('退回S重报',opperArray);
        backCount = opperArray.length;
        let backMap = countOccurrencesWithMap(opperArray);       
        let strr = '退回重报\n';
        //console.log('aaa',backMap);
        //降序排序
        let sortedMapByValue = new Map([...backMap.entries()].sort((a, b) => b[1] - a[1]));
        //console.log('bbb',sortedMapByValue);

        sortedMapByValue.forEach((value, key) => {
            //console.log(key, value,`key=${key}userName=${userName}`,'key== userName-',key==userName);
            strr +=`${key}, ${value}\n`;
            if(key===userName){

                myBackCount = value;//我退回的第二种统计方法
            }

        });

        //console.log('我退回的',userName, myBackCount);
        if(myBackCountArray.length>0){
            strr+=`--------------------\n我退回的\n`;
            myBackCountArray.forEach((value,key)=>{
                strr += `${key+1}, ${value}\n`;
            });

        }
        if(apprperArray.length>0){
            strr +=`--------------------\n我在看的\n`;
            apprperArray.forEach((value,key)=>{
                strr += `${key+1}, ${value}\n`;
            });
        }

        //****
        let str = `数据统计： 总数:${total}，退回重报:${backCount}，我 [ ${userName} ] 退回的:${myBackCount}，未审核：${total-backCount}，往日未审:${total-backCount-newDayCount}，今日新报:${newDayCount}`;
        let str1 = `数据统计： 总数:${total}，退回重报:${backCount}，我 [ ${userName} ] 退回的:${myBackCount}，未审核：${noOpperCount}，往日未审:${oldNoOpperCount}，今日新报:${newDayCount}`;
        console.log(str,`\n`,str1);
        elmGetter.get('#countSpan').then(elm=>{
            elm.textContent = str1;
            elm.title =strr ;
        });
        //简单计算数据关系，数据有误时弹窗  总数=退回重报+未审核    未审核 = 往日未审核+今日新报
        if(total!=backCount+noOpperCount || noOpperCount != oldNoOpperCount+ newDayCount){
            console.log('数据统计出错！仅供参考  总数total=退回重报backCount+未审核noOpperCount',total,'!=',backCount+noOpperCount,
                        '\n未审核noOpperCount = 往日未审核oldNoOpperCount+今日新报newDayCount',noOpperCount ,'!=', oldNoOpperCount+ newDayCount);
            alert('数据统计出错！仅供参考');
        }


    }
    function getCurrentDateFormatted() {//用于getCount()
        const now = new Date();
        const year = now.getFullYear();
        // 获取完整的年份
        const month = String(now.getMonth() + 1).padStart(2, '0');
        // 月份是从0开始的，所以要加1，并使用padStart来确保是两位数
        const day = String(now.getDate()).padStart(2, '0');
        // 使用padStart来确保是两位数
        return `${year}-${month}-${day}`;
    }
    function countOccurrencesWithMap(arr) {  //统计数组各个元素出现的次数,实现各个人退回业务数量 ，用于getCount()
        const countMap = new Map();
        arr.forEach(item => {
            if (countMap.has(item)) {
                countMap.set(item, countMap.get(item) + 1);
            } else {
                countMap.set(item, 1);
            }
        });
        return countMap;
    }


    //**************************************************************************************************************************************************************
    //**********************************************************************fetch请求begin**************************************************************************

    /*     function getUserInfo(){//获取登录信息
        let username;
        GM_xmlhttpRequest({
            url:"http://172.20.234.92:8000/bsp/service/bsp/userinfo",
            method :"GET",
            onload:function(xhr){
                let htmlString = xhr.responseText;
                // 使用DOMParser将HTML字符串解析为Document对象
                const parser = new DOMParser();
                const doc = parser.parseFromString(htmlString, 'text/html');
                let userInfo = doc.querySelectorAll('.col-xs-3.col-md-3.text-right');
                for(let i=0;i<userInfo.length;i++){
                    if("用户名称"===userInfo[i].textContent){
                        username = userInfo[i].nextElementSibling.textContent;
                        break;
                    }
                }
                console.log('获取到用户名',username,doc);
                return username;
            }
        });

    } */
    /*     async function getUserInfo_old() {  //获取登录信息返回用户名
        try {
            // 创建一个Promise来封装GM_xmlhttpRequest的异步行为
            const xhrPromise = new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: "http://172.20.234.92:8000/bsp/service/bsp/userinfo",
                    method: "GET",
                    onload: function(xhr) {
                        let htmlString = xhr.responseText;
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(htmlString, 'text/html');
                        let userInfoElements = doc.querySelectorAll('.col-xs-3.col-md-3.text-right');
                        let username = null;
                        for (let i = 0; i < userInfoElements.length; i++) {
                            if (userInfoElements[i].textContent.trim() === "用户名称") {
                                username = userInfoElements[i].nextElementSibling.textContent.trim();
                                break;
                            }
                        }
                        resolve(username); // 解析Promise并返回用户名
                    },
                    onerror: function(xhr) {
                        reject(new Error(`getUserInfo请求失败: ${xhr.statusText}`)); // 拒绝Promise并返回错误信息
                    }
                });
            });

            // 使用await等待Promise的解析
            const userName = await xhrPromise;
            console.log('获取到用户名', userName);
            return userName; // 返回用户名
        } catch (error) {

            console.error('获取用户名时出错:', error);
            throw error; // 重新抛出错误，以便调用者可以处理它
        }
    } */

    async function getUserInfo() {  //获取登录信息返回用户名新方法，防止第一种方法修改用户密码页面无法访问（经常无法访问）
        try {
            // 创建一个Promise来封装GM_xmlhttpRequest的异步行为
            const xhrPromise = new Promise((resolve, reject) => {
                GM_xmlhttpRequest({
                    url: "http://172.20.234.92:8000/portal/jsp/management/index_new.jsp?appCode=mrplatform",
                    method: "GET",
                    onload: function(xhr) {
                        let username = null;
                        let htmlString = xhr.responseText;
                        const parser = new DOMParser();
                        const doc = parser.parseFromString(htmlString, 'text/html');
                        console.log('*-*****************',doc);

                        //*******
                        const userInfoScript = doc.querySelectorAll('head script');
                        for(let p=0;p<userInfoScript.length;p++){
                            let userInfoR = userInfoScript[p].innerHTML.split(';');
                            for(let i=0;i<userInfoR.length;i++){
                                //console.log(userInfoR[i]);
                                if(userInfoR[i].indexOf('username =')>=0){
                                    username = userInfoR[i].split('=')[1].replace("'","").replace("'","").trim();//获取到username
                                    break;
                                }
                            }
                        }

                        //*********
                        /*                         const userInfoScript = doc.querySelectorAll('head script')[7].innerHTML;
                        let userInfoR = userInfoScript.split(';');
                        console.log('spspspsps',userInfoR);
                        for(let i=0;i<userInfoR.length;i++){
                            //console.log(userInfoR[i]);
                            if(userInfoR[i].indexOf('username =')>=0){
                                username = userInfoR[i].split('=')[1].replace("'","").replace("'","").trim();//获取到username
                            }
                        } */

                        resolve(username); // 解析Promise并返回用户名
                    },
                    onerror: function(xhr) {
                        reject(new Error(`getUserInfo1请求失败: ${xhr.statusText}`)); // 拒绝Promise并返回错误信息
                    }
                });
            });

            // 使用await等待Promise的解析
            const userName = await xhrPromise;
            console.log('获取到用户名******************', userName);
            return userName; // 返回用户名
        } catch (error) {

            console.error('获取用户名时出错:****************', error);
            throw error; // 重新抛出错误，以便调用者可以处理它
        }
    }

    async function hookXhr(){
        ajaxHooker.hook(request => {//拦截XHR请求
            if (request.url === 'http://172.20.234.92:7018/iaic-api/sdwsdj/applyStatus/page') {//预审列表页面XHR请求拦截
                const authorization = request.headers.Authorization;//获取headers秘钥

                request.response = res => {
                    let hook = JSON.parse(res.responseText);
                    for(let i=0;i<hook.data.list.length;i++){
                        if(hook.data.list[i].applyUserName&&hook.data.list[i].lerep!=hook.data.list[i].applyUserName){
                            hook.data.list[i].lerep +='/'+hook.data.list[i].applyUserName;//负责人/代理
                            //hook.data.list[i].isFullFlow = hook.data.list[i].applyUserName;//将‘是否全流程’显示为代理
                        }


                        if(hook.data.list[i].opper != hook.data.list[i].apprper){
                            hook.data.list[i].opper =(hook.data.list[i].opper==null?'':hook.data.list[i].opper)+'/'+hook.data.list[i].apprper;//  退回人/在看人
                        }

                    }
                    res.responseText = hook;
                    console.log('hook_requestText',res);

                    const total = hook.data.total;

                    queryAllList(1,total,authorization).then(reslut=>{
                        getCount(reslut.data);
                        return reslut.data;
                    }).catch(error=>{
                        console.error('hook函数中调用queryAllList错误:', error);
                    }
                            );

                };
            }

            //***************

            if (request.url === 'http://172.20.234.92:7018/iaic-api/reg/valid/020301/GS/wsdjPrePass') {//预审警示拦截

                request.response = res => {
                    let hook = JSON.parse(res.responseText);
                    res.responseText = hook;
                    console.log('*************hook_requestText',res);




                };
            }

            //*******************

        });
    }



    async function queryAllList(pageNum,total,authorization) {
        //获取预审列表
        let limit = (document.querySelector('.el-pager').childNodes.length + 1) * 10 + 20;
        if(total){
            limit = total;
        }
        if (!pageNum) {
            pageNum = document.querySelector('ul>li.active').textContent;
            limit = 10;
        } else {
            pageNum = 1;
        }
        try {
            let fetchUrl = "http://172.20.234.92:7018/iaic-api/sdwsdj/applyStatus/page";
            let body = JSON.stringify({
                "page": pageNum,
                "limit": limit,
                "param": {
                    "isDb": "1",
                    "uniscid": document.querySelector('[placeholder="请输入统一社会信用代码"]').value,
                    "entname": document.querySelector('[placeholder="请输入企业名称"]').value,
                    "entcat": window.location.pathname.slice(-1)
                }
            });
            // 在这里处理data
            const data = await queryFetch(fetchUrl, body,authorization);
            console.log('queryAllList成功获取数据:', data);

            return data;
        } catch (error) {
            console.error('在queryAllList中捕获到错误:', error);
            // 在这里处理错误，比如显示错误消息给用户
        }
    }


    async function queryMcglJbxxZs(entname) {
        //根据公司名称entname获取核名信息
        try {

            let fetchUrl = "http://172.20.234.92:7018/iaic-api/name/query/queryMcglJbxxZs";

            let body = JSON.stringify({
                "entname": entname
            });

            const Data = await queryFetch(fetchUrl, body);
            let data = Data.data[0];
            console.log('queryMcglJbxxZs成功获取数据:', data);

            // 在这里处理data
            return data;
        } catch (error) {
            console.error('在queryMcglJbxxZs中捕获到错误:', error);
            // 在这里处理错误，比如显示错误消息给用户
        }
    }

    //调用queryAllCreate()
    //queryAllCreate("GSDJ_JBXX_EDIT","QYDJ_JBXX_LC","JBXX_KZXX_LC");//基本信息
    //queryAllCreate("QYDJ_CZXX_EDIT", "QYDJ_CZXX_LC");//股东 出资信息
    //queryAllCreate("QYDJ_RYXX_EDIT", "QYDJ_RYXX_LC");//董事经理
    // queryAllCreate("WZFR_LLR_EDIT","QYDJ_LLR_LC");//联络员
    // queryAllCreate("QYDJ_YWBLWTRXX_EDIT","QYDJ_YWBL_WTRXX");//委托代理人
    async function queryAllCreate(pageCode, tableName, exTableName) {//设立信息
        //根据pageCode/tableName/主键window.OPENO获取人员信息
        try {

            const fetchUrl = "http://172.20.234.92:7018/iaic-api/sdwsdj/applyStatus/queryWsdjDataPage";
            let body;
            if (exTableName) {
                body = JSON.stringify({
                    "param": {
                        "pageCode": pageCode,
                        "tableName": tableName,
                        "params": {
                            "OPENO": window.location.search.split('=')[1].split('&')[0],
                            "exTableName": exTableName
                        }
                    }
                });
            } else {
                body = JSON.stringify({
                    "param": {
                        "pageCode": pageCode,
                        "tableName": tableName,
                        "params": {
                            "OPENO": window.location.search.split('=')[1].split('&')[0],
                        }
                    }
                });
            }

            const Data = await queryFetch(fetchUrl, body);
            let data = Data.data.list;
            console.log(`queryAllCreate成功获取【${tableName}】数据:`, data);

            // 在这里处理data
            return data;
        } catch (error) {
            console.error(`在queryAllCreate中捕获到【${tableName}】错误:`, error);
            // 在这里处理错误，比如显示错误消息给用户
        }
    }
    async function queryFetch(fetchUrl, body,authorization) {//抽象的父fetch
        try {

            const response = await fetch(fetchUrl, {
                "headers": {
                    "authorization":authorization,
                    "content-type": "application/json"
                },
                "method": "POST",
                'body': body
            });
            if (!response.ok) {
                throw new Error('网络相应不正常！');
            }
            const data = await response.json();
            return data;

        } catch (error) {
            console.error('请求出错:', error);
            throw error;
        }
    }



    //**********************************************************************fetch请求end****************************************************************************
    //**************************************************************************************************************************************************************
    //**************************************************************************************************************************************************************


    //**********************************************************************login begin*****************************************************************************
    //**************************************************************************************************************************************************************

    function myLogin(eleName,elePwd,eleParent) {//动态添加版本
        let storage = unsafeWindow.localStorage;
        let uData = [{}];
        let input = new Event('input');//vue框架无法直接赋值
        let change = new Event('change');
        let parent = eleParent;
        if (!parent) {
            setTimeout(myLogin, 200);
            return;
        }
        //let name = document.querySelectorAll('#name')[1];
        //let password = document.querySelectorAll('#password')[1];
        let name = eleName;
        let password = elePwd;
        password.type ='text';
        reload();
        function reload() {//初始化函数
            let oldData = JSON.parse(storage.getItem("uData"));
            //let parent = document.getElementsByTagName("div")[0];
            if (oldData) {

                for (let i = 0; i < oldData.length; i++) {
                    /*                     console.log(`登录名：`,oldData[i][0].uid);
                    console.log(`密码：`,oldData[i][0].upwd); */
                    let newUser = cyEle(oldData[i]);
                    parent.append(newUser);
                    parent.append(cyEle());
                    newUser.onclick = function () {

                        if (name.value == "") {
                            name.value = oldData[i].uid;
                            name.dispatchEvent(input);
                            password.value = oldData[i].upwd;
                            password.dispatchEvent(input);
                        } else {
                            name.value = '';
                            name.dispatchEvent(input);
                            password.value = '';
                            password.dispatchEvent(input);

                        }

                    }

                }
            }

            let add = cyEle(" + ");
            let del = cyEle(" - ");
            let revise = cyEle(" * ");
            let updata = cyEle(" updata ");

            parent.append(add);
            parent.append(cyEle());
            parent.append(del);
            parent.append(cyEle());
            parent.append(revise);
            parent.append(cyEle());
            parent.append(updata);
            add.onclick = function () {
                addUser();
            }
            del.onclick = function () {
                dele();
            }
            revise.onclick = function () {
                Revise();
            }
            updata.onclick = function () {
                let updataUrl = 'https://greasyfork.org/zh-CN/scripts/515689-%E5%B0%8F%E5%8A%A9%E6%89%8B';
                unsafeWindow.open(updataUrl, '_blank');
            }

        }
        function addUser() {

            let uname, uid, upwd1, upwd2;
            let oldData = JSON.parse(storage.getItem("uData"));
            console.log(oldData);
            uname = prompt(`请输入用户姓名`, "").trim();
            let judgeFn = new RegExp(/\s+/g);
            if (judgeFn.test(uname)) {
                alert("内容包含有空格!");
                return;
            }
            console.log(uname != null && uname != "");
            if (uname != null && uname != "") {

                if (oldData && oldData.length > 0) {
                    //检查是否重复添加
                    for (let i = 0; i < oldData.length; i++) {
                        if (uname === oldData[i].uname) {
                            alert(`【${uname}】已经添加`);
                            return;
                        }
                    }
                }
                uid = prompt(`${uname}请输入你的登录名`, "").trim();
                if (judgeFn.test(uid)) {
                    alert("内容包含有空格!");
                    return;
                }

                if (uid != null && uid != "") {

                    upwd1 = isPwd(uname, uid);
                    while (upwd1 == false) {
                        upwd1 = isPwd(uname, uid);
                    }

                }else{
                    return;
                }

            } else {
                return;
            }
            console.log(uname, uid, upwd1);
            //新增

            if (oldData && oldData.length > 0) {

                oldData[oldData.length] = {//增加
                    uname: uname,
                    uid: uid,
                    upwd: upwd1

                };
                uData = oldData;
                console.log('add');
            } else {//初始化
                uData[0] = {
                    uname: uname,
                    uid: uid,
                    upwd: upwd1

                };
                console.log('初始化');
            }

            console.log(uData);
            //保存
            storage.setItem("uData", JSON.stringify(uData));
            alert(`添加用户【${uname}】成功~~`);
            //重载数据
            location.reload();
        }

        function dele() {
            let oldData, dname, dpwd, isFind;
            isFind = false;
            oldData = JSON.parse(storage.getItem("uData"));
            //console.log(oldData[0][0].uname);
            console.log(typeof oldData[0]);
            dname = prompt(`请输入要删除的用户名字`, "").trim();
            if (dname != null && dname != "") {
                //判断是否有这个账号
                for (let i = 0; i < oldData.length; i++) {
                    if (dname === oldData[i].uname) {
                        isFind = true;
                        dpwd = prompt(`请输入密码确认删除`, "").trim();
                        if (dpwd != null && dpwd != "") {
                            //判断密码是否正确
                            if (dpwd === oldData[i].upwd) {
                                //删除
                                //let deStr = oldData[i][0];
                                console.log(`删除该条记录：`, oldData.splice(i, 1));
                                uData = oldData;
                                storage.setItem("uData", JSON.stringify(uData));
                                alert(`删除用户【${dname}】成功~~`);
                                location.reload();
                            } else {
                                alert(`密码错误！！！`);
                            }
                        }
                    }
                }
                if (!isFind) {
                    alert(`未查询到用户${dname}`);
                }


            } else {
                return;
            }
        }
        function Revise() {
            let pname, oldPwd, newpwd, newPwd, oldData, oldUid, isFind;
            oldData = JSON.parse(storage.getItem("uData"));
            pname = prompt(`请输入要修改的账号用户名`, "").trim();
            let judgeFn = new RegExp(/\s+/g);
            if (judgeFn.test(pname)) {
                alert("内容包含有空格!");
                return;
            }
            if (pname != null && pname != "") {
                //oldPwd = prompt(`请输入原密码`,"").trim();
                console.log(typeof oldData);
                //判断是否有这个账号
                for (let i = 0; i < oldData.length; i++) {
                    if (pname === oldData[i].uname) {
                        isFind = true;
                        oldUid = oldData[i].uid;
                        oldPwd = prompt(`请输入原密码`, "").trim();
                        if (oldPwd != null && oldPwd != "") {
                            //判断密码是否正确
                            console.log(oldData[i], oldData[i].upwd);
                            if (oldPwd === oldData[i].upwd) {
                                //输入两次新密码
                                newpwd = isPwd(pname, oldData[i].uid)

                                while (newpwd == false) {
                                    newpwd = isPwd(pname, oldData[i].uid)
                                }
                                //let deStr = oldData[i][0];
                                console.log(`修改该条记录：`, oldData.splice(i, 1));
                                oldData[oldData.length] = {//增加
                                    uname: pname,
                                    uid: oldUid,
                                    upwd: newpwd

                                };
                                uData = oldData;
                                storage.setItem("uData", JSON.stringify(uData));
                                alert(`修改用户【${pname}】成功~~`);
                                location.reload();
                            } else {
                                alert(`原密码错误！！！`);
                            }
                        }
                    }
                }
                if (!isFind) {
                    alert(`未查询到用户${pname}`);
                }

            } else {
                return;
            }
        }
        function cyEle(types) {//创建元素
            //let type = types.uname;
            let span = document.createElement("span");
            if (!types) {

                span.style = "color: #858585;";
                span.textContent = " | ";
            } else {
                span.style = "color: #858585;";
                //span.style="color: #858585;font-size: 16px;";
                if ("string" == (typeof types)) {
                    span.textContent = `${types}`;
                }
                if ("object" == (typeof types)) {
                    span.textContent = `${types.uname}`;
                    span.title = `${types.uid}【${types.upwd}】`;
                }

                span.onmouseover = function () {//绑定移入事件    持续性用onmousemove
                    this.style.fontWeight = "Bold";
                    this.style.color = 'rgb(232 23 23)';
                    this.style.cursor = "pointer";
                    this.style.backgroundColor = 'rgb(222 222 222)';


                }
                span.onmouseout = function () {//绑定移出事件
                    this.style.fontWeight = '';
                    this.style.color = '#858585';
                    this.style.cursor = "pointer";
                    this.style.backgroundColor = 'rgb(255 255 255)';

                }

            }
            //console.log('cyEle调用',type);
            return span;
        }
        function isPwd(uname, uid) {
            let upwd1, upwd2;
            let judgeFn = new RegExp(/\s+/g);
            upwd1 = prompt(`${uname}[${uid}]请输入你的密码`, "").trim();
            if (judgeFn.test(upwd1)) {
                alert("内容包含有空格!");
                return false;
            }
            if (upwd1 != null && upwd1 != "") {

                upwd2 = prompt(`${uname}[${uid}]请再次输入你的密码`, "").trim();
                if (upwd2 != null && upwd2 != "") {

                    if (upwd1 != upwd2) {
                        alert("两次密码不一致,请重新输入!");
                        return false;
                        //isPwd(uname,uid);
                    } else {
                        return upwd1;
                    }

                }
                return true;
            }else{
                return false;
            }

        }
    }
    //***********************************************************************login end******************************************************************************
    //**************************************************************************************************************************************************************



})();