// ==UserScript==
// @name         CMCT-SSD-PT-givebonus 批量 自定义赠送魔力
// @name:zh-CN   CMCT-SSD-PT-批量 自定义赠送魔力
// @name:zh-TW   CMCT-SSD-PT-批量 自定義贈送魔力
// @namespace    https://greasyfork.org/zh-CN/scripts/448613
// @version      0.14
// @description:zh-cn  cmct SSD 触摸春天PT自定义散魔 赠送魔力值
// @description:zh-tw  cmct SSD 觸摸春天PT自定義散魔 贈送魔力值
// @description  cmct SSD 触摸春天PT自定义散魔 赠送魔力值 
// @author       Liferunnerjun
// @match        https://springsunday.net/details.php?*
// @match        https://springsunday.net/forums.php?*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/448613/CMCT-SSD-PT-givebonus%20%E6%89%B9%E9%87%8F%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%B5%A0%E9%80%81%E9%AD%94%E5%8A%9B.user.js
// @updateURL https://update.greasyfork.org/scripts/448613/CMCT-SSD-PT-givebonus%20%E6%89%B9%E9%87%8F%20%E8%87%AA%E5%AE%9A%E4%B9%89%E8%B5%A0%E9%80%81%E9%AD%94%E5%8A%9B.meta.js
// ==/UserScript==

(function() {
  //CMCT-论坛自定义散魔start
//按钮位置
let butt = document.querySelectorAll('.main tr .rowhead')
//获取用户ID
let uname = document.querySelectorAll('.medium')
let userid = uname[0].children[0].innerText
//用户回复楼元素获取
let selfuname = document.querySelectorAll('.embedded')
for (let i = 0; i < butt.length; i++) {
	butt[i].innerHTML = `
<td class="rowhead nowrap" valign="top" align="right">赠送魔力值</td>
<input class="sentip" style="margin-top: 5px; width: 50px;" type="text" value="">
<input class="sentsu" style="margin-top: 5px; width: 50px;" type="button" value="赠送"disabled>
`
let ids = (butt[i].nextElementSibling.children)
//let id = ids[0].id
//获取赠送ID
let id = ids[0].id.substring(9)
//赠送魔力元素
let bous = butt[i].children
let bousput = bous[0]
let boussub = bous[1]
boussub.style.color = 'blue'
//获取回复楼层用户ID
let funame = selfuname[2 * i + 5].children
let fidt = funame[2].innerText
let fidts = fidt.indexOf(' ')
let fid = fidt.substring(0, fidts)
//点击按钮定义
bousput.addEventListener('input', function(){
    boussub.disabled = false
})
boussub.addEventListener('click', function(){
   //console.log(id)
   let bousnum = +bousput.value
   if (isNaN(bousnum)) {
       alert('请重新输入赠送魔力数')
   }else {
       givebonus_post(id, bousnum, `确定赠送${bousnum}点魔力值吗`)
       boussub.disabled = true
       bousput.disabled = true
       boussub.value = '已赠'
       boussub.style.color = 'red'
   }
})
//一键散魔start
if (i === butt.length - 1){
 let idiv = document.createElement('div')
 let bsall = selfuname[3].appendChild(idiv)
 bsall.innerHTML = `
 <input class="sentipt" style="margin-top: 5px; width: 80px;" type="text" value=" ">
 <input class="sentsub" style="margin-top: 5px; width: 150px;" type="button" value="前面输入所有楼层赠送值" disabled>
 <input class="sbonek" style="margin-top: 5px; width: 165px;" type="button" value="前面输入为随机赠送最大值" disabled>
 `
 let sentipt = bsall.children[0]
 let sentsub = bsall.children[1]
 let sbonek = bsall.children[2]
 sentipt.addEventListener('input', function(){
      sentsub.value = '一键赠送相同魔力'
      sbonek.value = '一键随机赠送魔力'
      sentsub.disabled = false
      sbonek.disabled = false
 })
 sentsub.addEventListener('click',function(){
     if (isNaN(+sentipt.value)) {
     alert('请重新输入赠送魔力数')
   }else {
    let numsent = +sentipt.value
for (let k = 0; k < butt.length; k++ ) {
  butt[k].children[0].value = numsent
  butt[k].children[1].disabled = false
  }
  //if (confirm(`你确定为本页面的每层楼送出${numsent}点魔力值？`))
     for (let p = 0; p < butt.length; p++) {
      butt[p].children[1].click()
         sbonek.disabled = true
         sbonek.value = '已完成一键赠送'
         
     }
     
       }
 } )
 //随机一键赠送
 sbonek.addEventListener('click',function(){
  if (isNaN(+sentipt.value)) {
    alert('请重新输入赠送魔力数')
  }else {
//if (confirm(`你确定为本页面的每层楼送出${numsent}点魔力值？`))
      let maxnum = +sentipt.value
 for (let g = 0; g < butt.length; g++ ) {
  let bousrandom = Math.floor((Math.random()*maxnum)+1)
  butt[g].children[0].value = bousrandom
  butt[g].children[1].disabled = false
}
for (let p = 0; p < butt.length; p++) {
  butt[p].children[1].click()
  sentsub.disabled = true
  sentsub.value = '已完成一键赠送'
}
  
  }
 } )
}
//一键散魔end
//检测若已增送或为自己楼层不可赠送
for (let j = 0; j < ids.length; j++) {
if (ids[j].innerText === userid || fid === userid){
  boussub.disabled = true
  bousput.disabled = true
  boussub.style.color = 'red'
  boussub.value = '禁止'
  bousput.value = userid
  }
}
}
//CMCT-论坛自定义散魔end
//**********分割线***************//
//种子界面送魔力start
//定义按钮位置
let bonusbutton = document.querySelector('.outer table tr .rowfollow #bonusbutton')
//创建span标签按钮
let input = document.createElement('span')
bonusbutton.appendChild(input)
input.innerHTML = `
<input class="torrentput" style="margin-top: 5px; width: 50px;" type="text" value="">
<input class="torrentsub" style="margin-top: 5px; width: 50px; color: blue;" type="button" value="赠送"disabled>
`
//获取种子ID
let torrenthref = document.querySelector('.index')
let ttid = torrenthref.href.substring(torrenthref.href.indexOf('=') + 1)
let torrentput = document.querySelector('.torrentput')
let torrentsub = document.querySelector('.torrentsub')
torrentput.addEventListener('input', function(){
    torrentsub.disabled = false
})
torrentsub.addEventListener('click', function(){
	let bonusnum = +torrentput.value
	if (isNaN(bonusnum)) {
     alert('请重新输入赠送魔力数')
   }else {
	givebonus(ttid, bonusnum, `你确定赠送${bonusnum}个魔力值吗？`)
	saythanks(ttid)
	}
})
//种子界面送魔力end

//取自CMCT官方魔力函数
function givebonus_post(postid, bonus, confirmtxt) {
        $.post("bonus.php", { "id": postid, "bonus": bonus, "type": "post" }, function () {
        $("#bonusbutton" + postid).hide();
        $("#nobonus" + postid).hide();
        var mynameSpan = $('#myname' + postid);
        var nameHTML = mynameSpan.html().trim() + "(" + bonus + ") ";
        mynameSpan.html(nameHTML);
        mynameSpan.css('display', 'inline');
        $('#bonustips' + postid).hide();
        $('#bonussum' + postid).text(Number($('#bonussum' + postid).text()) + bonus);
        });

}
function givebonus(torrentid, bonus, confirmtxt) {
        $.post("bonus.php", { "id": torrentid, "bonus": bonus }, function () {
        document.getElementById("bonusbutton").innerHTML = document.getElementById("bonusgiven").innerHTML;
        document.getElementById("nobonus").innerHTML = document.getElementById("myname").innerHTML;
        });

}


    // Your code here...
})();