// ==UserScript==
// @name         CAUJsHelper
// @namespace    http://drlchys.xyz/
// @version      1.7
// @description  中国农业大学网上办事大厅1803业务hook
// @author       Fanyi Guo, China Agricultural Uniersity
// @match        http*://onehall.cau.edu.cn/tp_fp/formParser?formid=ee235148-a501-4689-9b6a-24301a4c&status=select*
// @match        http*://newjw.cau.edu.cn/jsxsd/jsjyGl/goQueryJsjy*
// @match        http*://onehall.cau.edu.cn/tp_fp/view?m=fp*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=cau.edu.cn
// @resource     jiuyeTemplate https://static.drlchys.xyz/cau/onehall/jiuyeTemplate.json
// @run-at       document-start
// @grant        unsafeWindow
// @grant        GM_setValue
// @grant        GM_getValue
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @license      LGPL
// @downloadURL https://update.greasyfork.org/scripts/459264/CAUJsHelper.user.js
// @updateURL https://update.greasyfork.org/scripts/459264/CAUJsHelper.meta.js
// ==/UserScript==

(function () {
  'use strict'
  function jsonToURI (json) { return encodeURIComponent(JSON.stringify(json)) }
  function uriToJSON (urijson) { return JSON.parse(decodeURIComponent(urijson)) }
  /**
   * 获取字符串真实长度（一个中文字符按2个英文字符计算）
   * @param str 字符串
   * @returns 字符串真实长度
   */
  function getTrueLength (str) {
    var realLength = 0
    for (var i = 0; i < str.length; i++) {
      var charCode = str.charCodeAt(i)
      if (charCode >= 0 && charCode <= 128) { realLength += 1 } else { realLength += 2 }
    }
    return realLength
  }
  /**
   * 按真字符串长度截取字符串
   * @param str 要截取的字符串
   * @param start 开始位置
   * @param n 长度
   * @returns 截取后的字符串
   */
  function TrueSubstr (str, start, n) {
    if (str.replace(/[\u4e00-\u9fa5]/g, '**').length <= n) {
      return str
    }
    let len = 0
    let tmpStr = ''
    for (let i = start; i < str.length; i++) { // 遍历字符串
      if (/[\u4e00-\u9fa5]/.test(str[i])) { // 中文 长度为两字节
        len += 2
      } else {
        len += 1
      }
      if (len > n) {
        break
      } else {
        tmpStr += str[i]
      }
    }
    return tmpStr
  }
  function twoDigitDateFormat(dateDigits){
    return ("0" + dateDigits).slice(-2)
  }
  /**
   * 网上办事大厅-1803学生社团综合业务|业务办理功能增强
   * 1、将教室借用信息一键发送到教务系统中填表
   * 2、一键打印物资借用承诺书
   * 3、一键打印就业创业办公室场地借用单
   */
  function oneHallHook () {
    if (window.location.href.indexOf('formid=ee235148-a501') == -1) return
    // formid=ee235148-a501
    if (Util.getActinstName() == '填写状态' || Util.getActinstName()=="服务发起人") return// 必须是办理阶段
    // let preReviewWarning = Util.getActinstName() == '社团工作部预审' // 预审阶段，要进行提示
    let preReviewWarning = false //2024.10.24 由于业务办理流程调整，预审阶段不弹窗提示
    // 功能：将申请信息发送到教务系统
    var jsjyWindow = null
    // $('#CD').data('FormWidget').bindAfterAddEvent(function ($node) {
    $('#CD').data('FormWidget').element.find('[node]').map((_, $node) => {
      // console.log($node)
      if ($('[column=CD_type]', $node).val().indexOf('教学楼') == -1) return
      // $("div:first div",$node)[0].append("")
      var bdata = {}
      var toJsJyBtn = $(`<button class="btn btn-primary push-right-5 center-btn" type="button" name="ext_CD_btn"
                            style="display:block;margin-left:10rem;height:28px;line-height:18px;">
                            <i class="fa fa-check push-right-5"></i>同步到教务系统</button>`)
      bdata.lxdh = $('[column=CD_zrrdh]', $node).val()
      bdata.cjrs = $('[column=CD_renshu]', $node).val()
      bdata.xq = $('[column=CD_type]', $node).val().indexOf('西') == -1 ? '01' : '02'
      bdata.yy = `${$('#ShenQingSheTuan').val()}${$('[column=CD_zrr]', $node).val()}借${$('[column=CD_huodongneirong]', $node).val()}`
      bdata.yy = getTrueLength(bdata.yy) <= 32 ? bdata.yy : TrueSubstr(bdata.yy, 0, 30) + '..'
      bdata.rq = $('[column=CD_jiaoxuelou_riqi]', $node).val()
      bdata.sj = []
      // console.log($("[column=CD_jiaoxuelou_shijian]", $node))
      var tmp = $('[column=CD_jiaoxuelou_shijian]', $node).val()
      for (var i = 0; i < tmp.length; i++) {
        if (tmp[i].indexOf('1-2') != -1) bdata.sj.push('01'), bdata.sj.push('02')
        else if (tmp[i].indexOf('3-4') != -1) bdata.sj.push('03'), bdata.sj.push('04')
        else if (tmp[i].indexOf('5-6') != -1) bdata.sj.push('05'), bdata.sj.push('06')
        else if (tmp[i].indexOf('7-8') != -1) bdata.sj.push('07'), bdata.sj.push('08')
        else if (tmp[i].indexOf('9-10') != -1) bdata.sj.push('09'), bdata.sj.push('10')
        else if (tmp[i].indexOf('11-12') != -1) bdata.sj.push('11'), bdata.sj.push('12')
        else if (tmp[i].indexOf('中午') != -1) bdata.sj.push('zw')
        else if (tmp[i].indexOf('晚上') != -1) bdata.sj.push('ws')
      }
      toJsJyBtn.data('bdata', bdata)
      // console.log(bdata)
      // console.log(toJsJyBtn)
      toJsJyBtn.click(() => {
        /*if (preReviewWarning) {
         Msg.warning('当前为预审阶段，预审阶段不应进行办理，是否继续？', () => {
            jsjyWindow = unsafeWindow.open('https://newjw.cau.edu.cn/jsxsd/jsjyGl/goQueryJsjy?' + jsonToURI(bdata), 'jsjyWindow')
          })
        } else {
          jsjyWindow = unsafeWindow.open('https://newjw.cau.edu.cn/jsxsd/jsjyGl/goQueryJsjy?' + jsonToURI(bdata), 'jsjyWindow')
        }*/
          jsjyWindow = unsafeWindow.open('https://newjw.cau.edu.cn/jsxsd/jsjyGl/goQueryJsjy?' + jsonToURI(bdata), 'jsjyWindow')
      })
      $('div:first div', $node).append(toJsJyBtn)
      // console.log()
    });

    // 功能：打印物资借用承诺书
    (function () {
      // console.log(hiprint)
      hiprint.init()
      let printBtn = $(`<div class="link_btn_bar swiper-container-btn swiper-container-horizontal swiper-container-free-mode" style="width: auto;margin-left:1rem;"><div class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px);"><a href="javascript:;" class="link_btn swiper-slide swiper-slide-active"><i class="fa fa-print"></i>打印</a></div></div>`)
      let printDateBtn = $(`<div class="link_btn_bar swiper-container-btn swiper-container-horizontal swiper-container-free-mode" style="width: auto;margin-left:1rem;" onclick="WdatePicker({dateFmt:'落款日期：yyyy年M月d日',vel:'gRealDate'})"><div class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px);"><a href="javascript:;" class="link_btn swiper-slide swiper-slide-active">落款日期：${new Date().format('yyyy年M月d日')}</a></div></div><input type="hidden" id="gRealDate" value="${new Date().format('yyyy-MM-dd')}"/>`)
      let printFunc = function () {
        let template = { 'panels': [{ 'index': 0, 'height': 297, 'width': 210, 'paperHeader': 45, 'paperFooter': 780, 'printElements': [{ 'options': { 'left': 191, 'top': 37.5, 'height': 16.5, 'width': 213, 'formatter': "function(value, options, templateData){if(templateData.main.template2==0) return '<p class=\"MsoNormal\" align=\"center\" style=\"text-align:center;color:black;\"><span style=\"font-size:10.5pt;font-family:黑体;mso-hansi-font-family:&quot;Times New Roman&quot;\">中国农业大学体育馆管理中心</span></p>'; return '<p class=\"MsoNormal\" align=\"center\" style=\"text-align:center;color:black;\"><span style=\"font-size:10.5pt;font-family:黑体;mso-hansi-font-family:&quot;Times New Roman&quot;\">共青团中国农业大学委员会</span></p>' }", 'right': 432, 'bottom': 40.5, 'vCenter': 325.5, 'hCenter': 32.25, 'coordinateSync': false, 'widthHeightSync': false }, 'printElementType': { 'title': 'html', 'type': 'html' } }, { 'options': { 'left': 85, 'top': 54, 'height': 9, 'width': 425, 'coordinateSync': false, 'widthHeightSync': false }, 'printElementType': { 'title': '横线', 'type': 'hline' } }, { 'options': { 'left': 82, 'top': 55.5, 'height': 421.5, 'width': 425, 'title': '主要内容', 'field': 'main', 'coordinateSync': false, 'widthHeightSync': false, 'hideTitle': true, 'lineHeight': 19.5, 'qrCodeLevel': 0, 'formatter': 'function (value, options, templateData) {if(options.template2==0) return `<div class="WordSection1" style="color:#000;word-wrap:break-word"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:18pt;font-family:黑体">物资借用承诺书<span lang="EN-US"></span></span></p><p class="MsoNormal" align="center" style="text-align:center"><span lang="EN-US" style="font-family:黑体"><o:p>&nbsp;</o:p></span></p><p class="MsoNormal" align="center" style="text-align:center"><span lang="EN-US" style="font-family:黑体"></span></p><p class="MsoNormal" style="text-indent:28pt"><span style="font-size:14pt;font-family:仿宋">本人确认附表中的物资均为中国农业大学体育馆管理中心所有。我方承诺若物资在使用过程中丢失或者人为损坏，将按物资原价理赔，且借用物资使用完毕后在借用期限内归还。如逾期未还，中国农业大学体育馆管理中心有权要求借用方理赔适当物资消耗损失费。<span lang="EN-US"></span></span></p><p class="MsoNormal" style="text-indent:42pt"><span lang="EN-US" style="font-size:14pt;font-family:仿宋"><o:p>&nbsp;</o:p></span></p><p class="MsoNormal" align="right" style="text-align:right"><span style="font-size:14pt;font-family:黑体">借用单位签字：<span lang="EN-US"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>（公章）<span lang="EN-US"></span></span></p><p align="right" style="text-align:right"><span style="font-size:14pt;font-family:黑体">${options.y}&nbsp;年&nbsp;${options.m}&nbsp;月&nbsp;${options.d}&nbsp;日&nbsp;&nbsp;&nbsp;</span></p><p><span style="font-size:14pt;font-family:仿宋">附借用物资清单：</span></p></div><style>p.MsoNormal{margin:0 auto}</style><table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;word-wrap:break-word;line-height:20pt"><tbody><tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">借用单位<span></span></span></p></td><td width="441" colspan="3" style="width:330.7pt;border:solid windowtext 1pt;border-left:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">共青团中国农业大学委员会(${options.stname})</span></p></td></tr><tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">活动名称<span></span></span></p></td><td width="441" colspan="3" style="width:330.7pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">${options.hdname}</span></p></td></tr><tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">借用期限<span></span></span></p></td><td width="441" colspan="3" style="width:330.7pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">${options.jysj}</span></p></td></tr><tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">借用人<span></span></span></p></td><td width="144" style="width:108pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">${options.zrr}</span></p></td><td width="132" style="width:99pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">联系方式<span></span></span></p></td><td width="165" style="width:123.7pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">${options.zrrdh}</span></p></td></tr><tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">物资名称<span></span></span></p></td><td width="144" style="width:108pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">数量（单位）<span></span></span></p></td><td width="132" style="width:99pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" style="text-indent:18pt"><span style="font-size:12pt;font-family:仿宋">规格型号<span></span></span></p></td><td width="165" style="width:123.7pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">单价<span></span></span></p></td></tr>${options.list.map((item) => { return `<tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">${item.name}</span></p></td><td width="144" style="width:108pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">${item.num}</span></p></td><td width="132" style="width:99pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">&nbsp;</span></p></td><td width="165" style="width:123.7pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">&nbsp;</span></p></td></tr>`; }).join("")}<tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal"><span style="font-size:12pt;font-family:仿宋">&nbsp;</span></p></td><td width="144" style="width:108pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">&nbsp;</span></p></td><td width="132" style="width:99pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">&nbsp;</span></p></td><td width="165" style="width:123.7pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">&nbsp;</span></p></td></tr><tr><td width="568" colspan="4" style="width:426.1pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">备注：如活动中使用物资过多，表格不够，请另附清单！<span></span></span></p></td></tr></tbody></table>`; return `<div class="WordSection1" style="color:#000;word-wrap:break-word"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:18pt;font-family:黑体">物资借用承诺书<span lang="EN-US"></span></span></p><p class="MsoNormal" align="center" style="text-align:center"><span lang="EN-US" style="font-family:黑体"><o:p>&nbsp;</o:p></span></p><p class="MsoNormal" align="center" style="text-align:center"><span lang="EN-US" style="font-family:黑体"></span></p><p class="MsoNormal" style="text-indent:28pt"><span style="font-size:14pt;font-family:仿宋">本人确认附表中的物资均为共青团中国农业大学委员会所有。我方承诺若物资在使用过程中丢失或者人为损坏，将按物资原价理赔，且借用物资使用完毕后在借用期限内归还。如逾期未还，共青团中国农业大学委员会有权要求借用方理赔适当物资消耗损失费。<span lang="EN-US"></span></span></p><p class="MsoNormal" style="text-indent:42pt"><span lang="EN-US" style="font-size:14pt;font-family:仿宋"><o:p>&nbsp;</o:p></span></p><p class="MsoNormal" align="right" style="text-align:right"><span style="font-size:14pt;font-family:黑体">指导单位意见：<span lang="EN-US"><span>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</span></span>（公章）<span lang="EN-US"></span></span></p><p align="right" style="text-align:right"><span style="font-size:14pt;font-family:黑体">${options.y}&nbsp;年&nbsp;${options.m}&nbsp;月&nbsp;${options.d}&nbsp;日&nbsp;&nbsp;&nbsp;</span></p><p><span style="font-size:14pt;font-family:仿宋">附借用物资清单：</span></p></div><style>p.MsoNormal{margin:0 auto}</style><table class="MsoNormalTable" border="1" cellspacing="0" cellpadding="0" style="border-collapse:collapse;border:none;word-wrap:break-word;line-height:20pt"><tbody><tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">借用单位<span></span></span></p></td><td width="441" colspan="3" style="width:330.7pt;border:solid windowtext 1pt;border-left:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">共青团中国农业大学委员会(${options.stname})</span></p></td></tr><tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">活动名称<span></span></span></p></td><td width="441" colspan="3" style="width:330.7pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">${options.hdname}</span></p></td></tr><tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">借用期限<span></span></span></p></td><td width="441" colspan="3" style="width:330.7pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">${options.jysj}</span></p></td></tr><tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">借用人<span></span></span></p></td><td width="144" style="width:108pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">${options.zrr}</span></p></td><td width="132" style="width:99pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">联系方式<span></span></span></p></td><td width="165" style="width:123.7pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">${options.zrrdh}</span></p></td></tr><tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">物资名称<span></span></span></p></td><td width="144" style="width:108pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">数量（单位）<span></span></span></p></td><td width="132" style="width:99pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" style="text-indent:18pt"><span style="font-size:12pt;font-family:仿宋">规格型号<span></span></span></p></td><td width="165" style="width:123.7pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">单价<span></span></span></p></td></tr>${options.list.map((item) => { return `<tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">${item.name}</span></p></td><td width="144" style="width:108pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">${item.num}</span></p></td><td width="132" style="width:99pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">&nbsp;</span></p></td><td width="165" style="width:123.7pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">&nbsp;</span></p></td></tr>`; }).join("")}<tr><td width="127" style="width:95.4pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal"><span style="font-size:12pt;font-family:仿宋">&nbsp;</span></p></td><td width="144" style="width:108pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">&nbsp;</span></p></td><td width="132" style="width:99pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">&nbsp;</span></p></td><td width="165" style="width:123.7pt;border-top:none;border-left:none;border-bottom:solid windowtext 1pt;border-right:solid windowtext 1pt;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">&nbsp;</span></p></td></tr><tr><td width="568" colspan="4" style="width:426.1pt;border:solid windowtext 1pt;border-top:none;padding:0 5.4pt 0 5.4pt"><p class="MsoNormal" align="center" style="text-align:center"><span style="font-size:12pt;font-family:仿宋">备注：如活动中使用物资过多，表格不够，请另附清单！<span></span></span></p></td></tr></tbody></table>` }', 'right': 506.75, 'bottom': 337.5, 'vCenter': 294.25, 'hCenter': 197.25 }, 'printElementType': { 'title': '自定义文本', 'type': 'text' } }], 'paperNumberLeft': 565.5, 'paperNumberTop': 819, 'paperNumberDisabled': true }] }
        var hiprintTemplate = new hiprint.PrintTemplate({
          template: template
        })
        var d = new Date($('#gRealDate').val())
        // var all_pages = []
        var bOptions = {
          'main': {
            'template2': 0,
            'y': d.getFullYear(),
            'm': d.getMonth() + 1,
            'd': d.getDate(),
            'stname': $('#ShenQingSheTuan').val(),
            'hdname': $('#YeWuType').data('FormWidget').currentValue.indexOf('活动申报') == -1 ? $('#WZ_yongtu').val() : $('#HD_name').val(),
            'jysj': '',
            'zrr': $('#WZ_jieyongren').val(),
            'zrrdh': $('#WZ_jyrdh').val(),
            'list': []
          }
        }
        var options = []
        var items = []
        $('#WZ_list').data('FormWidget').dataStore.rowSet.primary.forEach((row) => {
          var t = {
            name: row.WZ_name_TEXT,
            num: row.WZ_shuliang,
            y: 0,
            m: 0,
            d: 0,
            jysj: ''
          }
          var sd = new Date(row.WZ_jieyongshijian_STR.split(' ')[0])
          var ed = new Date(row.WZ_guihuanshijian_STR.split(' ')[0])
          var dayLength = (ed.getTime() - sd.getTime()) / (1000 * 60 * 60 * 24)
          for (var i = 0; i <= dayLength; i++) {
            t.y = sd.getFullYear()
            t.m = sd.getMonth() + 1
            t.d = sd.getDate()
            if (dayLength == 0) t.jysj = `${row.WZ_jieyongshijian} - ${row.WZ_guihuanshijian}`
            else t.jysj = `${t.y}年${t.m}月${t.d}日`
            sd.setDate(sd.getDate() + 1)
            items.push(JSON.parse(JSON.stringify(t)))
          }
        })
        items.sort((a, b) => {
          if (a.y != b.y) return b.y - a.y
          else if (a.m != b.m) return b.m - a.m
          else return b.d - a.d
        })
        // 分成东桌椅、西桌椅，帐篷（没有单子）
        // 东桌椅
        var topt = JSON.parse(JSON.stringify(bOptions))
        var ly = 0
        var lm = 0
        var ld = 0
        topt.main.template2 = 0
        items.forEach((row) => {
          if (row.name.indexOf('东区') == -1) return
          var isZZ = row.name.indexOf('桌') != -1
          var isYZ = row.name.indexOf('椅') != -1
          if (isZZ || isYZ) { // 东区桌椅：奥运场馆物资借用承诺书
            if (ly != row.y || lm != row.m || ld != row.d) {
              // 说明是新的一天
              if (topt.main.list.length != 0) {
                options.push(JSON.parse(JSON.stringify(topt)))
                topt.main.list = []
              }
              ly = row.y, lm = row.m, ld = row.d
              topt.main.jysj = row.jysj
            }
            topt.main.list.push({name: `${row.name}`, num: row.num})
          }
        })
        if (topt.main.list.length != 0) {
          options.push(JSON.parse(JSON.stringify(topt)))
        }
        // //西桌椅
        topt = JSON.parse(JSON.stringify(bOptions))
        ly = lm = ld = 0
        topt.main.template2 = 1
        items.forEach((row) => {
          if (row.name.indexOf('西区') == -1) return
          var isZZ = row.name.indexOf('桌') != -1
          var isYZ = row.name.indexOf('椅') != -1
          if (isZZ || isYZ) { // 东区桌椅：奥运场馆物资借用承诺书
            if (ly != row.y || lm != row.m || ld != row.d) {
              // 说明是新的一天
              if (topt.main.list.length != 0) {
                options.push(JSON.parse(JSON.stringify(topt)))
                topt.main.list = []
              }
              ly = row.y, lm = row.m, ld = row.d
              topt.main.jysj = row.jysj
            }
            topt.main.list.push({name: `${row.name}`, num: row.num})
          }
        })
        if (topt.main.list.length != 0) {
          options.push(JSON.parse(JSON.stringify(topt)))
        }

        if (options.length == 0) {
          alert('没有要打印的项目!')
          return
        }
        //console.log(options)
        hiprintTemplate.print(options)
      }
      printBtn.click(function () {
        printFunc()
      })
      printBtn.insertAfter($('#WZ_list').parent().find('.swiper-container-btn'))
      printDateBtn.insertAfter(printBtn)
    })();
    // 功能：打印公三就业场地申请单
    (function (){
      hiprint.init()
        //console.log(GM_getResourceText("jiuyeTemplate"))
          var hiprintTemplate = new hiprint.PrintTemplate({
            template: JSON.parse(GM_getResourceText("jiuyeTemplate"))
          })
      // let printBtn = $(`<div class="link_btn_bar swiper-container-btn swiper-container-horizontal swiper-container-free-mode" style="width: auto;margin-left:1rem;"><div class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px);"><a href="javascript:;" class="link_btn swiper-slide swiper-slide-active"><i class="fa fa-print"></i>打印</a></div></div>`)
      // let printDateBtn = $(`<div class="link_btn_bar swiper-container-btn swiper-container-horizontal swiper-container-free-mode" style="width: auto;margin-left:1rem;" onclick="WdatePicker({dateFmt:'落款日期：yyyy年M月d日',vel:'gRealDate'})"><div class="swiper-wrapper" style="transform: translate3d(0px, 0px, 0px);"><a href="javascript:;" class="link_btn swiper-slide swiper-slide-active">落款日期：${new Date().format('yyyy年M月d日')}</a></div></div><input type="hidden" id="gRealDate" value="${new Date().format('yyyy-MM-dd')}"/>`)
      $('#CD').data('FormWidget').element.find('[node]').map((_, $node) => {
        var cdtype = $('[column=CD_type]', $node).val()
        if (cdtype.indexOf('就业') == -1) return //就业场地的关键词是就业
        var printBtn = $(`<button class="btn btn-primary push-right-5 center-btn" type="button" name="ext_CD_btn"
                              style="display:block;margin-left:10rem;height:28px;line-height:18px;">
                              <i class="fa fa-print push-right-5"></i>打印申请表</button>`);
        let printFunc = function () {

          var t1 = new Date($('[column=CD_shijian_start]', $node).val())
          var t2 = new Date($('[column=CD_shijian_end]', $node).val())
          if(t1.getDate()!=t2.getDate()){
            alert("出现跨天借用，请修改！")
            return
          }
          var hdmc = $('[column=CD_huodongneirong]', $node).val()
          hdmc = hdmc == "同上" ? "社团活动" : hdmc
          hdmc = hdmc.length > 12 ? hdmc.substring(0,12)+"..." : hdmc
          var options = {
            year: t1.getFullYear(),
            month:t1.getMonth()+1,
            day:t1.getDate(),
            time_start:`${twoDigitDateFormat(t1.getHours())}:${twoDigitDateFormat(t1.getMinutes())}`,
            time_end:`${twoDigitDateFormat(t2.getHours())}:${twoDigitDateFormat(t2.getMinutes())}`,
            hdmc:`${$('#ShenQingSheTuan').val()}${hdmc}`,
            jycd:$('[column=CD_type]', $node).val(),
            sqr: $('[column=CD_zrr]', $node).val(),
            lxdh: $('[column=CD_zrrdh]', $node).val(),
            xq:"日一二三四五六".split("")[t1.getDay()],
            hour_start:twoDigitDateFormat(t1.getHours()),
            hour_end:twoDigitDateFormat(t2.getHours()),
            minute_start:twoDigitDateFormat(t1.getMinutes()),
            minute_end:twoDigitDateFormat(t2.getMinutes()),
          }
          hiprintTemplate.print(options)
        }
        printBtn.click(function () {
          printFunc()
        })
        $('div:first div', $node).append(printBtn)
      });
    })()
  }


  //计算两个日期之前相差几个整周
  function getDifferWeeksBetweenTwoDates(str1, str2) {
    //1.转换为date对象
    let date1 = new Date(str1);
    let date2 = new Date(str2);
    //2.由星期推算出该日所在周的星期一与该日相差天数
    let diffDaysToMon1 = date1.getDay() - 1;
    let diffDaysToMon2 = date2.getDay() - 1;
    if(diffDaysToMon1 < 0){
        diffDaysToMon1 = 6;
    }
    if(diffDaysToMon2 < 0){
        diffDaysToMon2 = 6;
    }
    let time1 = date1.getTime();
    let time2 = date2.getTime();
    let diffDays =  parseInt((time1 - time2) / 1000 / 60 / 60 / 24);
    let referMonDiffDays = (time1 >= time2 ?  1 : -1) * (diffDays - diffDaysToMon1 + diffDaysToMon2);
    //4.计算相差周数
    let diffWeeks =referMonDiffDays / 7;
    return diffWeeks+1;
  }

  //一个好看的弹窗
  let BePrompt = {
    defaultConfig: {
      type: 'date',
      Desc: '',
      length: 5
    },
    Html: `<style id="PromptStyle">
                .Prompt {
                    position: fixed;
                    top: 10%;
                    right: 100px;
                    /*right:0px;*/
                    width: 500px;
                    background: #fff;
                    z-index: 9991;
                    opacity: 0;
                }

                .Prompt .PromptTitle {
                    height: 46px;
                    text-align: center;
                    background: #00873b;
                    position: relative;
                    color: #fff;
                    line-height: 46px;
                    font-size: 18px;
                }

                .Prompt .PromptName {
                    font-weight: bold;
                    font-style: normal;
                }

                .Prompt .PromptCancel {
                    position: absolute;
                    height: 46px;
                    line-height: 46px;
                    margin-left: 10px;
                    width: 50px;
                    text-align: left;
                }

                .Prompt .PromptConfirm {
                    display: block;
                    position: absolute;
                    height: 46px;
                    line-height: 46px;
                    right: 0px;
                    width: 50px;
                    margin-left: -50px;
                    text-align: left;
                }

                .Prompt .PromptList {
                    margin: 20px;
                    position: relative
                }

                .Prompt input {
                    background: #efefef !important;
                    width: 100%;
                    border: 0px none !important;
                    font-size: 16px;
                    line-height: 30px;
                    padding: 5px !important;
                }
            </style>
            <div class="Prompt"><div class="PromptTitle"><div class="PromptCancel">取消</div><div class="PromptConfirm">完成</div><em class="PromptName"></em></div><div class="PromptList"></div></div>`,
    open: function (message, defaultText, callback, o) {
      var opts = {}, that = this
      $.extend(opts, this.defaultConfig, o)
      $('body').append(this.Html)
      message && $('.PromptName').html(message).show()
      var PromptList = $('.PromptList')

      if (opts.type == 'date') {
        PromptList.append('<input id="PromptText" name="PromptText" type="' + opts.type + '" autocomplete="off" required="required" placeholder="请输入' + message + '" value="' + defaultText + '" />')
      }

      $('.Prompt').animate({ 'top': '10%', 'opacity': '1' }, 200)

      $('.PromptConfirm').bind('click',
        function () {
          if (typeof callback === 'function') callback(true, $('#PromptText').val()) && that.close()
          else that.close()
        })

      $('.PromptCancel').bind('click',
        function () {
          that.close()
          typeof callback === 'function' && callback(false)
        })
    },
    close: function () {
      $('.Prompt').animate({ 'top': '100%', 'opacity': '0' }, 300, function () {
        $('.Prompt').remove()
        $('#PromptStyle').remove()
      })
    }
  }

  //设置学期第一周周一的日期
  function setZc () {
    BePrompt.open('请选择本学期第1周周一', GM_getValue('zcStart', new Date().format('yyyy-MM-dd')), function (st, val) {
      if (!st) return true
      var _val = val.replace(/-/g, '/')
      if (!_val || new Date(_val).getDay() != 1) {
        alert('日期格式错误，或选择的日期不是星期一！')
        return false
      }
      GM_setValue('zcStart', val)
      //console.log(typeof val)
      unsafeWindow.location.reload()
      return true
    })
  }

  //计算当前日期是第几周
  function getZc (target) {
    var start = GM_getValue('zcStart', null)
    if (!start) setZc()
    // var x = (new Date(target.replace(/-/g, '/')) - new Date(start.replace(/-/g, '/'))) / 3600000 / 24 / 7
    // console.log(x)
    var x = getDifferWeeksBetweenTwoDates(start, target)
    // if (x >= 0) x = Math.ceil(x)
    // else x = -1
    // console.log(x)
    return x
  }

  //newjw.cau.edu.cn教务系统|接收同步的教室借用信息
  function jsJyHook () {
    if (document.title.indexOf('登录') != -1) return // 由于未登录，进入登录页，不进行hook
    // 设置学期开始事件的按钮
    var setZcBtn = $(`<div style="float: left;margin: 10px;">
                            <input type="button" value="设置学期开始时间，当前${GM_getValue('zcStart', '未设置')}" class="edu-btn" style="">
                          </div>`)
    setZcBtn.click(() => setZc())
    $('[name=Form1]').append(setZcBtn) // 添加设置学期开始时间的按钮
    // 选择借用时间的框架页加载完毕后，开始hook
    // $("#fcenter").on("load", function () {
    var $$ = $('#fcenter')[0].contentWindow // 内部框架的window对象

    // 艹了这个傻逼暂存函数，太tm傻逼了
    // 暂存：将借用信息提交进入待提交列表
    $$.zancun = function () {
      // 傻逼系统不在系统上做判断，借用原因超过16字会报错白屏
      // console.log(window)
      if (getTrueLength($$.parent.document.getElementById('jyyy').value) > 32) {
        alert('借用原因不能超过16字！')
        return
      }
      // 这是原来的自带的代码，获取参数的，防止出错，不修改
      var param = ''
      $('#userid').val($$.parent.document.getElementById('userid').value)
      param += '?lxdh=' + $$.parent.document.getElementById('lxdh').value
      param += '&cjrs=' + $$.parent.document.getElementById('cjrs').value
      param += '&xx0103=' + $$.parent.document.getElementById('xx0103').value
      param += '&jslx=' + $$.parent.document.getElementById('jslx').value
      param += '&jylx=' + $$.parent.document.getElementById('jylx').value
      param += '&jyyy=' + $$.parent.document.getElementById('jyyy').value
      param += '&xnxq01id=' + $$.parent.document.getElementById('xnxq01id').value
      var sfdmt = $$.parent.document.getElementsByName('sfdmt')
      var val = ''
      for (var i = 0; i < sfdmt.length; i++) {
        if (sfdmt[i].checked) {
          val = sfdmt[i].value
        }
      }
      param += '&sfdmt=' + val
      // 将原来使用另一个框架页提交，修改为使用ajax提交
      // console.log(param)
      // console.log($$.Form1)
      $.post(
        '/jsxsd/jsjyGl/saveJsjyData' + param,
        $($$.Form1).serialize(),
        function (data, status, xhr) {
          // 返回的data是一个script弹窗代码，解析出里面的message直接执行就行了
          // 但是不能用eval直接执行，里面有时候还有流氓跳转代码
          //console.log(data, status, xhr)
          if (status == 'success') {
            var msg = data.match(/\(('|")(.*)('|")\)/)[2]
            alert(msg)
            unsafeWindow.location.reload()
            // if(msg.indexOf("成功")==-1)
            //     unsafeWindow.location.reload()
            // else
            //     unsafeWindow.location.search = ""
          }
        }
      )
    }
    // 又一个傻逼函数，真是傻逼他妈给傻逼开门，傻逼到家了
    $$.doSend = function () {
      var xnxq01id = $$.parent.document.getElementById('xnxq01id').value
      var param = ''
      param += '?lxdh=' + $$.lxdh
      param += '&cjrs=' + $$.cjrs
      param += '&xx0103=' + $$.xx0103
      param += '&jslx=' + $$.jslx
      param += '&jylx=' + $$.jylx
      param += '&sfdmt=' + $$.sfdmt
      param += '&xnxq01id=' + xnxq01id
      console.log(param)
      // window.Form1.action="/jsxsd/jsjyGl/saveJsjy"+param;
      // window.Form1.target="hideframe";
      // window.Form1.submit();
      // window.Form1.target="";
      // window.Form1.action="";
      $.post(
        '/jsxsd/jsjyGl/saveJsjy' + param,
        $($$.Form1).serialize(),
        function (data, status, xhr) {
          console.log(data, status, xhr)
          if (status == 'success') {
            var msg = data.match(/\('(.*)'\)/)[1]
            alert(msg)
            // unsafeWindow.location.reload()
            if (msg.indexOf('成功') == -1) { unsafeWindow.location.reload() } else { unsafeWindow.location.search = '' }
          }
        }
      )
    }
    // })
    if (unsafeWindow.location.search.length > 1) {
      if (!GM_getValue('zcStart', null)) {
        alert('由于未设置学期开始时间，无法自动同步，请在设置完成后刷新页面重试')
        setZc()
        return
      }

      var bdata = uriToJSON(window.location.search.substring(1))
      console.log('接收到', bdata)
      $('#lxdh').val(bdata.lxdh)
      $('#cjrs').val(bdata.cjrs)
      $('#xx0103').val(bdata.xq)
      $('#jslx').val('05')
      $('#jylx').val('03')
      $('#jylx').change()
      $('#jyyy').val(bdata.yy)
      var zc = getZc(bdata.rq)
      // $("#fcenter").on("load", function () {
      setTimeout(function () {
        var $$ = $('#fcenter')[0].contentWindow
        if (zc <= 0 || zc > $('#fcenter')[0].contentWindow.$('.td_pass,.td_goon').length) {
          alert('学期开始时间设置有误，同步数据失败，请重新设置学期开始时间')
          // GM_setValue("zcStart", null)
          return
        }
        //console.log('执行')
        $$.zcclick($$.$('.td_pass,.td_goon')[zc - 1])
        //console.log('执行')
        var xq = new Date(bdata.rq.replace(/-/g, '/')).getDay()
        xq = xq == 0 ? 7 : xq
        var sj = bdata.sj
        //==========
        //由于教务系统奇葩的bug，课表内外时间不能重合，否则无法提交成功。因此当课表内外时间发生冲突时，将不提交中午的借用数据
        var hasSw = sj.includes("01") || sj.includes("02") || sj.includes("03") || sj.includes("04")
        var hasXw = sj.includes("05") || sj.includes("06") || sj.includes("07") || sj.includes("08")
        var hasWs = sj.includes("09") || sj.includes("10") || sj.includes("11") || sj.includes("12")
        var beforeZw = hasSw
        var afterZw = hasXw||hasWs
        var beforeWs = hasSw || hasXw
        var afterWs = hasWs
        if(sj.includes("zw") &&beforeZw&&afterZw){
          alert("同步插件提示：因教务系统bug，当课表内时间与课表外时间存在冲突时，将无法提交教室借用申请，即将将自动删除课表外时间（中午节次）")
          //sj.remove(sj.indexOf("zw"))
          sj = sj.filter(item => item !== "zw");
        }
        if(sj.includes("ws") &&beforeWs&&afterWs){
          alert("同步插件提示：因教务系统bug，当课表内时间与课表外时间存在冲突时，将无法提交教室借用申请，即将将自动删除课表外时间（晚上时间段）")
          //sj.remove(sj.indexOf("ws"))
          sj = sj.filter(item => item !== "ws");
        }
        //==========
        $$.isCtrl = true
        for (var i = 0; i < sj.length; i++) {
          if (sj[i] != 'ws' && sj[i] != 'zw') $$.jcclick($$.$(`#${xq}${sj[i]}`)[0])
          else {
            $$.otherJcSj($$.$(`#${xq}${sj[i]}`)[0])
            $$.$(`#${xq}${sj[i]}_sj`).val(sj[i] == 'zw' ? '12:10-13:40' : '18:10-18:50')
            $$.$(`#${xq}${sj[i]}`)[0].innerHTML = sj[i] == 'zw' ? '12:10-13:40' : '18:10-18:50'
          }
        }
        $$.isCtrl = false
      }, 1000)
    }
  }

  //网上办事大厅-1803学生社团综合业务|服务运行监控-服务填报查询页面优化
  function oneHallQueryHook () {
    if (unsafeWindow.location.href.indexOf('id=e186a9b4-ed42-496b-84fe-fa2cf0392adb') == -1) return
    setTimeout(() => {
      $('input.queryItem[name=业务类型]').iCheck('check') // 展示业务类型查询选项卡
      $('input.queryItem[name=业务编号]').iCheck('check')

      // 申请社团部分，由于一些莫名其妙的操作，需要特殊处理一下
      $('input.queryItem[value=ShenQingSheTuan]').iCheck('check')
      $('#query_item_ShenQingSheTuan').hide()
      // 先获取到所有的学生社团信息
      var resultDataOption
      $.ajax({
        url: 'https://onehall.cau.edu.cn/tp_fp/formParser?status=preset',
        async: false,
        dataType: 'json',
        type: 'post',
        data: {
          formid: 'ee235148-a501-4689-9b6a-24301a4c',
          presetbind: '34462322099322880',
          presetbindtext: '学生社团下拉框'
        },
        success: function (result) {
          resultDataOption = result; //console.log(result)
        }
      })
      $(`<div class="form-group col-md-12" id="" style=""><span class="sameRow-label text-right sameRow-width-100">申请社团：</span><select id="sqstselect"><option value="">请选择</option></select></div>`).insertAfter($('#query_item_ShenQingSheTuan'))
      var sd = $('#sqstselect')
      sd.change(function () {
        $('input[name=ShenQingSheTuan]:checked').val(sd.val())
      })
      resultDataOption.forEach((v, k) => {
        // console.log(v,k)
        $(`<option value="${v.VALUE}">${v.NAME}</option>`).appendTo(sd)
      })

      // 处理查看按钮 让其在新标签页中打开
      fp.dataquery.viewServiceApply = function (procinst_id) {
        unsafeWindow.open(unsafeWindow.location.origin + unsafeWindow.location.pathname + unsafeWindow.location.search + '#procinst_id=' + procinst_id + '&temp_id=' + fp.dataquery.service_id + '&act=fp/myserviceapply/view')
        // Util.setHash();
      }
    }, 1000)
  }

  //定时器，等待页面全部加载完后开始识别并处理页面
  let hook = function () {
    if (unsafeWindow.location.origin.indexOf('newjw') != -1) jsJyHook()
    else if (unsafeWindow.location.href.indexOf('formParser') != -1) oneHallHook()
    else if (unsafeWindow.location.href.indexOf('fp/svsdataquery') != -1) oneHallQueryHook()
    console.log(unsafeWindow.location.href)
  }
  // unsafeWindow.onload = hook
  setTimeout(hook, 5000)
  // unsafeWindow.onurlchange = hook
  // unsafeWindow.onhashchange = hook

  if (unsafeWindow.location.href.indexOf('formParser') != -1) {
    // 加载打印相关的脚本资源
    let script0 = document.createElement('script')
    script0.setAttribute('type', 'text/javascript')
    //script.src = 'https://cdn.jsdelivr.net/gh/CannonFotter/hiprint@master/hiprint/hiprint.bundle.js'
    script0.src = 'https://static.drlchys.xyz/cau/onehall/socket.io.min.js'
      //CcSimple/vue-plugin-hiprint
    document.documentElement.appendChild(script0)

    let script = document.createElement('script')
    //script.src = 'https://cdn.jsdelivr.net/gh/CannonFotter/hiprint@master/hiprint/hiprint.bundle.js'
    script.src = 'https://static.drlchys.xyz/cau/onehall/vue-plugin-hiprint.js'
    script.onload = function(){
        unsafeWindow.autoConnect = false //关闭控制台烦人的错误
    }
      //CcSimple/vue-plugin-hiprint
    document.documentElement.appendChild(script)
    let script2 = document.createElement('script')
    script2.setAttribute('type', 'text/javascript')
    //script2.src = 'https://cdn.jsdelivr.net/gh/CannonFotter/hiprint@master/hiprint/plugins/jquery.hiwprint.js'
    script2.src = 'https://static.drlchys.xyz/cau/onehall/jquery.hiwprint.js'
    document.documentElement.appendChild(script2)
    let link = document.createElement('link')
    link.setAttribute('rel', 'stylesheet')
    link.setAttribute('type', 'text/css')
    //link.href = 'https://cdn.jsdelivr.net/gh/CannonFotter/hiprint@master/hiprint/css/hiprint.css'
    link.href = 'https://static.drlchys.xyz/cau/onehall/hiprint.css'
    document.documentElement.appendChild(link)
    let link2 = document.createElement('link')
    link2.setAttribute('rel', 'stylesheet')
    link2.setAttribute('type', 'text/css')
    link2.setAttribute('media', 'print')
    //link2.href = 'https://cdn.jsdelivr.net/gh/CannonFotter/hiprint@master/hiprint/css/print-lock.css'
    link2.href = 'https://static.drlchys.xyz/cau/onehall/print-lock.css'
    document.documentElement.appendChild(link2)

  }
})()
