// ==UserScript==
// @name         贝壳网批量重置学生的密码
// @namespace    冰客小子
// @version      1.0
// @description  用于帮助系统管理员重置贝壳网学生的密码
// @author       冰客小子
// @match        https://zone.bakclass.com/quality/checkStudentInfoSchool
// @icon         https://blog.gocos.cn/wp-content/uploads/2021/07/2021-07-2782.ico
// @connect      api.gocos.cn
// @run-at       document-end
// @grant        unsafeWindow
// @license      MIT
// @require      http://libs.baidu.com/jquery/2.0.0/jquery.min.js
// @require      https://greasyfork.org/scripts/423313-utils%E7%8E%AF%E5%A2%83/code/Utils%E7%8E%AF%E5%A2%83.js?version=911306
// @downloadURL https://update.greasyfork.org/scripts/446522/%E8%B4%9D%E5%A3%B3%E7%BD%91%E6%89%B9%E9%87%8F%E9%87%8D%E7%BD%AE%E5%AD%A6%E7%94%9F%E7%9A%84%E5%AF%86%E7%A0%81.user.js
// @updateURL https://update.greasyfork.org/scripts/446522/%E8%B4%9D%E5%A3%B3%E7%BD%91%E6%89%B9%E9%87%8F%E9%87%8D%E7%BD%AE%E5%AD%A6%E7%94%9F%E7%9A%84%E5%AF%86%E7%A0%81.meta.js
// ==/UserScript==

var _self = unsafeWindow,
    studentlist=[],
    $ = _self.jQuery || top.jQuery;
const $X = new Utils("贝壳网");
    

( function() {
  // 创建批量按键
  const restPassword=()=>{
    var but = document.createElement("button");
    but.innerHTML = "批量重置密码（自用）";
    //为div创建属性class = "test"
    var divattr = document.createAttribute("class");
    divattr.value = "buttres";
    //把属性class = "test"添加到div
    but.setAttributeNode(divattr);
    var style = document.createAttribute("style");
    but.setAttributeNode(style);
    but.style.backgroundColor = "#d24710";
    but.style.color = "#fff";
    but.style.textAlign = "center";
    // but.style.width = "80px";
    but.style.borderColor = "#000";
    but.style.marginLeft = "0%";
    but.style.marginTop = "1%";
    document.querySelector(".other-btn2").appendChild(but);
    $(".buttres").click(() => {
      start();
    });
  };
  restPassword();
})();

async function start(){
  const next =getStudentInfoList();
      // console.log('晶',studentlist);
  await $X.wait(500);
  let t=document.getElementsByClassName("cx-main")[0].innerHTML;
  let number=1; // 人数统计
  for(let i =0; i<studentlist.length;i++){
    for (let j=0;j<studentlist[i].length;j++){
      document.getElementsByClassName("cx-main")[0].innerHTML=t+
    '正在进行重置中，由于非官方操作完全模拟人工完成，不要刷新页面...'+(number)+'人';
      number++;
      await $X.wait(50);
    let id=studentlist[i][j].user_id;
    let msgg=restPost(id,t);
    await $X.wait(50);
    };
  };
};
// 直接点击返回
function getStudentInfoList(number=50,pageno=1){
  // await $X.wait(500);
  classid=document.getElementById("commonUserSchoolId").value;
  $.ajax({
    url: 'https://zone.bakclass.com/quality/getStudentInfoList',
    type: 'POST',
    data: {
      'pageSize': number,// 每一页的数量
      'pageNo': pageno,
      'year': '',
      'term_id': '',
      'class_id': -1,
      'grade_id': '',
      'school_id': classid,
      'query': '',
      'province_id': '',
      'city_id': '',
      'district_id': '',
      'section_id':''
    },
    async: false,
    success: function (res) {
      let data=JSON.parse(res);
      let total=100;//data.total;// 总学生数
      let student=data.statistics_list;// 每一页的学生信息
      let page=Math.ceil(total/number); //总页数
      studentlist.push(student);
      for (let i =pageno+1; i<=page;i++){
        let studentlists=getStudentInfoList(number,i);
      }
      return 00;
    },
    error: function (err) {
    }
});
}

function restPost(user_id,t){
  $.ajax({
    url: 'https://zone.bakclass.com/quality/updateResetPassword',
    type: 'POST',
    data: {'user_id': user_id},
    async: false,
    success: function (res) {
      let data=JSON.parse(res);
      let msg=data.responseStatus.msg;
      console.log('晶',msg);
      document.getElementsByClassName("cx-main")[0].innerHTML=t+
    '正在进行重置中，由于非官方操作完全模拟人工完成，不要刷新页面...结果----》'+msg;
      return msg;
    },
    error: function (err) {
      return '-0';
    }
});
}
