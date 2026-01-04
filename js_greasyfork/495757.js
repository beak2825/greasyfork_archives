// ==UserScript==
// @name        建E网黑名单
// @namespace   Violentmonkey Scripts
// @match       https://3d.justeasy.cn/3dmodels/search*
// @match       https://club.justeasy.cn/designer/work/*
// @grant       none
// @version     0.0.6
// @author      YeSilin
// @license     GPL-3.0-or-later
// @icon        data:image/x-icon;base64,AAABAAEAMDAAAAEAIACoJQAAFgAAACgAAAAwAAAAYAAAAAEAIAAAAAAAACQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM3f/DyV4/1kmd/+nJnf/0iZ3/+sld//+JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld//wJnj/1yV4/7MneP9oKXr/GQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACuA/wwmeP9/Jnj/8yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//CZ4/5kpev8ZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKXr/MiV4/+Ild///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8meP/zJXn/UgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAnef9OJXf/9iV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//id5/3YAAAAAAAAAAAAAAAAAAAAAAAAAACh4/zMld//2JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8od/9aAAAAAAAAAAAAAAAAK4D/DCV3/+Mld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///KHn//2+l//+hxP//X5v//yh5//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8leP/3JXz/KQAAAAAAAAAAJnn/gSV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//zJ///+Jtf//5u///////////////////+30//+pyf//YZz//yh5//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXj/sQAAAAAwgP8QJnf/9CV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//9Eiv//o8X///X5/////////////////////////////////////////////+/1//+sy///ZJ7//yl5//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yZ4/zUneP9bJXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///XZr//77W///+/v////////////////////////////////////////////////////////////////////////H2//+uzP//ZZ///yp6//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yd3/4smd/+pJXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///Knr//3eq///X5v////////////////////////////////////////////////////////////////////////////////////////////////////////P3//+xzv//aKH//yt7//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yZ4/9kleP/TJXf//yV3//8ld///JXf//yV3//8ld///JXf//yp6//+Quv//7PP///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////P4//+z0P//a6L//y99//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//4md//tJXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//9BiP//lr3//+ry//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////3+//+Mtv//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yh5//9qov//wdj///39///////////////////////////////////////////////////////////////////////////////////////////////////////////////////+/v////////7+//98rf//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//z+H//+UvP//6PH///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////82gv//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///J3j//2eg//++1////f3////////////////////////////////////////////////////////////////////////+/v///////////////////////+/1//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8oef//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///PYb//5K7///n8P///////////////////////////////////////////////////v7////////+/v///////////////////////8zf//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//+dwv//sc7//1iX//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8neP//ZZ///73V///8/f///////////////////////////////////v7//////////////////////////////////5a9//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//9/r//////////////a6P//gbD//zF///8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//88hf//j7n//+bv/////////v7////////////////////////////////////////l7///aaH//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//9amP////////////////////////b5//+qyv//UZL//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yd5//+tzP///f3/////////////////////////////+fv//5i///8tfP//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//82gv///////////////////////////////////////9Pj//96rP//Lnz//yV3//8ld///JXf//yV3//8ld///JXf//yV3//9jnf/////////////////////////////G2///R4z//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///7fP/////////////////////////////////////////////8vf//6PF//9Kjv//JXf//yV3//8ld///JXf//yV3//9inf//////////////////8/j//3Gm//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///yNz/////////////////////////////////////////////////////////////zN///3Oo//8qev//JXf//yV3//9qov///////////////////////+Pt//+dwv//VpX//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///pMb////////////////////////////////////////////////////////////////////////u9P//m8H//0OK//9xp////////////////////////////////////////+nx//+kxv//NYH//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///f6////////////////////////////////////////////////////////////////////////////////////7+///l7///////////////////////////////////////////////////NID//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///LHv//3qs///W5f/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////p8f//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///WJf//7PQ///6/P/////////////////////////////////////////////////////////////////////////////////////////////////////////////D2f//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//86hP//kbr//+jx//////////////////////////////////////////////////////////////////////////////////////////////////+dwv//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yl5//9upP//yt7///////////////////////////////////////////////////////////////////////////////////////93qv//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//0yP//+nyP//9vn///////////////////////////////////////////////////////////////////////9Rkv//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//5K7//+Lt///M4D//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///Mn///4Wz///g6/////////////////////////////////////////////////////////39//8tfP//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//4Kx////////9fn//6TG//9Eiv//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///Yp3//8PZ/////////////////////////////////////////////+Dr//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//1qY///////////////////+/v//vdX//1uZ//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//1OT/////////////////////////////////////////////7nT//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//zJ////////////////////////////////////V5P//dan//yp6//8ld///JXf//yV3//8ld///JXf//2Cc/////////////////////////////////////////////5S8//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3///k7v///////////////////////////////////////+nx//+OuP//KHn//yV3//8ld///JXf//26k/////////////////////////////////////////////22k//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//+61P//////////////////////////////////////////////////MH7//yV3//8ld///JXf//3yt////////////////////////////////////////+fv//0KJ//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ufP//h7T//+vy////////////////////////////////////////KHn//yV3//8ld///JXf//4m1///////////////////////////////////y9///XZr//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8md//tJXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yx7//+Dsf//5/D////////////////////////7/P//JXf//yV3//8ld///JXf//5e+/////////////////////////////+fw//9Lj///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8leP/TJXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///Knr//36v///l7//////////////z9///JXf//yV3//8ld///JXf//6XH////////////////////////2ef//zyF//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//4md/+pJXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8pef//eqz//+Hs///r8v//JXf//yV3//8ld///JXf//7LP///////////////////H3P//MX///yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yZ4/9kneP9bJXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yh5//9moP//JXf//yV3//8ld///JXf//7/X/////////////7LP//8qev//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yd3/4swgP8QJnf/9CV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//83g////////msD//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yZ4/zUAAAAAJnn/gSV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//9jn//+AsP//JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXj/sQAAAAAAAAAAK4D/DCV3/+Mld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//1iX//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8leP/3JXz/KQAAAAAAAAAAAAAAACh4/zMld//2JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8od/9aAAAAAAAAAAAAAAAAAAAAAAAAAAAnef9OJXf/9iV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//id5/3YAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKXr/MiV4/+Ild///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8meP/zJXn/UgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACuA/wwmeP9/Jnj/8yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//CZ4/5kpev8ZAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAM3f/DyV4/1kmd/+nJnf/0iZ3/+sld//+JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld///JXf//yV3//8ld//wJnj/1yV4/7Mlef9nKXr/GQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD+AAAAAH8AAPgAAAAAHwAA8AAAAAAPAADgAAAAAAcAAMAAAAAAAwAAgAAAAAABAACAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAABAACAAAAAAAEAAMAAAAAAAwAA4AAAAAAHAADwAAAAAA8AAPgAAAAAHwAA/gAAAAB/AAA=
// @description 2024/5/22 10:00:35
// @run-at      document-end
// @grant       GM_addStyle
// @grant       GM_setValue
// @grant       GM_getValue
// @downloadURL https://update.greasyfork.org/scripts/495757/%E5%BB%BAE%E7%BD%91%E9%BB%91%E5%90%8D%E5%8D%95.user.js
// @updateURL https://update.greasyfork.org/scripts/495757/%E5%BB%BAE%E7%BD%91%E9%BB%91%E5%90%8D%E5%8D%95.meta.js
// ==/UserScript==

(function () {
  'use strict';

  // 通过链接查找作者id
  function getId(url) {
    const found = url.match(/(?<=\/)\w{32}(?=\.?)/)
    if (found) {
      return found[0]
    } else {
      return ''
    }
  }

  // 数组去重
  function unique(arr) {
    return Array.from(new Set(arr))
  }

  // 数组删除指定元素
  function delElement(arr, element) {
    let new_set = new Set(arr)
    new_set.delete(element)
    return [...new_set]
  }

  console.log("黑名单开始执行")

  // 设置默认黑名单列表
  const defaultBlacklist = ['eXY4WmV1cjB1ajF4bzBXNFFTR2hjZz09',
    'K2dYd1hTekNEdlZKcjVDVE1WVkxmUT09',
    'eVJ3cy9IaUF4TkhjT2pHVklXUjdzdz09',
    'U0FFSHFtYTUyOTc5RDd3NlQ2MDVGQT09',
    'Sk9qQ3kreG1wVU1Ic3RaVVprOXhCdz09',
    'YzNVTUx0T2Mwa0JVTlFCNk1rQWRTQT09']


  // 获取黑名单列表
  let blacklist = GM_getValue("blacklist")
  // 如果没有就加载默认黑名单列表
  if (!blacklist) {
    blacklist = defaultBlacklist
  } else {
    // 拆开数组，追加多个值
    blacklist = blacklist.concat(defaultBlacklist)
    blacklist = unique(blacklist)
    GM_setValue("blacklist", blacklist)
  }

  // 计算一下本次搜索拦截了多少个
  let conust = 0

  // 如果是作者主页就加个黑名单按钮
  if (document.URL.indexOf('https://club.justeasy.cn/designer/work/') !== -1) {
    const id = getId(document.URL)
    if (!id) {
      alert('获取作者 id 失败！')
      return
    }

    const homepage = document.querySelector('.homepage_right')
    const css = `
    #add-blacklist{
      width: 120px;
      height: 46px;
      margin-left: 20px;
      border-radius: 10px;
      color: #fff;
      font-size: 16px;
    }
    `
    GM_addStyle(css)
    if (blacklist.includes(id)) {
      homepage.innerHTML += `<button id='add-blacklist' data-blacklist='true' >已加黑</button>`
      homepage.querySelector('#add-blacklist').style.background = '#b1b1b1'
    } else {
      homepage.innerHTML += `<button id='add-blacklist' data-blacklist='false' >加黑</button>`
      homepage.querySelector('#add-blacklist').style.background = 'rgb(222 0 0)'
    }


    // 监听点击事件
    document.querySelector('#add-blacklist').addEventListener('click', function () {
      // 已加黑的点击可以取消加黑
      if (this.getAttribute('data-blacklist') === 'true') {
        this.setAttribute('data-blacklist', 'false')
        this.style.background = 'rgb(222 0 0)'
        this.innerText = '加黑'
        // 同步数据
        blacklist = delElement(blacklist, id)
        GM_setValue("blacklist", blacklist)
      } else {
        this.setAttribute('data-blacklist', 'true')
        this.style.background = '#b1b1b1'
        this.innerText = '已加黑'
        // 同步数据
        blacklist.push(id)
        GM_setValue("blacklist", blacklist)
      }
    })
    return
  }



  // 每个元素需要执行的回调函数
  function eachHandler(element) {
    const info = element.querySelector("div.userInfo_footer > div.userInfo_info > a")
    // 如果没有找到元素就跳过本次循环，简单实现没有等待直接跳过，但这样容易漏掉黑名单
    if (!info) {
      return
    }
    // 找到作者id
    const id = getId(info.href)

    // 黑名单列表是否包含
    if (blacklist.includes(id)) {
      conust++
      const name = element.querySelector("div.userInfo_footer > div.userInfo_info > a > div.name").innerText
      // console.log("找到了一个黑名单用户："  element.querySelector("div.userInfo_footer > div.userInfo_info > a > div.name").innerText + " " + href)
      console.log(`${conust} 黑名单：[${id}] ${name}`)
      // 直接删除
      element.remove()
    }
  }



  // 当观察到变动时执行的回调函数
  function observerHandler(mutationsList, observer) {
    // 元素变化
    // console.log("页面变化了重新执行")
    // console.log(mutationsList)

    mutationsList[0].addedNodes.forEach(eachHandler)

  }

  // 定时器回调函数
  function timerHandler() {
    // 选择要观察的元素列表
    const targetNode = document.querySelector("#grid")
    // console.log("开始寻找父元素")
    // console.log(targetNode)
    // 如果找到元素就清除定时器
    if (targetNode) {
      // console.log("找到了父元素")
      clearInterval(intervalId) // 清除定时器

      const observerOptions = {
        childList: true, // 观察目标子节点的变化，是否有添加或者删除
        // attributes: true, // 观察属性变动
        // subtree: true, // 观察后代节点，默认为 false
      }
      // 实例化一个观察器
      let observer = new MutationObserver(observerHandler)
      // 开始观察目标节点
      observer.observe(targetNode, observerOptions);
    }
  }


  // 设置一个定时器
  const intervalId = setInterval(timerHandler, 1000)
  // 立刻执行一次
  timerHandler()

})();
