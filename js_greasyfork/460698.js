// ==UserScript==
// @name         triage-plugin
// @namespace    npm/vite-plugin-monkey-triage-plugin
// @version      0.0.0
// @author       monkey
// @description  内部系统附加功能
// @license      MIT
// @icon         https://vitejs.dev/logo.svg
// @match        http://172.16.8.8:8999/
// @require      https://cdn.jsdelivr.net/npm/vue@3.2.47/dist/vue.global.prod.js
// @require      data:application/javascript,window.Vue%3DVue%3B
// @require      https://cdn.jsdelivr.net/npm/dayjs@1.11.7/dayjs.min.js
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.2.30/dist/index.full.min.js
// @require      https://cdn.jsdelivr.net/npm/element-plus@2.2.30/dist/locale/zh-cn.min.js
// @resource     element-plus/dist/index.css  https://cdn.jsdelivr.net/npm/element-plus@2.2.30/dist/index.css
// @grant        GM_getResourceText
// @grant        unsafeWindow
// @downloadURL https://update.greasyfork.org/scripts/460698/triage-plugin.user.js
// @updateURL https://update.greasyfork.org/scripts/460698/triage-plugin.meta.js
// ==/UserScript==

(t=>{const e=document.createElement("style");e.dataset.source="vite-plugin-monkey",e.innerText=t,document.head.appendChild(e)})(".fixed[data-v-e31b17fe]{position:fixed;bottom:50px;right:30px;z-index:10;background-color:#fff}");

var __plugin_monkey_exposed = function(vue, ElementPlus2, dayjs2, zhCn) {
  "use strict";
  const style = "";
  const cssLoader = (e) => {
    const t = GM_getResourceText(e), o = document.createElement("style");
    return o.innerText = t, document.head.append(o), t;
  };
  cssLoader("element-plus/dist/index.css");
  const FieldReceptionSearchIndexBaseForm = {
    CustName: "",
    Phone: "13112344321",
    ReceptionNo: "",
    FieldConsultantId: "",
    DoctorId: "",
    TmpCustRegType: "",
    TmpCustRegTypeMenus: "",
    CustStatus: "",
    IsNewHospSecond: "",
    IsDeal: "",
    DatetimeReceptionStart: "2023-02-15",
    DatetimeReceptionEnd: "2023-02-15",
    Section: "",
    CMediaSourceType: "",
    CMediaSource: "",
    ReceptionEmpId: "",
    CustCardNo: "",
    CardType: "",
    ServiceAssistantId: "",
    RepresentativeId: "",
    isSearch: "1",
    pageSize: "1",
    pageCurrent: "1",
    orderField: "",
    orderDirection: "",
    total: ""
  };
  const CommonAreaCommonGetEmployeeInfoListBaseForm = {
    empType: "3",
    section: "STOMATOLOGY",
    isDisplay: "1",
    empStatus: "1"
  };
  const FieldReceptionNoteCreateBaseForm = {
    Address: "",
    Age: "1",
    Area: "",
    ArrangeRemark: "",
    ArrangeType: "1",
    Birthday: "2022-02-16",
    City: "610100",
    Country: "0",
    CreatedBy: "969B3AB900DD475CBDA4ACCAC5BFD8DB",
    CustCardno: "KH2023021600059",
    CustFamilyno: "FM2023021600059",
    CustId: "4C9D3E2D1D3041F084E8ABD3012EB0F8",
    CustIdentityId: "",
    CustIntention: "",
    CustMedia: "信息流/百度（种植）",
    CustName: "1",
    DoctorId: "",
    FieldConsultantId: "",
    FieldConsultantIds: "1",
    Id: "",
    isFamily: "false",
    MediaSource: "098658E21BA0496D96E9E9C18FA1A0C6",
    MediaSourceType: "9295C7B6F93E4E51A9C09E1C2198CCB5",
    oldAge: "1",
    oldBirth: "2022-02-16",
    oldSex: "2",
    Phone: "13112344321",
    Province: "610000",
    ReceptionEmpId: "969B3AB900DD475CBDA4ACCAC5BFD8DB",
    ReceptionNo: "JD2023021600078",
    RecommendCustFamilyNo: "",
    RecommendCustId: "",
    RecommendCustRelation: "",
    RecommendEmpId: "",
    refreshTabId: "FieldReceptionNoteIndex",
    RepresentativeId: "",
    RepresentativeIds: "1",
    Section: "STOMATOLOGY",
    SerialNo: "SY202302160083",
    SEX: "2",
    wechatshopId: ""
  };
  const FieldReceptionSearchEditBaseForm = {
    CustFamilyno: "FM2023021600081",
    CustName: "1",
    Sex: "2",
    Age: "1",
    Birthday: "2022-02-16",
    MediaSourceTypeDesc: "信息流",
    MediaSourceType: "9295C7B6F93E4E51A9C09E1C2198CCB5",
    MediaSourceDesc: "百度（种植）",
    MediaSource: "098658E21BA0496D96E9E9C18FA1A0C6",
    Section: "STOMATOLOGY",
    sectionName: "口腔全科",
    RepresentativeIds: "1",
    RepresentativeId: "C65D25FFA7F94F0AAFC5AF2100AA026C",
    FieldConsultantIds: "1",
    FieldConsultantId: "C65D25FFA7F94F0AAFC5AF2100AA026C",
    DoctorId: "01C81C40FB914D748AEBA993001CCD82",
    CustIntention: "运营测试用!!!!!!!!!!!12223",
    RecID: "B2570E000D384838987CAFAB00BCB6B2",
    CustId: "004FA80C6AF04FFD919CAFAB00BCB69D",
    ReceptionNo: "JD2023021600109",
    RecommendCustId: "",
    RecommendCustRelation: "",
    isFamily: "false",
    RecommendCustFamilyNo: "",
    RecommendEmpId: "",
    RecommendEmp: "",
    Address: "",
    ArrangeRemark: ""
  };
  const ManageFedConsultantChangesSearchBaseForm = {
    CustName: "",
    Phone: "13112344321",
    CustCardNo: "",
    CustIdentityId: "",
    FieldConsultantId: "",
    RepresentativeId: "",
    ServiceAssistantId: "",
    ServiceCustomerId: "",
    RecommendCustName: "",
    RecommendEmpId: "",
    IsRecommendEmpId: "",
    LastFieldConsultantId: "",
    DatetimeTCreatedMin: "",
    DatetimeTCreatedMax: "",
    LastSpendSection: "",
    MinAge: "",
    MaxAge: "",
    MediaSourceType: "",
    MediaSource: "",
    DatetimeLastVisitStart: "",
    DatetimeLastVisitEnd: "",
    VisitCountMin: "",
    VisitCountMax: "",
    CustStatus: "",
    LabelTypeId: "",
    CustLabelId: "",
    NoCustLabelId: "",
    NoCustLabelMenus: "",
    DatetimeFirstVisitStart: "",
    DatetimeFirstVisitEnd: "",
    RecallCountMin: "",
    RecallCountMax: "",
    MemberLevel: "",
    IsBlock: "",
    SpendingAmountStart: "",
    SpendingAmountEnd: "",
    DatetimeFirstSpendStart: "",
    DatetimeFirstSpendEnd: "",
    SpendingCountStart: "",
    SpendingCountEnd: "",
    SectionCountStart: "",
    SectionCountEnd: "",
    DatetimeLastSpendStart: "",
    DatetimeLastSpendEnd: "",
    LastRecallStart: "",
    LastRecallEnd: "",
    Remark: "",
    RetCallRemark: "",
    StomatologyAmountMin: "",
    StomatologyAmountMax: "",
    StomFirstCareEmpName: "",
    RemainPremoneyMin: "",
    RemainPremoneyMax: "",
    RemainSaveMin: "",
    RemainSaveMax: "",
    RemainAmountMin: "",
    RemainAmountMax: "",
    DoctorSectionId: "all",
    SectionDoctorId: "",
    SaSectionId: "all",
    SectionSaId: "",
    pageSize: "21",
    pageCurrent: "1",
    orderField: "",
    orderDirection: "",
    IsSearch: "1",
    title: "【导入】正客归属更改",
    total: ""
  };
  const parseHtmlTable = (str) => {
    let root = $(str);
    let table = root.find("table");
    let headers = table.find("thead th");
    let keys = [];
    for (let header of headers) {
      keys.push($.trim(header.innerText));
    }
    let bodyRows = table.find("tbody tr");
    let result = [];
    for (let row of bodyRows) {
      let o = parserTableRow($(row), keys);
      console.log("o", o);
      if (Object.keys(o).length)
        result.push(o);
    }
    return result;
  };
  const parserTableRow = (row, keys = {}, indexKey = false) => {
    let rowData = row.find("td");
    let o = {};
    rowData.each((index, item) => {
      var _a;
      (_a = $(item).find("input")) == null ? void 0 : _a.each(function() {
        if (this.name && this.value) {
          o[`name-${this.name}`] = this.value;
        }
        $.each(this.attributes, function() {
          if (this.specified)
            o[this.name] = this.value;
        });
      });
      let key = keys == null ? void 0 : keys[index];
      if (!key) {
        if (!indexKey) {
          return;
        } else {
          key = index;
        }
      }
      o[key] = $.trim(item.innerText);
    });
    return o;
  };
  const objectFilterKey = (obj1, obj2) => {
    let keys = Object.keys(obj2);
    return Object.keys(obj1).filter((key) => keys.includes(key)).reduce((obj, key) => {
      return Object.assign(obj, {
        [key]: obj1[key]
      });
    }, {});
  };
  const getWindowValue = (key, def = null) => {
    var _a;
    return window[key] || ((_a = window == null ? void 0 : window.unsafeWindow) == null ? void 0 : _a[key]) || def;
  };
  $.ajaxSetup({
    dataFilter: function(data, type) {
      if (/用户登录/.test(data)) {
        window.location.reload();
        return;
      }
      return data;
    }
  });
  const FieldReceptionSearchIndex = async (data) => {
    let result = await $.post("/Field/ReceptionSearch/Index", Object.assign({}, FieldReceptionSearchIndexBaseForm, data));
    return parseHtmlTable(result);
  };
  const FieldReceptionSearchIndexMapOfTodayPhone = async (phone) => {
    let today = dayjs2().format("YYYY-MM-DD");
    return await FieldReceptionSearchIndex({
      Phone: phone,
      DatetimeReceptionStart: today,
      DatetimeReceptionEnd: today
    });
  };
  const CommonAreaCommonGetEmployeeInfoList = async (data) => {
    let result = await $.post("/CommonArea/Common/GetEmployeeInfoList", Object.assign({}, CommonAreaCommonGetEmployeeInfoListBaseForm, data));
    result = JSON.parse(result);
    return result;
  };
  const CommonAreaCommonGetEmployeeInfoListMapOfByDepartment = async (department) => {
    let res = await CommonAreaCommonGetEmployeeInfoList({
      section: department
    });
    return (res == null ? void 0 : res.resBody) || [];
  };
  const FieldReceptionNoteIndex = async (phone) => {
    let result = await $.post("/Field/ReceptionNote/Index", {
      CustName: "",
      Phone: phone,
      CustCardNo: "",
      CustIdentityId: "",
      isSearch: "Y",
      pageCurrent: "1",
      pageSize: "",
      orderField: "",
      orderDirection: "",
      total: ""
    });
    return parseHtmlTable(result);
  };
  const FieldReceptionNoteCreateMapOfGet = async (phone) => {
    let response = await $.get(`/Field/ReceptionNote/Create?Phone=${phone}&CustName=&CustCardNo=`);
    return response;
  };
  const FieldReceptionNoteCreateMapOfPost = async (data) => {
    return await $.post("/Field/ReceptionNote/Create", data);
  };
  const FieldReceptionSearchEditOfGet = async (id) => {
    let response = await $.get(`/Field/ReceptionSearch/Edit?Id=${id}`);
    return response;
  };
  const FieldReceptionSearchEditOfPost = async (data) => {
    return $.post("/Field/ReceptionSearch/Edit", data);
  };
  const ManageFedConsultantChangesCustUpdateAll = async (data) => {
    data = Object.assign({}, {
      // 现场
      Consultants: "",
      // 客户代表
      RepresentativeIds: "",
      ServiceAssistantIds: "",
      ServiceCustomerIds: "",
      // 用户ID
      ids: "",
      remark: "我的备注",
      IsUpdateCallEmp: "Y"
    }, data);
    let result = await $.post("/Manage/FedConsultantChanges/CustUpdateAll", data);
    return result;
  };
  const ManageFedConsultantChangesSearch = async (data) => {
    let result = await $.post("/Manage/FedConsultantChanges/Search", Object.assign({}, ManageFedConsultantChangesSearchBaseForm, data));
    return parseHtmlTable(result);
  };
  const ManageFedConsultantChangesSearchMapOfByPhone = async (phone) => {
    return await ManageFedConsultantChangesSearch({
      Phone: phone
    });
  };
  const CommonAreaCommonGetCustMediaSource = async (id) => {
    return $.post(`/CommonArea/Common/GetCustMediaSource?typeId=${id}`);
  };
  const _hoisted_1$2 = /* @__PURE__ */ vue.createElementVNode("h4", null, "功能介绍", -1);
  const _hoisted_2 = /* @__PURE__ */ vue.createElementVNode("p", null, [
    /* @__PURE__ */ vue.createElementVNode("strong", null, "点亮 : "),
    /* @__PURE__ */ vue.createTextVNode(" 快捷的为顾客创建接诊单,如果顾客之前没有被接待过(或者咨询不在了),`现场咨询`和`客户代表`将会分配到`公共池`.")
  ], -1);
  const _hoisted_3 = /* @__PURE__ */ vue.createElementVNode("p", null, [
    /* @__PURE__ */ vue.createElementVNode("strong", null, "修改 : "),
    /* @__PURE__ */ vue.createTextVNode(" 快捷修改带有`公共池`的顾客.没有公共池的记录不能被修改")
  ], -1);
  const _hoisted_4 = /* @__PURE__ */ vue.createElementVNode("p", null, [
    /* @__PURE__ */ vue.createElementVNode("strong", null, "新建 : "),
    /* @__PURE__ */ vue.createTextVNode(" 手动的为顾客创建接诊单")
  ], -1);
  const _hoisted_5 = { key: 0 };
  const _hoisted_6 = { style: { "text-align": "right" } };
  const _sfc_main$2 = {
    __name: "TriagePlan",
    props: ["running", "command"],
    emits: ["changeStatus"],
    setup(__props, { emit: emits }) {
      const { running } = __props;
      const defaultId = getWindowValue("__DEFAULT_ID__", "C65D25FFA7F94F0AAFC5AF2100AA026C");
      const defaultId2 = getWindowValue("__DEFAULT_ID2__", "CDC92903FE054AA783E4ADBD00967641");
      const defaultMedia = getWindowValue("__DEFAULT_MEDIA__", [
        "9FED1ABA850E41FBB7294D4B70E0D6D6",
        "91A324F2BE7648269682641534C98F7F"
      ]);
      const defaultSection = getWindowValue("__DEFAULT_SECTION__", "PLASTIC");
      const statusList = {
        0: "未建档(自然到院)",
        1: "当天没有接诊记录-手动创建",
        2: "当天没有接诊记录-自动创建",
        3: "当天已有接诊记录-点亮单-修改",
        4: "当天已有接诊记录-正常单-手动创建新的记录"
      };
      const status = vue.ref();
      const statusMessage = vue.computed(() => {
        return statusList == null ? void 0 : statusList[status.value];
      });
      const provinceList = vue.computed(() => {
        let provinces = getWindowValue("jsonArrayProvinces", []);
        let districts = getWindowValue("jsonArrayDistricts", []);
        let city = getWindowValue("jsonArrayCitys", []);
        city = (city == null ? void 0 : city.map((item) => {
          item.children = (districts == null ? void 0 : districts.filter((distItem) => {
            return item.code.substring(0, 4) === distItem.code.substring(0, 4);
          })) || [];
          return item;
        })) || [];
        return (provinces == null ? void 0 : provinces.map((item) => {
          item.children = (city == null ? void 0 : city.filter((distItem) => {
            return item.code.substring(0, 2) === distItem.code.substring(0, 2);
          })) || [];
          return item;
        })) || [];
      });
      vue.ref(false);
      const selectTableData = vue.ref([]);
      const searchLoading = vue.ref(false);
      const tableLoading = vue.ref(false);
      const dialogTableVisible = vue.ref(false);
      const selectRow = vue.ref();
      const sexOptions = vue.ref();
      const representativeOptions = vue.ref();
      const fieldConsultantOptions = vue.ref();
      const countryOptions = vue.ref();
      const sectionOptions = vue.ref();
      const doctorOptions = vue.ref();
      const mediaOptions = vue.ref();
      const cascaderProps = {
        label: "name",
        value: "code"
      };
      const mediaCascaderProps = {
        lazy: true,
        lazyLoad: async (node, resolve) => {
          const { level, value } = node;
          console.log("node", node);
          if (level === 0) {
            let result = [];
            for (const valueElement of mediaOptions.value) {
              if (valueElement["value"])
                result.push(valueElement);
            }
            resolve(result);
          } else if (level === 1 && value) {
            let res = await CommonAreaCommonGetCustMediaSource(value);
            if (res) {
              let result = [];
              for (const row of res) {
                let value2 = row[0];
                if (!value2)
                  continue;
                let label = row[1];
                result.push({
                  value: value2,
                  label,
                  leaf: true
                });
              }
              resolve(result);
            }
          }
          console.log("node", node);
        }
      };
      const loadingText = vue.ref("程序员工作中.....");
      const ruleFormRef = vue.ref();
      const ruleInlineFormRef = vue.ref();
      const form = vue.reactive({
        provinceCascader: [],
        mediaCascader: [],
        Address: "",
        Age: "",
        Area: "",
        ArrangeRemark: "",
        ArrangeType: "",
        Birthday: "",
        City: "",
        Country: "",
        CreatedBy: "",
        CustCardno: "",
        CustFamilyno: "",
        CustId: "",
        CustIdentityId: "",
        CustIntention: "",
        CustMedia: "",
        CustName: "",
        DoctorId: "",
        FieldConsultantId: "",
        FieldConsultantIds: "",
        Id: "",
        isFamily: "",
        MediaSource: "",
        MediaSourceType: "",
        oldAge: "",
        oldBirth: "",
        oldSex: "",
        Phone: "",
        Province: "",
        ReceptionEmpId: "",
        ReceptionNo: "",
        RecommendCustFamilyNo: "",
        RecommendCustId: "",
        RecommendCustRelation: "",
        RecommendEmpId: "",
        refreshTabId: "",
        RepresentativeId: "",
        RepresentativeIds: "",
        Section: "",
        SerialNo: "",
        SEX: "",
        wechatshopId: ""
      });
      const rules = vue.reactive({
        CustName: [{ required: true, message: "该字段不能为空!", trigger: "blur" }],
        Phone: [{ required: true, message: "该字段不能为空!", trigger: "blur" }],
        SEX: [{ required: true, message: "该字段不能为空!", trigger: "blur" }],
        Age: [{ required: true, message: "该字段不能为空!", trigger: "blur" }],
        Birthday: [{ required: true, message: "该字段不能为空!", trigger: "blur" }],
        // CustMedia: [{ required: true, message: '该字段不能为空!', trigger: 'blur' },],
        Country: [{ required: true, message: "该字段不能为空!", trigger: "blur" }],
        Section: [{ required: true, message: "该字段不能为空!", trigger: "blur" }],
        // DoctorId: [{required: true, message: '该字段不能为空!', trigger: 'blur'},],
        FieldConsultantId: [{ required: true, message: "该字段不能为空!", trigger: "blur" }],
        RepresentativeId: [{ required: true, message: "该字段不能为空!", trigger: "blur" }],
        CustIntention: [{ required: true, message: "该字段不能为空!", trigger: "blur" }],
        mediaCascader: {
          type: "array",
          required: true,
          message: "请选择媒介",
          trigger: "change"
        },
        provinceCascader: {
          type: "array",
          required: true,
          message: "请选择城市",
          trigger: "change"
        }
      });
      const formInline = vue.reactive({
        phone: ""
      });
      const inlineRules = vue.reactive({
        phone: [
          { required: true, pattern: /^1\d{10}[A-Z]?$/, message: "请输入真确的顾客电话", trigger: "blur" }
        ]
      });
      const searchPhone = async () => {
        if (searchLoading.value)
          return;
        let valid = await ruleInlineFormRef.value.validate();
        if (!valid)
          return;
        searchLoading.value = true;
        await checkCustomerTriageInfo(formInline.phone);
        searchLoading.value = false;
      };
      const checkCustomerTriageInfo = async (phone) => {
        let result = await FieldReceptionNoteIndex(phone);
        if (!(result == null ? void 0 : result.length)) {
          let boxResult = await checkMessageBox(
            "没有查询到电话号码对应的顾客(自然到院.或者输错号码).是否继续创建接诊单信息!",
            `请确认号码正确性 ${phone}`,
            {
              confirmButtonText: "继续创建",
              cancelButtonText: "返回",
              type: "warning"
            }
          );
          if (boxResult) {
            await createTriageForm(phone);
            status.value = 0;
            filterNewCreateData();
          }
        } else {
          await showTableSelector(result);
        }
      };
      const checkMessageBox = async (message, title, config) => {
        try {
          await ElementPlus2.ElMessageBox.confirm(
            message,
            title,
            config
          );
          return true;
        } catch (e) {
          console.log("e", e);
        }
        return false;
      };
      const showTableSelector = async (data) => {
        data = await Promise.all(data.map(async (item) => {
          let res = await FieldReceptionSearchIndexMapOfTodayPhone(item.value);
          if (res == null ? void 0 : res.length) {
            item.today = true;
            let editRow = res.find(
              (i) => (i["现场客服"] === "公共池" || i["客户代表"] === "公共池") && i["接诊状态"] === "分诊" && formInline.phone.length === i["电话"].length
            );
            if (editRow) {
              item.editRow = editRow;
              item.editId = editRow["value"];
            }
          }
          return item;
        }));
        selectTableData.value = data;
        dialogTableVisible.value = true;
      };
      const getCustomerNo = async () => {
        var _a, _b;
        let no = (_a = selectRow.value) == null ? void 0 : _a["客户卡号"];
        if (!no) {
          if (formInline.phone) {
            let res = await FieldReceptionSearchIndexMapOfTodayPhone(formInline.phone);
            no = (_b = res == null ? void 0 : res[0]) == null ? void 0 : _b["客户卡号"];
          }
        }
        return no;
      };
      const selectCustomer = (value) => {
        console.log("value", value);
        selectRow.value = value;
      };
      const initRef = () => {
        status.value = null;
        selectTableData.value = [];
        selectRow.value = null;
      };
      const parserMainForm = async (res, turnData = false) => {
        var _a, _b, _c, _d, _e, _f, _g, _h, _i, _j, _k, _l;
        let el = (_a = $(res)) == null ? void 0 : _a.find("#mainForm");
        if (!el)
          return;
        let obj = el == null ? void 0 : el.serializeObject();
        if (obj) {
          sexOptions.value = ((_b = el.find("#SEX option,#Sex option")) == null ? void 0 : _b.map((i, option) => {
            let e = $(option);
            return {
              label: e.text(),
              value: e.attr("value")
            };
          })) || [];
          countryOptions.value = (_c = el.find("#selectCountry option")) == null ? void 0 : _c.map((i, option) => {
            let e = $(option);
            return {
              label: e.text(),
              value: e.attr("value")
            };
          });
          sectionOptions.value = (_d = el.find("#Section option")) == null ? void 0 : _d.map((i, option) => {
            let e = $(option);
            return {
              label: e.text(),
              value: e.attr("value")
            };
          });
          fieldConsultantOptions.value = (_e = el.find("#FieldConsultantId option")) == null ? void 0 : _e.map((i, option) => {
            let e = $(option);
            return {
              label: e.text(),
              value: e.attr("value")
            };
          });
          representativeOptions.value = (_f = el.find("#RepresentativeId option")) == null ? void 0 : _f.map((i, option) => {
            let e = $(option);
            return {
              label: e.text(),
              value: e.attr("value")
            };
          });
          obj.Province = ((_g = el.find("#pre_province")) == null ? void 0 : _g.val()) || "";
          obj.City = ((_h = el.find("#pre_city")) == null ? void 0 : _h.val()) || "";
          obj.Area = ((_i = el.find("#pre_district")) == null ? void 0 : _i.val()) || "";
          if (!obj.Area || !obj.City || !obj.Province) {
            obj.Area = "610102";
            obj.City = "610100";
            obj.Province = "610000";
          }
          obj.provinceCascader = [
            obj.Province,
            obj.City,
            obj.Area
          ];
          if (!obj.SEX && obj.Sex)
            obj.SEX = obj.Sex;
          if (!obj.Phone)
            obj.Phone = el.find("#Phone").attr("value");
          if (obj.Section)
            await handleChangeSection(obj.Section);
          obj.changeMedia = !obj.MediaSource && !obj.MediaSourceType;
          if (obj.changeMedia) {
            mediaOptions.value = (_j = el.find("#MediaSourceType option")) == null ? void 0 : _j.map((i, option) => {
              let e = $(option);
              return {
                label: e.text(),
                value: e.attr("value")
              };
            }).toArray();
          } else {
            if (!obj.CustMedia) {
              if (!obj.MediaSourceDesc) {
                obj.MediaSourceDesc = ((_k = el.find(`option[value=${obj.MediaSource}]`)) == null ? void 0 : _k.text()) || "";
              }
              if (!obj.MediaSourceTypeDesc) {
                obj.MediaSourceTypeDesc = ((_l = el.find(`option[value=${obj.MediaSourceType}]`)) == null ? void 0 : _l.text()) || "";
              }
              if (obj.MediaSourceDesc && obj.MediaSourceTypeDesc)
                obj.CustMedia = `${obj.MediaSourceDesc} / ${obj.MediaSourceTypeDesc}`;
            }
          }
          console.log("obj", obj);
          if (turnData)
            return obj;
          Object.assign(form, obj);
        }
      };
      const createTriageForm = async (phone) => {
        let res = await FieldReceptionNoteCreateMapOfGet(phone);
        await parserMainForm(res);
        form.Section = defaultSection;
      };
      const filterNewCreateData = () => {
        form.mediaCascader = defaultMedia;
        form.FieldConsultantId = defaultId;
        form.RepresentativeId = defaultId2;
        form.Age = "1";
        form.SEX = "1";
        form.CustName = "先生";
        form.Section = defaultSection;
        form.provinceCascader = [
          "610000",
          "610100",
          "610102"
        ];
        form.Birthday = dayjs2().format("YYYY-MM-DD");
        form.CustIntention = "自然到院: 述求xxx";
      };
      const createTriageLog = async (data = null) => {
        data = data || form;
        let formData = objectFilterKey(data, FieldReceptionNoteCreateBaseForm);
        try {
          let response = await FieldReceptionNoteCreateMapOfPost(formData);
          if ((response == null ? void 0 : response.statusCode) === "200") {
            let customerNo = await getCustomerNo();
            await ElementPlus2.ElMessageBox.confirm(
              "创建成功!",
              `客户卡号: ${customerNo}`,
              {
                confirmButtonText: "真的",
                showCancelButton: false,
                type: "success"
              }
            );
            initRef();
          }
        } catch (e) {
          console.log("e createTriageLog", e);
        }
      };
      const editTriageForm = async (id) => {
        let result = await FieldReceptionSearchEditOfGet(id);
        await parserMainForm(result);
        status.value = 3;
      };
      const editTriageLog = async () => {
        let formdata = objectFilterKey(form, FieldReceptionSearchEditBaseForm);
        try {
          let response = await FieldReceptionSearchEditOfPost(formdata);
          if ((response == null ? void 0 : response.statusCode) === "200") {
            console.log("form.Phone", form.Phone);
            await editCustomerFedInfo({
              Phone: form.Phone,
              FieldConsultantId: form.FieldConsultantId,
              RepresentativeId: form.RepresentativeId
            });
            await ElementPlus2.ElMessageBox.confirm(
              "修改成功!",
              "修改成功",
              {
                confirmButtonText: "真的",
                showCancelButton: false,
                type: "success"
              }
            );
            initRef();
          }
        } catch (e) {
          console.log("editTriageLog e", e);
        }
      };
      const getCustomerFedInfo = async (phone) => {
        let res = await ManageFedConsultantChangesSearchMapOfByPhone(phone);
        return res == null ? void 0 : res.find((item) => {
          return (item["电话"] === phone || item["电话"].length === phone.length) && (item["现场客服"] === "公共池" || item["归属客户代表"] === "公共池");
        });
      };
      const editCustomerFedInfo = async ({ Phone, RepresentativeId, FieldConsultantId }) => {
        if (!Phone)
          return;
        if (!RepresentativeId && !FieldConsultantId)
          return;
        if (RepresentativeId === defaultId && FieldConsultantId === defaultId)
          return;
        let cust = await getCustomerFedInfo(Phone);
        if (!cust)
          return;
        let data = {
          ids: cust.value,
          Consultants: "",
          RepresentativeIds: ""
        };
        if (cust["现场客服"] === "公共池" && FieldConsultantId) {
          data.Consultants = FieldConsultantId === defaultId ? "" : FieldConsultantId;
        }
        if (cust["归属客户代表"] === "公共池" && RepresentativeId) {
          data.RepresentativeIds = RepresentativeId === defaultId ? "" : RepresentativeId;
        }
        if (!data.RepresentativeIds && !data.Consultants)
          return;
        return await ManageFedConsultantChangesCustUpdateAll(data);
      };
      const lightCustomer = async (phone) => {
        let res = await FieldReceptionNoteCreateMapOfGet(phone);
        let formData = await parserMainForm(res, true);
        if (!formData)
          return;
        if (!formData.MediaSourceType || !formData.MediaSource) {
          await checkMessageBox("客户存在特殊情况,无法自动点亮,请手动选择信息", "注意", {
            confirmButtonText: "确认",
            showCancelButton: false,
            type: "warning"
          });
          Object.assign(form, formData);
          status.value = 4;
          return;
        }
        if (!formData.FieldConsultantId)
          formData.FieldConsultantId = defaultId;
        if (!formData.RepresentativeId)
          formData.RepresentativeId = defaultId2;
        formData.Section = defaultSection;
        if (!formData.Age)
          formData.Age = "1";
        if (!formData.SEX)
          formData.SEX = "1";
        formData.CustIntention = "到院点亮";
        Object.assign(form, formData);
        status.value = 4;
      };
      const actionMapOfTable = async (row, action) => {
        if (tableLoading.value)
          return;
        tableLoading.value = true;
        selectCustomer(row);
        switch (action) {
          case 0:
            if (!row.value)
              return;
            await lightCustomer(row.value);
            break;
          case 1:
            if (!row.editId)
              return;
            await editTriageForm(row.editId);
            break;
          case 2:
            if (!row.value)
              return;
            await createTriageForm(row.value);
            status.value = 4;
            break;
        }
        tableLoading.value = false;
        dialogTableVisible.value = false;
      };
      const actionRun = async () => {
        console.log("running", running);
        if (running)
          return;
        try {
          let validateResult = await ruleFormRef.value.validate();
          if (!validateResult)
            return;
          emits("changeStatus", true);
          switch (status.value) {
            case 4:
            case 0:
              await createTriageLog();
              break;
            case 3:
              await editTriageLog();
              break;
          }
          emits("changeStatus", false);
        } catch (e) {
          console.log("e", e);
          emits("changeStatus", false);
        }
      };
      const handleChangeCascader = (value) => {
        form.Province = value[0];
        form.City = value[1];
        form.Area = value[2];
      };
      const handleChangeMediaCascader = (val) => {
        console.log("val", val);
        form.MediaSource = val[0];
        form.MediaSourceType = val[1];
      };
      const handleChangeAge = (val) => {
        if (!form.Age)
          return;
        form.Birthday = dayjs2().subtract(form.Age, "year").format("YYYY-MM-DD");
      };
      const handleChangeBrithDay = (val) => {
        if (!form.Birthday)
          return;
        let c = dayjs2().diff(form.Birthday, "year");
        if (c)
          form.Age = c + 1;
      };
      const handleChangeSection = async (value) => {
        console.log("value", value);
        if (!value)
          return;
        let result = await CommonAreaCommonGetEmployeeInfoListMapOfByDepartment(value);
        doctorOptions.value = result.map((item) => {
          return {
            label: `${item.EmpName}(${item.EmpNo})`,
            value: item.Id
          };
        });
        console.log("result", doctorOptions.value);
      };
      return (_ctx, _cache) => {
        const _component_el_alert = vue.resolveComponent("el-alert");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_button_group = vue.resolveComponent("el-button-group");
        const _component_el_table_column = vue.resolveComponent("el-table-column");
        const _component_el_table = vue.resolveComponent("el-table");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_date_picker = vue.resolveComponent("el-date-picker");
        const _component_el_cascader = vue.resolveComponent("el-cascader");
        const _directive_loading = vue.resolveDirective("loading");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_component_el_dialog, {
            modelValue: dialogTableVisible.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => dialogTableVisible.value = $event),
            width: "60%",
            title: "选择顾客"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_alert, {
                title: "注意事项",
                type: "info"
              }, {
                default: vue.withCtx(() => [
                  _hoisted_1$2,
                  _hoisted_2,
                  _hoisted_3,
                  _hoisted_4
                ]),
                _: 1
              }),
              vue.withDirectives((vue.openBlock(), vue.createBlock(_component_el_table, { data: selectTableData.value }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_table_column, {
                    label: "操作",
                    width: "150px"
                  }, {
                    default: vue.withCtx((scope) => [
                      vue.createVNode(_component_el_button_group, null, {
                        default: vue.withCtx(() => [
                          !scope.row.editId ? (vue.openBlock(), vue.createBlock(_component_el_button, {
                            key: 0,
                            disabled: scope.row.today,
                            size: "small",
                            type: "primary",
                            onClick: ($event) => actionMapOfTable(scope.row, 0)
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(vue.toDisplayString(scope.row.today ? "已点亮" : "点亮"), 1)
                            ]),
                            _: 2
                          }, 1032, ["disabled", "onClick"])) : vue.createCommentVNode("", true),
                          !!scope.row.editId ? (vue.openBlock(), vue.createBlock(_component_el_button, {
                            key: 1,
                            size: "small",
                            type: "primary",
                            onClick: ($event) => actionMapOfTable(scope.row, 1)
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode(" 修改 ")
                            ]),
                            _: 2
                          }, 1032, ["onClick"])) : vue.createCommentVNode("", true),
                          vue.createVNode(_component_el_button, {
                            size: "small",
                            type: "primary",
                            onClick: ($event) => actionMapOfTable(scope.row, 2)
                          }, {
                            default: vue.withCtx(() => [
                              vue.createTextVNode("新建")
                            ]),
                            _: 2
                          }, 1032, ["onClick"])
                        ]),
                        _: 2
                      }, 1024)
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_table_column, {
                    property: "客户姓名",
                    label: "客户姓名"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    property: "建档时间",
                    label: "建档时间"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    property: "客户类型",
                    label: "客户类型"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    property: "手机",
                    label: "手机"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    property: "归属现场客服",
                    label: "归属现场客服"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    property: "客户代表",
                    label: "客户代表"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    property: "建档人",
                    label: "建档人"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    property: "线上客服",
                    label: "线上客服"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    property: "网电回访人",
                    label: "网电回访人"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    property: "客户卡号",
                    label: "客户卡号"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    property: "身份证号",
                    label: "身份证号"
                  }),
                  vue.createVNode(_component_el_table_column, {
                    property: "预约类型",
                    label: "预约类型"
                  })
                ]),
                _: 1
              }, 8, ["data"])), [
                [_directive_loading, tableLoading.value]
              ])
            ]),
            _: 1
          }, 8, ["modelValue"]),
          vue.createVNode(_component_el_form, {
            inline: true,
            ref_key: "ruleInlineFormRef",
            ref: ruleInlineFormRef,
            rules: inlineRules,
            model: formInline,
            onSubmit: vue.withModifiers(searchPhone, ["prevent"]),
            class: "demo-form-inline"
          }, {
            default: vue.withCtx(() => [
              vue.createVNode(_component_el_form_item, {
                label: "顾客号码",
                prop: "phone"
              }, {
                default: vue.withCtx(() => [
                  vue.createVNode(_component_el_input, {
                    disabled: !!vue.unref(statusMessage),
                    modelValue: formInline.phone,
                    "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => formInline.phone = $event),
                    placeholder: "请输入顾客手机号码"
                  }, null, 8, ["disabled", "modelValue"])
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_form_item, null, {
                default: vue.withCtx(() => [
                  vue.withDirectives((vue.openBlock(), vue.createBlock(_component_el_button, {
                    onClick: searchPhone,
                    disabled: !!vue.unref(statusMessage)
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("查询")
                    ]),
                    _: 1
                  }, 8, ["disabled"])), [
                    [_directive_loading, searchLoading.value]
                  ]),
                  vue.withDirectives(vue.createVNode(_component_el_button, { onClick: initRef }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("重置")
                    ]),
                    _: 1
                  }, 512), [
                    [vue.vShow, !!vue.unref(statusMessage)]
                  ])
                ]),
                _: 1
              })
            ]),
            _: 1
          }, 8, ["rules", "model", "onSubmit"]),
          !!vue.unref(statusMessage) ? vue.withDirectives((vue.openBlock(), vue.createBlock(_component_el_form, {
            key: 0,
            model: form,
            ref_key: "ruleFormRef",
            ref: ruleFormRef,
            rules,
            inline: true,
            onSubmit: vue.withModifiers(actionRun, ["prevent"]),
            "element-loading-text": loadingText.value
          }, {
            default: vue.withCtx(() => {
              var _a, _b;
              return [
                !!((_a = selectRow.value) == null ? void 0 : _a["客户卡号"]) ? (vue.openBlock(), vue.createElementBlock("h5", _hoisted_5, [
                  vue.createTextVNode(" 客户卡号 ["),
                  vue.createElementVNode("strong", null, vue.toDisplayString((_b = selectRow.value) == null ? void 0 : _b["客户卡号"]), 1),
                  vue.createTextVNode("] ")
                ])) : vue.createCommentVNode("", true),
                vue.createVNode(_component_el_form_item, {
                  label: "姓名",
                  prop: "CustName"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.CustName,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.CustName = $event),
                      placeholder: "姓名"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "手机",
                  prop: "Phone"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.Phone,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.Phone = $event),
                      placeholder: "手机",
                      disabled: ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "性别",
                  prop: "SEX"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_select, {
                      modelValue: form.SEX,
                      "onUpdate:modelValue": _cache[4] || (_cache[4] = ($event) => form.SEX = $event),
                      placeholder: "性别"
                    }, {
                      default: vue.withCtx(() => [
                        !!sexOptions.value ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(sexOptions.value, (value, key) => {
                          return vue.openBlock(), vue.createBlock(_component_el_option, {
                            key,
                            label: value.label,
                            value: value.value
                          }, null, 8, ["label", "value"]);
                        }), 128)) : vue.createCommentVNode("", true)
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "年龄",
                  prop: "Age"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.Age,
                      "onUpdate:modelValue": _cache[5] || (_cache[5] = ($event) => form.Age = $event),
                      placeholder: "年龄",
                      onBlur: handleChangeAge
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "生日",
                  prop: "Birthday"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_date_picker, {
                      modelValue: form.Birthday,
                      "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => form.Birthday = $event),
                      placeholder: "生日",
                      "value-format": "YYYY-MM-DD",
                      format: "YYYY-MM-DD",
                      type: "date",
                      onChange: handleChangeBrithDay
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                !form.changeMedia ? (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                  key: 1,
                  label: "媒介",
                  prop: "CustMedia"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.CustMedia,
                      "onUpdate:modelValue": _cache[7] || (_cache[7] = ($event) => form.CustMedia = $event),
                      placeholder: "媒介",
                      disabled: ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })) : (vue.openBlock(), vue.createBlock(_component_el_form_item, {
                  key: 2,
                  label: "媒介",
                  prop: "mediaCascader"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_cascader, {
                      placeholder: "请选择媒介",
                      modelValue: form.mediaCascader,
                      "onUpdate:modelValue": _cache[8] || (_cache[8] = ($event) => form.mediaCascader = $event),
                      props: mediaCascaderProps,
                      onChange: handleChangeMediaCascader
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })),
                status.value !== 3 ? (vue.openBlock(), vue.createElementBlock(vue.Fragment, { key: 3 }, [
                  vue.createVNode(_component_el_form_item, {
                    label: "国家/地区",
                    prop: "Country"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_select, {
                        modelValue: form.Country,
                        "onUpdate:modelValue": _cache[9] || (_cache[9] = ($event) => form.Country = $event),
                        placeholder: "国家/地区"
                      }, {
                        default: vue.withCtx(() => [
                          !!countryOptions.value ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(countryOptions.value, (value, key) => {
                            return vue.openBlock(), vue.createBlock(_component_el_option, {
                              key,
                              label: value.label,
                              value: value.value
                            }, null, 8, ["label", "value"]);
                          }), 128)) : vue.createCommentVNode("", true)
                        ]),
                        _: 1
                      }, 8, ["modelValue"])
                    ]),
                    _: 1
                  }),
                  vue.createVNode(_component_el_form_item, {
                    label: "省/城/区",
                    prop: "provinceCascader"
                  }, {
                    default: vue.withCtx(() => [
                      vue.createVNode(_component_el_cascader, {
                        modelValue: form.provinceCascader,
                        "onUpdate:modelValue": _cache[10] || (_cache[10] = ($event) => form.provinceCascader = $event),
                        placeholder: "请选择城市",
                        props: cascaderProps,
                        options: vue.unref(provinceList),
                        filterable: "",
                        onChange: handleChangeCascader
                      }, null, 8, ["modelValue", "options"])
                    ]),
                    _: 1
                  })
                ], 64)) : vue.createCommentVNode("", true),
                vue.createVNode(_component_el_form_item, {
                  label: "分诊科室",
                  prop: "Section"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_select, {
                      modelValue: form.Section,
                      "onUpdate:modelValue": _cache[11] || (_cache[11] = ($event) => form.Section = $event),
                      onChange: handleChangeSection,
                      placeholder: "分诊科室"
                    }, {
                      default: vue.withCtx(() => [
                        !!sectionOptions.value ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(sectionOptions.value, (value, key) => {
                          return vue.openBlock(), vue.createBlock(_component_el_option, {
                            key,
                            label: value.label,
                            value: value.value
                          }, null, 8, ["label", "value"]);
                        }), 128)) : vue.createCommentVNode("", true)
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "医生",
                  prop: "DoctorId"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_select, {
                      modelValue: form.DoctorId,
                      "onUpdate:modelValue": _cache[12] || (_cache[12] = ($event) => form.DoctorId = $event),
                      filterable: "",
                      placeholder: "医生"
                    }, {
                      default: vue.withCtx(() => [
                        !!doctorOptions.value ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(doctorOptions.value, (value, key) => {
                          return vue.openBlock(), vue.createBlock(_component_el_option, {
                            key,
                            label: value.label,
                            value: value.value
                          }, null, 8, ["label", "value"]);
                        }), 128)) : vue.createCommentVNode("", true)
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "现场客服",
                  prop: "FieldConsultantId"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_select, {
                      modelValue: form.FieldConsultantId,
                      "onUpdate:modelValue": _cache[13] || (_cache[13] = ($event) => form.FieldConsultantId = $event),
                      filterable: "",
                      placeholder: "现场客服"
                    }, {
                      default: vue.withCtx(() => [
                        !!fieldConsultantOptions.value ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(fieldConsultantOptions.value, (value, key) => {
                          return vue.openBlock(), vue.createBlock(_component_el_option, {
                            key,
                            label: value.label,
                            value: value.value
                          }, null, 8, ["label", "value"]);
                        }), 128)) : vue.createCommentVNode("", true)
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "客户代表",
                  prop: "RepresentativeId"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_select, {
                      modelValue: form.RepresentativeId,
                      "onUpdate:modelValue": _cache[14] || (_cache[14] = ($event) => form.RepresentativeId = $event),
                      filterable: "",
                      placeholder: "客户代表"
                    }, {
                      default: vue.withCtx(() => [
                        !!representativeOptions.value ? (vue.openBlock(true), vue.createElementBlock(vue.Fragment, { key: 0 }, vue.renderList(representativeOptions.value, (value, key) => {
                          return vue.openBlock(), vue.createBlock(_component_el_option, {
                            key,
                            label: value.label,
                            value: value.value
                          }, null, 8, ["label", "value"]);
                        }), 128)) : vue.createCommentVNode("", true)
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, {
                  label: "客户意向描述",
                  prop: "CustIntention"
                }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      autosize: { minRows: 2, maxRows: 4 },
                      modelValue: form.CustIntention,
                      "onUpdate:modelValue": _cache[15] || (_cache[15] = ($event) => form.CustIntention = $event),
                      placeholder: "客户意向描述"
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createElementVNode("div", _hoisted_6, [
                  vue.createVNode(_component_el_button, {
                    type: "primary",
                    onClick: actionRun
                  }, {
                    default: vue.withCtx(() => [
                      vue.createTextVNode("保存接诊单")
                    ]),
                    _: 1
                  })
                ])
              ];
            }),
            _: 1
          }, 8, ["model", "rules", "onSubmit", "element-loading-text"])), [
            [_directive_loading, __props.running]
          ]) : vue.createCommentVNode("", true)
        ], 64);
      };
    }
  };
  function mitt(n) {
    return { all: n = n || /* @__PURE__ */ new Map(), on: function(t, e) {
      var i = n.get(t);
      i ? i.push(e) : n.set(t, [e]);
    }, off: function(t, e) {
      var i = n.get(t);
      i && (e ? i.splice(i.indexOf(e) >>> 0, 1) : n.set(t, []));
    }, emit: function(t, e) {
      var i = n.get(t);
      i && i.slice().map(function(n2) {
        n2(e);
      }), (i = n.get("*")) && i.slice().map(function(n2) {
        n2(t, e);
      });
    } };
  }
  const emitter = mitt();
  function useEmitter() {
    return emitter;
  }
  const _hoisted_1$1 = { class: "dialog-footer" };
  const _sfc_main$1 = {
    __name: "DialogForm",
    setup(__props) {
      const emitter2 = useEmitter();
      const rowData = vue.ref();
      const dialogVisible = vue.ref(false);
      const form = vue.reactive({
        name: "",
        type: "拍片",
        department: "CT室1",
        remark: "CT室1"
      });
      vue.onMounted(() => {
        emitter2.on("test_dialog", (val) => {
          if (val) {
            rowData.value = val;
            form.name = val["data-custname"];
            dialogVisible.value = true;
          }
          console.log("val", val);
        });
      });
      return (_ctx, _cache) => {
        const _component_el_input = vue.resolveComponent("el-input");
        const _component_el_form_item = vue.resolveComponent("el-form-item");
        const _component_el_option = vue.resolveComponent("el-option");
        const _component_el_select = vue.resolveComponent("el-select");
        const _component_el_form = vue.resolveComponent("el-form");
        const _component_el_button = vue.resolveComponent("el-button");
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        return vue.openBlock(), vue.createBlock(_component_el_dialog, {
          modelValue: dialogVisible.value,
          "onUpdate:modelValue": _cache[6] || (_cache[6] = ($event) => dialogVisible.value = $event),
          title: "新增拍片叫号"
        }, {
          footer: vue.withCtx(() => [
            vue.createElementVNode("span", _hoisted_1$1, [
              vue.createVNode(_component_el_button, {
                onClick: _cache[4] || (_cache[4] = ($event) => dialogVisible.value = false)
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode("取消")
                ]),
                _: 1
              }),
              vue.createVNode(_component_el_button, {
                type: "primary",
                onClick: _cache[5] || (_cache[5] = ($event) => dialogVisible.value = false)
              }, {
                default: vue.withCtx(() => [
                  vue.createTextVNode(" 确认 ")
                ]),
                _: 1
              })
            ])
          ]),
          default: vue.withCtx(() => [
            vue.createVNode(_component_el_form, { model: form }, {
              default: vue.withCtx(() => [
                vue.createVNode(_component_el_form_item, { label: "顾客姓名" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      modelValue: form.name,
                      "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => form.name = $event),
                      disabled: ""
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "业务类型" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_select, {
                      modelValue: form.type,
                      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => form.type = $event),
                      placeholder: "请选择业务类型"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_option, {
                          label: "拍片",
                          value: "拍片"
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "业务科室" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_select, {
                      modelValue: form.department,
                      "onUpdate:modelValue": _cache[2] || (_cache[2] = ($event) => form.department = $event),
                      placeholder: "请选择业务科室"
                    }, {
                      default: vue.withCtx(() => [
                        vue.createVNode(_component_el_option, {
                          label: "CT室1",
                          value: "CT室1"
                        })
                      ]),
                      _: 1
                    }, 8, ["modelValue"])
                  ]),
                  _: 1
                }),
                vue.createVNode(_component_el_form_item, { label: "备注" }, {
                  default: vue.withCtx(() => [
                    vue.createVNode(_component_el_input, {
                      type: "textarea",
                      modelValue: form.remark,
                      "onUpdate:modelValue": _cache[3] || (_cache[3] = ($event) => form.remark = $event)
                    }, null, 8, ["modelValue"])
                  ]),
                  _: 1
                })
              ]),
              _: 1
            }, 8, ["model"])
          ]),
          _: 1
        }, 8, ["modelValue"]);
      };
    }
  };
  const App_vue_vue_type_style_index_0_scoped_e31b17fe_lang = "";
  const _export_sfc = (sfc, props) => {
    const target = sfc.__vccOpts || sfc;
    for (const [key, val] of props) {
      target[key] = val;
    }
    return target;
  };
  const _hoisted_1 = { class: "fixed" };
  const _sfc_main = {
    __name: "App",
    setup(__props) {
      const dialogVisible = vue.ref(false);
      const running = vue.ref(false);
      const commandKey = vue.ref("创建接诊单");
      const componentList = {
        "创建接诊单": _sfc_main$2
      };
      vue.onMounted(async () => {
      });
      const handleShow = () => {
        dialogVisible.value = true;
      };
      const changeStatus = (val) => {
        running.value = val;
      };
      const handleClose = (done) => {
        if (running.value)
          return;
        done();
      };
      return (_ctx, _cache) => {
        const _component_el_dialog = vue.resolveComponent("el-dialog");
        const _component_el_button = vue.resolveComponent("el-button");
        return vue.openBlock(), vue.createElementBlock(vue.Fragment, null, [
          vue.createVNode(_sfc_main$1),
          vue.createVNode(_component_el_dialog, {
            modelValue: dialogVisible.value,
            "onUpdate:modelValue": _cache[0] || (_cache[0] = ($event) => dialogVisible.value = $event),
            title: commandKey.value,
            "before-close": handleClose,
            width: "70%"
          }, {
            default: vue.withCtx(() => [
              (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(componentList[commandKey.value]), {
                command: commandKey.value,
                running: running.value,
                onChangeStatus: changeStatus
              }, null, 40, ["command", "running"]))
            ]),
            _: 1
          }, 8, ["modelValue", "title"]),
          vue.createElementVNode("div", _hoisted_1, [
            vue.createVNode(_component_el_button, {
              type: "primary",
              onClick: handleShow
            }, {
              default: vue.withCtx(() => [
                vue.createTextVNode("创建接诊单")
              ]),
              _: 1
            })
          ])
        ], 64);
      };
    }
  };
  const App = /* @__PURE__ */ _export_sfc(_sfc_main, [["__scopeId", "data-v-e31b17fe"]]);
  (function($2) {
    $2.fn.serializeObject = function() {
      var self = this, json = {}, push_counters = {}, patterns = {
        "validate": /^[a-zA-Z][a-zA-Z0-9_]*(?:\[(?:\d*|[a-zA-Z0-9_]+)\])*$/,
        "key": /[a-zA-Z0-9_]+|(?=\[\])/g,
        "push": /^$/,
        "fixed": /^\d+$/,
        "named": /^[a-zA-Z0-9_]+$/
      };
      this.build = function(base, key, value) {
        base[key] = value;
        return base;
      };
      this.push_counter = function(key) {
        if (push_counters[key] === void 0) {
          push_counters[key] = 0;
        }
        return push_counters[key]++;
      };
      $2.each($2(this).serializeArray(), function() {
        if (!patterns.validate.test(this.name)) {
          return;
        }
        var k, keys = this.name.match(patterns.key), merge = this.value, reverse_key = this.name;
        while ((k = keys.pop()) !== void 0) {
          reverse_key = reverse_key.replace(new RegExp("\\[" + k + "\\]$"), "");
          if (k.match(patterns.push)) {
            merge = self.build([], self.push_counter(reverse_key), merge);
          } else if (k.match(patterns.fixed)) {
            merge = self.build([], k, merge);
          } else if (k.match(patterns.named)) {
            merge = self.build({}, k, merge);
          }
        }
        json = $2.extend(true, json, merge);
      });
      return json;
    };
  })(jQuery);
  const app = vue.createApp(App);
  app.use(ElementPlus2, {
    locale: zhCn
  }).mount(
    (() => {
      const app2 = document.createElement("div");
      document.body.append(app2);
      return app2;
    })()
  );
  return app;
}(Vue, ElementPlus, dayjs, ElementPlusLocaleZhCn);
