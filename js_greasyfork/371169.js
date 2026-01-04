// ==UserScript==
// @name 豆瓣小组|一键删帖
// @namespace https://github.com/DragonCat1
// @description 豆瓣小组一键删帖
// @author 铛铛铛铛铛/https://www.douban.com/people/48915223
// @copyright 1991-2018,铛铛铛铛铛-Dragoncat
// @match *://www.douban.com/group/topic/*
// @grant none
// @version 0.0.1.20180814111040
// @downloadURL https://update.greasyfork.org/scripts/371169/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%7C%E4%B8%80%E9%94%AE%E5%88%A0%E5%B8%96.user.js
// @updateURL https://update.greasyfork.org/scripts/371169/%E8%B1%86%E7%93%A3%E5%B0%8F%E7%BB%84%7C%E4%B8%80%E9%94%AE%E5%88%A0%E5%B8%96.meta.js
// ==/UserScript==

(function(){
  const $delLinks = $('.lnk-delete-comment')
  $delLinks.click(function(e){
    e.stopImmediatePropagation()
    const tid = location.href.match(/topic\/(\d+)\//)[1]
    const cid = $(this).data('cid')
    const ck = $('[name=ck]').val()
    $.post(`https://www.douban.com/group/topic/${tid}/remove_comment?cid=${cid}`,{
        ck,
        cid,
        reason: 0,
        other: '',
        submit: '确定'
    },function(rsp){
        console.log(rsp)
    })
    $('#'+cid).remove()
  })
})()