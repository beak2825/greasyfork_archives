// ==UserScript==
// @name         进化（Evolve）辅助工具
// @namespace    http://tampermonkey.net/
// @version      0.1.4
// @description  可修改指定资源,一键补满资源
// @author       You Boy
// @match        https://g8hh.github.io/evolve/
// @match        https://pmotschmann.github.io/Evolve/
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/538549/%E8%BF%9B%E5%8C%96%EF%BC%88Evolve%EF%BC%89%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.user.js
// @updateURL https://update.greasyfork.org/scripts/538549/%E8%BF%9B%E5%8C%96%EF%BC%88Evolve%EF%BC%89%E8%BE%85%E5%8A%A9%E5%B7%A5%E5%85%B7.meta.js
// ==/UserScript==

const EvolveStyles = `
.topBar .version {
  margin-right: 0;
}
.modify-icon {
  padding: 0 12px;
}
.modify-icon+.modify-icon {
  padding-left: 0;
}
.modify-dialog {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) scale(0.8);
  padding: 20px;
  border-radius: 8px;
  z-index: 2000;
  box-shadow: 0 0 1rem #000;
  background: #fff;
  opacity: 0;
}
.modify-dialog.show {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1);
}
.modify-dialog .msgInputApply {
  margin-top: 1rem;
}
.modify-dialog .resource-list{
  max-height: 80vh;
  overflow-y: auto;
}
.modify-dialog .resources {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;
  padding: 10px;
}
.modify-dialog .resource-item {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: flex-end;
}
.modify-dialog .resource-item label {
  width: 150px;
  text-align: right;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.modify-dialog .resource-item input {
  width: 120px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
.modify-dialog .section-group {
  margin-bottom: 20px;
  position: relative;
}
.modify-dialog .section-group h3 {
  margin: 10px 0;
  padding-bottom: 5px;
  border-bottom: 1px solid #ccc;
}
.modify-dialog .section-group .resources-batch-edit {
  position: absolute;
  top: 10px;
  right: 10px;
  display: flex;
  align-items: center;
  gap: 10px;
  visibility: hidden;
}
.modify-dialog .section-group .resources-batch-edit input {
  width: 80px;
}
.modify-dialog .section-group:hover .resources-batch-edit {
  visibility: visible;
}
.resources-batch-edit[data-section=arpa],
.resources-batch-edit[data-section=prestige] {
  display: none !important; /* ARPA和威望资源不显示批量修改 */
}
`;

// 中文翻译
const translateCN = {
  city: {
    food: "收集食物",
    lumber: "收集木材",
    stone: "收集石头",
    basic_housing: "小木屋",
    cottage: "茅屋",
    apartment: "公寓",
    lodge: "小屋",
    compost: "堆肥箱",
    bank: "银行",
    silo: "粮仓",
    farm: "农场",
    tourist_center: "游客中心",
    amphitheatre: "圆形剧场",
    casino: "赌场",
    temple: "寺庙",
    banquet: "宴会厅",
    university: "大学",
    library: "图书馆",
    wardenclyffe: "沃登克里弗塔",
    biolab: "生命科学实验室",
    garrison: "军营",
    hospital: "医院",
    boot_camp: "新兵训练营",
    shed: "仓库",
    storage_yard: "货场",
    warehouse: "集装箱港口",
    oil_depot: "燃料库",
    trade: "贸易站",
    wharf: "码头",
    lumber_yard: "伐木场",
    sawmill: "锯木厂",
    rock_quarry: "采石场",
    cement_plant: "水泥厂",
    foundry: "铸造厂",
    factory: "工厂",
    smelter: "冶炼厂",
    metal_refinery: "金属精炼厂",
    mine: "矿井",
    coal_mine: "煤矿",
    oil_well: "石油井架",
    windmill: "风车",
    coal_power: "煤电厂",
    oil_power: "石油发电厂",
    fission_power: "裂变反应堆",
    mass_driver: "质量驱动器",
    mill: "磨坊",
    pylon: "水晶塔",
  },
  space: {
    satellite: "人造卫星",
    gps: "GPS卫星",
    propellant_depot: "推进剂库",
    nav_beacon: "导航灯塔",
    moon_base: "月球基地",
    iridium_mine: "铱矿",
    helium_mine: "氦-3矿",
    observatory: "月球观测站",
    spaceport: "太空港",
    red_tower: "太空控制塔",
    living_quarters: "生活区",
    vr_center: "VR中心",
    garage: "格纳库",
    red_mine: "矿井",
    fabrication: "行星铸造厂",
    red_factory: "工厂",
    biodome: "生物穹顶",
    exotic_lab: "外星材料实验室",
    ziggurat: "通灵塔",
    space_barracks: "太空驻军",
    geothermal: "地热发电厂",
    swarm_plant: "蜂群工厂",
    swarm_control: "蜂群卫星控制站",
    swarm_satellite: "蜂群卫星",
    gas_mining: "氦-3收集器",
    gas_storage: "星系燃料库",
    star_dock: "星际船坞",
    outpost: "采矿前哨",
    drone: "采矿无人机",
    oil_extractor: "石油提取器",
    space_station: "深空采矿站",
    elerium_ship: "超铀采矿船",
    iridium_ship: "铱采矿船",
    iron_ship: "铁采矿船",
    elerium_contain: "超铀存储",
    e_reactor: "超铀反应堆",
    world_controller: "世界对撞机",
    zero_g_lab: "零重力实验室",
    shipyard: "外域船坞",
    water_freighter: "运水船",
    storehouse: "卫星仓库",
    hydrogen_plant: "氢气发电厂",
    g_factory: "石墨烯厂",
    hell_smelter: "冶炼厂",
    electrolysis: "电解工厂",
    titan_spaceport: "太空港",
    titan_mine: "行星采矿设施",
    titan_bank: "银行",
    titan_quarters: "定居点",
    ai_core: "AI超级核心",
    crashed_ship: "废弃飞船",
    mass_relay: "质量中继器",
  },
  interstellar: {
    starport: "星际港口",
    habitat: "定居点",
    mining_droid: "采矿机器人",
    processing: "精金加工设施",
    fusion: "聚变反应堆",
    laboratory: "深空实验室",
    exchange: "星际交易所",
    g_factory: "石墨烯厂",
    int_factory: "大型工厂",
    luxury_condo: "豪华公寓",
    zoo: "异族动物园",
    warehouse: "仓库",
    xfer_station: "星际转运站",
    cargo_yard: "星际货仓",
    cruiser: "巡逻艇",
    orichalcum_sphere: "戴森球",
    dyson: "戴森球",
    nexus: "星际枢纽站",
    harvester: "气体收集器",
    elerium_prospector: "超铀开采器",
    neutron_miner: "中子矿船",
    citadel: "AI中枢要塞",
    stellar_forge: "恒星熔炉",
    far_reach: "遥远星际",
    stellar_engine: "恒星引擎",
    mass_ejector: "质量喷射器",
    s_gate: "星际之门",
    ascension_trigger: "飞升装置",
    ascend: "飞升",
    thermal_collector: "集热器"
  },
  galaxy: {
    starbase: "星门要塞",
    ship_dock: "星门船坞",
    bolognium_ship: "钋采矿船",
    scout_ship: "侦察舰",
    corvette_ship: "小型护卫舰",
    frigate_ship: "大型护卫舰",
    cruiser_ship: "巡洋舰",
    dreadnought: "无畏舰",
    gateway_station: "星门中转站",
    telemetry_beacon: "遥测信标",
    gateway_depot: "贮藏所",
    defense_platform: "防御平台",
    embassy: "大使馆",
    dormitory: "住宅区",
    symposium: "联谊会",
    freighter: "星际货轮",
    consulate: "领事馆",
    resort: "度假区",
    vitreloy_plant: "金属玻璃工厂",
    super_freighter: "超级星际货轮",
    foothold: "武装据点",
    armed_miner: "武装矿船",
    ore_processor: "矿石处理装置",
    scavenger: "科技清道夫",
    minelayer: "布雷艇",
    excavator: "挖掘机",
    raider: "掠夺者"
  },
  portal: {
    turret: "等离子炮塔",
    carport: "勘探车",
    war_droid: "战斗机器人",
    repair_droid: "修理机器人",
    war_drone: "掠食者无人机",
    sensor_drone: "探测无人机",
    attractor: "吸引器信标",
    soul_forge: "灵魂锻炉",
    gun_emplacement: "自动炮台",
    soul_attractor: "灵魂引渡器",
    guard_post: "岗哨",
    archaeology: "考古发掘场",
    arcology: "生态建筑",
    hell_forge: "地狱熔炉",
    inferno_power: "地狱反应堆",
    ancient_pillars: "永恒立柱",
    west_tower: "西侧巨塔",
    east_tower: "东侧巨塔",
    gate_turret: "远古之门炮塔",
    infernite_mine: "地狱石矿井",
    harbor: "血湖港口",
    cooling_tower: "冷却塔",
    bireme: "双层排桨军舰",
    transport: "运输船",
    purifier: "空气净化器",
    port: "登陆点",
    base_camp: "登陆营地",
    bridge: "尖塔之桥",
    sphinx: "斯芬克斯",
    mechbay: "机甲舱",
    spire: "尖塔"
  },
  tauceti: {
    ringworld: "环形世界",
    goe_facility: "伊甸园设施",
    orbital_station: "轨道空间站",
    colony: "生活区",
    bonfire: "篝火堆",
    assembly: "装配工厂",
    tau_farm: "高科技农场",
    mining_pit: "采矿深坑",
    alien_outpost: "外星前哨",
    fusion_generator: "聚变发生器",
    repository: "仓库",
    tau_factory: "高科技工厂",
    infectious_disease_lab: "科学实验室",
    tauceti_casino: "赌场",
    tau_cultural_center: "文化中心",
    orbital_platform: "轨道平台",
    jeff: "杰夫",
    overseer: "使者",
    womling_village: "沃姆林村庄",
    womling_farm: "沃姆林农场",
    womling_mine: "沃姆林矿井",
    womling_fun: "酒馆",
    womling_lab: "深空实验室",
    refueling_station: "加气站",
    ore_refinery: "矿石精炼厂",
    whaling_station: "鲸鱼处理厂",
    patrol_ship: "巡逻船",
    mining_ship: "提取船",
    whaling_ship: "捕鲸船",
    alien_space_station: "外星空间站",
    alien_station: "外星空间站",
  },
  arpa: {
    _label: "A.R.P.A.",
    lhc: "超级对撞机",
    stock_exchange: "证券交易所",
    monument: "雕塑",
    railway: "铁路",
    roid_eject: "恒星碎片变轨",
    tp_depot: "贮藏所",
    launch_facility: "发射设施",
  },
  prestige: {
    _label: "威望",
    Plasmid: "质粒",
    Phage: "噬菌体",
    Harmony: "和谐水晶",
    Blood_Stone: "鲜血之石",
    Artifact: "上古遗物",
    Dark: "暗能量",
    AntiPlasmid: "反质粒",
    AICore: "AI核心",
    Supercoiled: "超螺旋质粒",
  },
};

(function ($) {
  'use strict';

  class EvolveModifier {
    constructor() {
      this.setup();
      this.evolveImportBtn = null;
      this.evolveExporttBtn = null;
      this.saveDataJson = null;
    }

    /**
     * 添加修改器样式
     */
    addStyles() {
      if ($('#modify-style').length) {
        $('#modify-style').remove();
      }
      $('<style id="modify-style">')
        .text(EvolveStyles)
        .appendTo('head');
    }

    /**
     * 修改内容的具体实现
     */
    modifyContent(saveData) {
      // 是否是中文
      let isCN = false;
      const langEle = $('#localization .dropdown-trigger button');
      if (langEle.length) {
        isCN = langEle.html().includes('简体中文');
      }

      const civilEle = $('#mTabCivil');
      if (!civilEle.length) {
        return '<p>请切换到文明面板在打开编辑器</p>';
      }

      const tablist = civilEle.find('ul[role=tablist] li[role=tab] h2.is-sr-only');
      const sections = civilEle.find('section[class=tab-content] div[role=tabpanel]');
      const sectionIds = sections.map(function () {
        return $(this).attr('id');
      }).get();

      const ARPAEle = $('#mainTabs ul[role=tablist] #13-label').parent();
      const isARPA = ARPAEle.length && ARPAEle.css('display') !== 'none';
      if (isARPA) {
        sectionIds.push('arpa'); // 如果是ARPA面板，添加arpa部分
      }
      if (saveData.prestige && Object.keys(saveData.prestige).length > 0 && Object.keys(saveData.prestige).some(key => saveData.prestige[key].count > 0)) {
        sectionIds.push('prestige');
      }

      let content = '<div class="resource-list">';

      // 遍历section
      sectionIds.forEach((sectionId, sindex) => {
        const sectionLabel = tablist[sindex] ? tablist[sindex].innerText : (translateCN[sectionId] ? translateCN[sectionId]._label : sectionId);
        const isShowSection = $(tablist[sindex]).closest("li[role=tab]").css('display') !== "none";
        // 如果该部分存在于存档数据中
        if (saveData[sectionId] && Object.keys(saveData[sectionId]).length > 0 && isShowSection) {
          content += `<div class="section-group">
            <h3 title="${sectionId}">${sectionLabel}</h3>
            <div class="resources-batch-edit" data-section="${sectionId}">
              <label for="batch-edit-${sectionId}">批量设置:</label>
              <input type="number" id="batch-edit-${sectionId}" placeholder="输入" min="3" value="3"/>
              <button class="apply-batch-edit" data-section="${sectionId}" title="只修改于大于等于3的资源">修改</button>
            </div>
            <div class="resources vscroll" id="resources-${sectionId}">`;

          // 遍历该部分下的所有资源
          Object.entries(saveData[sectionId]).forEach(([key, value]) => {
            let displayKey = key;
            if (isCN && translateCN[sectionId]) {
              displayKey = translateCN[sectionId][key] || key; // 使用中文翻译
            }
            // 检查是否有count属性，如果有且大于2，则显示输入框
            // tips: 部分资源最高只有1，所以这里只处理大于2的资源，避免误修改
            if (value && value.count !== undefined && value.count > 2) {
              content += `
                <div class="resource-item">
                  <label for="${sectionId}_${key}" title="${key}">${displayKey}</label>
                  <input type="number"
                         id="${sectionId}_${key}"
                         data-section="${sectionId}"
                         data-key="${key}"
                         value="${value.count}"
                  >
                </div>`;
            } else if (sectionId === 'arpa' && value.rank !== undefined && value.rank > 0) {
              // 特例处理：ARPA面板的资源
              content += `
                <div class="resource-item">
                  <label for="${sectionId}_${key}" title="${key}">${displayKey}</label>
                  <input type="number"
                         id="${sectionId}_${key}"
                         data-section="${sectionId}"
                         data-key="${key}"
                         value="${value.rank}"
                  >
                </div>`;

            }
          });

          content += `</div></div>`;
        }
      });

      content += '</div>';
      return content;
    }

    /**
     * 打开修改弹窗
     */
    openModifyDialog(saveData) {
      // 创建遮罩
      const maskHtml = `<div id="modify-mask" style="display:none;position:fixed;top:0;left:0;width:100vw;height:100vh;background:rgba(0,0,0,0.4);z-index:1999;"></div>`;
      if (!$('#modify-mask').length) {
        $('body').append(maskHtml);
      }
      $('#modify-mask').fadeIn(200);

      // 点击遮罩关闭弹窗和遮罩
      $('#modify-mask').off('click').on('click', function () {
        $('#modify-dialog').fadeOut(200, function () { $(this).remove(); });
        $('#modify-mask').fadeOut(200, function () { $(this).remove(); });
      });

      // 弹窗内容
      const dialogHtml = `
      <div id="modify-dialog" class="modalBox" style="display:none;">
        ${this.modifyContent(saveData)}
        <div class="msgInputApply">
          <button id="apply-modification" class="button">应用修改</button>
        </div>
      </div>`;

      // 只添加一次弹窗
      if (!$('#modify-dialog').length) {
        $('body').append(dialogHtml);
      }

      $('#modify-dialog')
        .addClass('modify-dialog')
        .show()
        .addClass('show');
    }

    /**
     * 获取存档数据
     */
    getSaveData() {
      const importExportEle = $(".importExport").last();
      if (!importExportEle.length) {
        return null;
      }
      this.evolveImportBtn = importExportEle.find("button")[0];
      this.evolveExporttBtn = importExportEle.find("button")[1];
      const saveCodeEle = document.getElementById('importExport');
      if (!this.evolveImportBtn || !this.evolveExporttBtn || !saveCodeEle) {
        console.error("无法找到导入导出按钮或存档代码输入框");
        return null;
      }
      this.evolveExporttBtn.click();

      this.saveDataJson = JSON.parse(LZString.decompressFromBase64(saveCodeEle.value));
      if (this.saveDataJson == null) {
        return;
      }

      // console.log("获取存档数据成功", this.saveDataJson);
      return this.saveDataJson;
    }

    handleModifyClick() {
      // 每次点击时重新获取最新数据
      const saveData = this.getSaveData();
      const tabCivilEle = $('#mainColumn .tabs a#5-label');

      if (!tabCivilEle.length) {
        return;
      }

      if (!saveData) {
        alert("获取存档失败，请确保游戏已加载并且存档数据可用。");
        return;
      }

      // 绑定应用修改按钮的点击事件
      $(document).off('click', '#apply-modification').on('click', '#apply-modification', () => {
        this.applyModifications();
        $('#modify-dialog').hide();
        $('#modify-mask').hide();
      });

      // 绑定批量修改按钮的点击事件
      $(document).off('click', '.apply-batch-edit').on('click', '.apply-batch-edit', (e) => {
        this.applyBatchEdit(e);
      });

      if (tabCivilEle.hasClass('is-active')) {
        this.openModifyDialog(saveData);
      } else {
        tabCivilEle[0].click(); // 切换到文明面板
        setTimeout(() => {
          this.openModifyDialog(saveData);
        }, 300); // 确保切换完成
      }
    }

    applyModifications() {
      const inputs = $('#modify-dialog input[type="number"]');
      let saveData = this.saveDataJson;

      inputs.each((_, input) => {
        const $input = $(input);
        const section = $input.data('section');
        const key = $input.data('key');
        const value = parseInt($input.val(), 10);

        if (!isNaN(value) && saveData[section] && saveData[section][key]) {
          // arpa使用rank属性，其他使用count属性
          if (section === 'arpa') {
            saveData[section][key].rank = value;
          } else {
            saveData[section][key].count = value;
          }
        }
      });

      this.updateSaveData(saveData);
    }

    applyBatchEdit(e) {
      const section = e.currentTarget.dataset.section;
      const count = $(`#batch-edit-${section}`).val();
      const resourceInputs = $(`#resources-${section} input[type="number"]`);

      resourceInputs.each((_, input) => {
        const $input = $(input);
        const val = parseInt(count, 10);
        const ival = parseInt($input.val(), 10);

        // 部分资源最高等级只有1级，避免此类问题，设定为等级达到3才能批量修改
        if (!isNaN(val) && !isNaN(ival) && ival >= 3 && ival < val) {
          $input.val(val); // 更新输入框显示
        }
      });
    }


    /**
     * 补充资源
     */
    handleReplenishClick() {
      // 每次点击时重新获取最新数据
      const saveData = this.getSaveData();
      if (!saveData) {
        alert("获取存档失败，请确保游戏已加载并且存档数据可用。");
        return;
      }

      // 遍历并更新资源
      Object.entries(saveData.resource).forEach(([key, value]) => {
        if (value && value.display === true && value.amount > 0) {
          if (value.max < 0) {
            // 设置最大值，避免无限增加
            if (value.amount < 9999999999999) {
              value.amount += 999999999;
            }
          } else if (value.max > 0) {
            // 根据最大值补满资源
            value.amount = value.max;
          }
        }
      });

      this.updateSaveData(saveData);
    }

    /**
     * 更新存档数据
     */
    updateSaveData(saveData) {
      const saveCodeEle = document.getElementById('importExport');
      const saveDataStr = JSON.stringify(saveData);
      saveCodeEle.value = LZString.compressToBase64(saveDataStr);
      window.sessionStorage.setItem('SAVE_DATA', saveDataStr);
      this.evolveImportBtn.click();
    }

    setup() {
      // 先获取数据再添加按钮
      this.addStyles();

      // 创建修改按钮
      const modifyButton = $('<a id="modify-resources" class="modify-icon">✨</a>');
      const replenishButton = $('<a id="modify-replenish" class="modify-icon">📦</a>');

      $('#topBar').append(modifyButton);
      $('#topBar').append(replenishButton);

      // 使用bind确保this的指向
      modifyButton.on('click', this.handleModifyClick.bind(this));
      replenishButton.on('click', this.handleReplenishClick.bind(this));
    }
  }

  // 初始化
  $(document).ready(() => {
    new EvolveModifier();
  });

})(jQuery);