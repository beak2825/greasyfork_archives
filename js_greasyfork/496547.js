// ==UserScript==
// @name         吾爱导航清理
// @namespace    https://greasyfork.org/zh-CN/scripts/496547-%E5%90%BE%E7%88%B1%E5%AF%BC%E8%88%AA%E6%B8%85%E7%90%86
// @version      1.0.4
// @description  吾爱导航栏清理
// @author       冰冻大西瓜
// @match        https://www.52pojie.cn/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        GM_addStyle
// @run-at       document-start
// @license      GPLv3
// @note         屏蔽了新手报到、门户、搜索、家园、排行榜的导航
// @note         2024年4月17日 设置了论坛字体为圆体-简
// @note         2024年4月17日 因字体改变,修正了导航栏的ul宽度
// @note         2024年4月17日 因字体改变,修正了导航栏的li宽度
// @note         2024年4月17日 因字体改变,修正了弹窗样式
// @note         2024年4月18日 修复了备注的弹窗样式不显示input框的问题
// @downloadURL https://update.greasyfork.org/scripts/496547/%E5%90%BE%E7%88%B1%E5%AF%BC%E8%88%AA%E6%B8%85%E7%90%86.user.js
// @updateURL https://update.greasyfork.org/scripts/496547/%E5%90%BE%E7%88%B1%E5%AF%BC%E8%88%AA%E6%B8%85%E7%90%86.meta.js
// ==/UserScript==

// eslint-disable-next-line no-undef
GM_addStyle(`
#mn_N9390,#mn_portal,#mn_Ne008,#mn_home_4,#mn_N12a7,#mn_N05be,#mn_Na678,#mn_forum_11{
  display:none!important;
}
body, input, button, select, textarea {
  font:14px 圆体-简!important;
  line-height:1.5!important;
}
.comiis_nav ul{
  width:250px!important;
  display:flex;
  flex-wrap:wrap;
  flex-direction:column;
}
.comiis_nav ul li{
  width:80px!important;
}

.fwinmask .fwin>tbody>tr:nth-child(odd){
  display:none;
}
.fwinmask tbody .m_l,.fwinmask tbody .m_r{
  display:none;
}
.m_c{
  border: 6px solid #2b7acdbd;
  border-radius: 5px;
}
.m_c .c{
  text-wrap:nowrap;
}
`)
