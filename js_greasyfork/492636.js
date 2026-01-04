// ==UserScript==
// @name         LF-ERP-User-Enhance
// @namespace    http://www.leadfluid.com.cn/zhbing
// @version      0.3.5
// @description  雷弗内部用ERP的功能增强脚本（For 用户）
// @author       zhbing
// @match        *://erp.leadfluid.com.cn/*
// @match        *://192.168.1.6:81/*
// @match        *://121.18.51.58:81/*
// @run-at       document-idle
// @icon         data:image/x-icon;base64,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0P8aEM//GhDP/xsR0P8bEdD/GxHQ/xsR0IvJx/N8////nf7+/p3+/v6d////nf///53///+d////nf///53+/v6d////nf7+/p3///+d/v7+nf///53///+d/v7+nf///53+/v6d////nf7+/p3///+d////nf///53///+d////nf///53///+d////nf///52Uj+m/GxHP/xsR0P8aEdD/GxDP/xsR0P8aEdD/GxHQ/RsRz8MbEdCDGxHQ+xoR0P8bEdD/GxHQ/xsR0P8bEdD/GxHQ/xsRz6HOzPTH/v7+///////+/v7///////7+/v///////v7+/////////////////////////////////////////////v7+/////////////////////////////v7+//////////////////7+/v/+/v7///////////+vrO7/GxHQ/xoRz/8bEdD/GxHQ/xoR0P8bEc//GhHP/RsR0MEaEdCBGhHQ+xsR0P8bEc//GhDP/xsR0P8bEdD/GxDQ/xoQz8O8ufHb/v7+//////////////////7+/v/+/v7//v7+//////////////////7+/v/+/v7///////////////////////7+/v///////////////////////v7+//////////////////7+/v/+/v7///////////+vrO7/GxHP/xoQ0P8bEdD/GxHP/xoQz/8aEND/GhDP/RsRz8MaEdCBGhDQ+xsQz/8bEc//GhDP/xsR0P8bEdD/GhDQ/xsRz+uopO3z/Pv+/////////////v7+//7+/v/////////////////+/v7////////////+/v7///////////////////////7+/v////////////7+/v///////v7+///////+/v7//v7+//7+/v/+/v7//v7+//////+vrO7/GxHP/xoQ0P8aEM//GxHP/xsR0P8aEND/GxDP/RsRz8MbEdCDGxHQ+xoR0P8bEdD/GxHQ/xsR0P8bEdD/GxHQ/xsR0P+CfeX/5uT5/////////////v7+//7+/v///////v7+/////////////v7+/////////////v7+/////////////v7+//////////////////////////////////////////////////7+/v////////////////+vrO7/GxHQ/xsR0P8bEND/GxHQ/xsR0P8bEc//GxHQ/RsR0MEaEdCBGhDQ+xsR0P8bEdD/GhDP/xsR0P8bEdD/GxHQ/xsQz/9LQ9n/u7jx//z8/v///////////////////////v7+//7+/v/+/v7///////7+/v///////v7+///////////////////////+/v7////////////+/v7///////////////////////7+/v////////////////+vrO7/GxHQ/xsR0P8bEdD/GxHQ/xoQz/8bEdD/GxHQ/RsRz8MaEc+BGxDQ+xsR0P8bEdD/GxDQ/xsR0P8aEM//GxHQ/xsR0P8mHNL/iILm/+fm+v////////////////////////////7+/v/+/v7/+Pj9/9bU9v+vrO7/r6zu/6+s7v+vrO7/r6zu/6+s7v+vrO7/r6zu/6+s7v+vrO7/r6zu/6+s7v+vrO7/r6zu/6+s7v+vrO7/r6zu/6+s7v97duP/GxHP/xsR0P8aEM//GxHQ/xsR0P8bEdD/GhHQ/RoQ0MMbEdCBGxHQ+xsR0P8aEM//GhDP/xoR0P8bEM//GhDQ/xsR0P8bEdD/Rz/Z/7Gt7v/49/3////////////+/v7////////////+/v7/8vL8/6qm7f9GPtj/HhXQ/xoQz/8aEM//GxDP/xsR0P8bEdD/GxHQ/xoR0P8bEdD/GxHQ/xsR0P8bEdD/GxHQ/xsR0P8aEdD/GxHQ/xsR0P8aEND/GhHP/xoQz/8aEc//GhHQ/xsR0P8aEM//GxDP/RsR0MEbEdCBGxHQ+xsQ0P8bEdD/GxDQ/xsQz/8bEdD/GxHQ/xsQz/8bEdD/GxHQ/2Rd3//LyfT/+Pj9/////////////v7+//7+/v/+/v7///////j3/f+/vPH/Ukvb/yIY0f8bEdD/GxHQ/xsQ0P8bEc//GhDP/xsRz/8bEc//GxHQ/xoQz/8aEM//GxHQ/xsR0P8bEdD/GhHP/xsR0P8bEdD/GxHP/xsR0P8aEM//GxHP/xsR0P8bEdD/GxHQ/RsR0MMaEdCBGxHQ+xoQ0P8bEdD/GxHQ/xsQz/8aEM//GxHQ/xsQz/8bEdD/GxHP/yAW0f9oYeD/z831//n5/f/////////////////////////////////8+/7/19b2/19Y3v8nHdL/GxHQ/xsRz/8bEc//GxHQ/xsR0P8bEc//GxHQ/xsR0P8bEdD/GxHQ/xsR0P8bEdD/GxHQ/xsR0P8bEdD/GxHQ/xsR0P8bEND/GxHP/xoR0P8bEdD/GxHQ/RsQ0MMaEc+BGhHQ+xsR0P8bEdD/GhDP/xsR0P8bEdD/GxDQ/xsR0P8aEND/GxHQ/xoQ0P8mHNL/a2Tg/87M9f/4+P3//v7+///////////////////////+/v7//v7+//Py/P9wa+L/LCPT/xwS0P8bEdD/GxHQ/xsR0P8aEM//GxHQ/xsR0P8bEdD/GxHP/xsR0P8bEc//GhHP/xsR0P8aEND/GxDQ/xoQz/8aEc//GxHQ/xsR0P8aEND/GxDP/RsR0MEaEdCBGhDP+xoQ0P8bEND/GhDQ/xsQz/8bEdD/GxDP/xsR0P8bEdD/GxDQ/xsR0P8bEdD/HxbR/1xU3f/HxPP/9/b9//7+/v/+/v7//v7+//7+/v/+/v7//v7+//7+/v/+/v7/iIPm/zQs1f8dE9D/GxHQ/xsRz/8bEc//GxHQ/xsR0P8aEdD/GxHP/xsR0P8bEdD/GxHQ/xsR0P8bEdD/GxHQ/xoR0P8bEM//GhDP/xoQz/8bEdD/GxHQ/RsR0MEbEdCBGxHQ+xoQ0P8bEdD/GxDP/xsQz/8bEdD/GxDQ/xoQz/8bEdD/GhDQ/xsR0P8bEdD/GhDQ/xsR0P9IQNn/trPv//X1/f/////////////////+/v7//////////////////////7ez7/87Mtb/HhTQ/xsR0P8bEND/GxHQ/xsRz/8bEdD/GxHQ/xsR0P8bEdD/GxHQ/xsR0P8bEdD/GxHQ/xsR0P8aEdD/GxHQ/xsR0P8aEdD/GxHQ/RoQ0MMaEdCBGxDQ+xsR0P8aEM//GhDP/xsR0P8bEdD/GxHQ/xsR0P8aEND/GxHQ/xoQ0P8aEND/GxHQ/xsR0P8bEND/MyrV/5CL6P/4+P3//v7+///////////////////////////////////////PzfX/SkLa/yEX0f8bEdD/GxDP/xsR0P8aEM//GxHP/xsR0P8bEdD/GxHP/xoQz/8aEdD/GxHQ/xsQz/8bEdD/GxHQ/xsQ0P8bEM//GxDP/RsR0MEbEdCBGxHQ+xsR0P8aEc//GhDQ/xsQz/8bEdD/GxHP/xsR0P8bEdD/GxHP/xsR0P8bEdD/GxHP/xsR0P8bEdD/GxDQ/yUc0v9qY+D/8/L8//7+/v/////////////////////////////////+/v7/5+b6/2dg3/8lHNL/GhDP/xsR0P8bEdD/GxDQ/xsR0P8bEdD/GxDQ/xsR0P8bEdD/GxHQ/xsR0P8bEND/GxHQ/xoQz/8bEdD/GxHQ/RsR0MEbEdCBGxHQ+xsR0P8aEc//GhDQ/xsQz/8bEdD/GxHP/xsR0P8bEdD/GxHP/xsR0P8bEdD/GxHP/xsR0P8bEdD/GxDQ/xsR0P8hF9H/Ukrb/9nX9//////////////////////////////////+/v7///////Tz/P+Hgeb/MCfU/xsR0P8bEdD/GxDQ/xsR0P8bEdD/GxDQ/xsR0P8bEdD/GxHQ/xsR0P8bEND/GxHQ/xoQz/8bEdD/GxHQ/RsR0MEaEdCBGxHQ+xsR0P8bEdD/GhHP/xoR0P8bEM//GhHP/xoRz/8bEdD/GhHQ/xsR0P8bEdD/GhHQ/xsR0P8bEND/GxHQ/xsRz/8bEdD/HxXR/z831/+zsO///////////////////////////////////v7+//7+/v/5+f3/oJzr/zsz1v8aEND/GxHQ/xsQz/8bEM//GxHQ/xoQ0P8aEdD/GhHP/xsQz/8aEdD/GxHQ/xsR0P8bEdD/GxHP/RsR0MEbEdCBGhHQ+xoQ0P8aEM//GxDQ/xsQz/8aEdD/GxDQ/xsQz/8bEdD/GhHQ/xsR0P8bEdD/GhHQ/xsR0P8bEdD/GxHQ/xsR0P8bEc//GxHQ/x0T0P8xJ9T/m5fq//////////////////7+/v/+/v7/////////////////9/b9/7q38P9UTdz/IBbR/xoQ0P8aEND/GxHQ/xoRz/8bEND/GhDP/xsR0P8aEM//GxHQ/xsRz/8aEdD/GxHQ/RoQ0MMaEdCBGhDQ+xsR0P8bEM//GxHQ/xsQz/8bEdD/GxHP/xoQ0P8aEND/GxHQ/xoQ0P8aEND/GxHQ/xoQ0P8bEdD/GxHQ/xsRz/8bEc//GxHQ/xoQz/8cEtD/LSTT/4J95f/y8fz//v7+//7+/v/+/v7///////////////////////f3/f/S0PX/aGHg/yAW0f8bEc//GxHQ/xsRz/8aEM//GxHQ/xsR0P8bEM//GxHQ/xoQz/8bEdD/GxHQ/RsR0MEaEc+BGxHQ+xoQz/8bEdD/GhDP/xoR0P8aEM//GxHQ/xoQz/8bEND/GxHQ/xoQ0P8bEND/GxHQ/xsQ0P8bEdD/GxDQ/xoQ0P8aEc//GhDP/xsR0P8aEND/GxHQ/ykg0/9iXN//4eD4//z8/v/////////////////+/v7////////////6+v7/0tD1/2pk4P8gF9H/GxHQ/xsQ0P8bEM//GhHQ/xoQz/8aEM//GxHQ/xsR0P8aEc//GhDP/RsR0MEaEdCBGxDQ+xoQ0P8aEc//GxDP/xsRz/8bEdD/GxHP/xsR0P8aEdD/GxHP/xsR0P8aEdD/GxHP/xoR0P8bEdD/GxHQ/xsR0P8bEc//GhHP/xsRz/8bEc//GxHQ/xsRz/8kGtH/Tkfa/9HP9f/6+v7//v7+//////////////////7+/v/+/v7/+fn9/8rI9P9iW97/GxDQ/xoQ0P8bEdD/GxDP/xoR0P8aEdD/GxHQ/xoR0P8bEdD/GxHQ/RsQ0MMbEdCBGxHP+xoR0P8bEc//GhDP/xsR0P8bEdD/GhDQ/xsR0P8bEdD/GhDP/xsR0P8bEdD/GhDP/xsR0P8bEdD/GhDQ/xsR0P8bEdD/GxDP/xsR0P8bEdD/GxHP/xsR0P8bEdD/HhTQ/0c/2f+wrO7/8/P8///////+/v7//v7+///////+/v7///////f2/f+yr+//SkLZ/xoQz/8bEdD/GxHQ/xoQz/8bEdD/GhHQ/xoQz/8bEdD/GxHQ/RsR0MMbEdCBGxHQ+xoR0P8bEdD/GxHQ/xsR0P8aEM//GxHP/xoR0L9waeHZkYzo/5GM6P+RjOj/kYzo/5GM6P+RjOj/kYzo/5GM6P+RjOj/kYzo/5GM6P+RjOj/kYzo/5GM6P+RjOj/kYzo/5GM6P+3s/D/8/L8///////+/v7////////////+/v7//v7+///////u7fv/kIvo/yYd0v8aEND/GxHQ/xsQz/8bEND/GxHP/xsR0P8bEdD/GxHQ/RsR0MEbEdCBGxHQ+xsR0P8aEc//GxHQ/xsR0P8bEdD/GhHQ/xoRz4/HxfO96+r6/+vq+v/r6vr/6+r6/+vq+v/r6vr/6+r6/+vq+v/r6vr/6+r6/+vq+v/r6vr/6+r6/+vq+v/r6vr/6+r6/+vq+v/r6vr/+/v+//7+/v///////v7+//7+/v////////////7+/v/+/v7/yMXz/1lR3P8bEND/GxDP/xsQ0P8bEND/GxHQ/xoR0P8bEND/GxHQ/RsR0MEbEdCBGxHQ+xsR0P8bEdD/GxHP/xsR0P8bEdD/GhHQ/xsR0IXf3fi1/////////////////////////////////////////////////v7+/////////////////////////////////////////////v7+/////////////////////////////v7+//7+/v/+/v7/7Ov7/4+K5/8gFtH/GxHQ/xsR0P8aEND/GxHP/xsR0P8bEND/GxHP/RsR0MEaEc+BGxHQ+xsR0P8bEdD/GxDQ/xoQz/8bEc//GxHQ/xsR0IXf3fi1//////7+/v////////////7+/v/+/v7////////////////////////////+/v7//v7+//7+/v/+/v7//v7+//7+/v///////v7+///////+/v7//////////////////v7+/////////////Pz+/7ez8P8+Ndf/GxHQ/xsR0P8bEND/GhDQ/xsR0P8aEdD/GxHQ/RsR0MEbEdCBGxHQ+xsR0P8bEdD/GhHQ/xsR0P8bEdD/GhDP/xsR0IXf3fi1//////7+/v/////////////////+/v7///////////////////////7+/v/+/v7//v7+//////////////////7+/v////////////7+/v///////////////////////////////////////////9LQ9f9lX9//GxHQ/xsR0P8bEND/GxHP/xsQ0P8aEM//GxHP/RsR0MEbEdCBGxHP+xsR0P8bEdD/GxHQ/xoQz/8bEdD/GhDP/xsR0IXf3fi1//////7+/v/+/v7//////////////////v7+///////+/v7////////////+/v7///////////////////////7+/v///////////////////////////////////////////////////////////+Lh+f+AeuT/GxHQ/xsQ0P8bEND/GxHQ/xsQ0P8bEdD/GxHP/RsR0MEaEc+BGxDQ+xoQ0P8bEM//GxDQ/xsQz/8bEc//GxHP/xsR0IXf3fi1///////////////////////////+/v7///////////////////////////////////////7+/v/+/v7////////////+/v7//v7+///////+/v7///////////////////////7+/v/+/v7//v7+//Dv+/+Wken/GxHQ/xsR0P8aEM//GxHQ/xsR0P8bEdD/GxHQ/RsR0MEbEdCBGxHQ+xsR0P8bEdD/GxHP/xsR0P8bEdD/GxHQ/xsRz52dmeqnx8Tzz8fE88/HxPPPx8Tzz8fE88/HxPPPx8Tzz8fE88/HxPPPx8Tzz8fE88/HxPPPx8Tzz8fE88/HxPPPx8Tzz8fE88/HxPPPx8Tzz8fE88/HxPPPx8Tzz8fE88/HxPPPx8Tzz8fE88/HxPPPx8Tzz8PA8s98duPfGxHQ/xsR0P8bEM//GxHQ/xoR0P8bEND/GxHQ/RsR0MEbEdCBGxDQ+xoRz/8bEdD/GhHQ/xsR0P8bEdD/GxHQ/xsRz9kbEc+1GxHQrRsR0K0bEdCtGxHQrRsR0K0bEdCtGxHQrRsR0K0bEdCtGhDPrRsR0K0bEdCtGhDPrRsR0K0bEdCtGhDPrRsR0K0bEdCtGhDPrRsR0K0bEdCtGhDPrRsR0K0aEM+tGhHQrRoQz60aEM+tGhHQrRoQz60bENDLGxHQ/xsQz/8aEM//GxHQ/xsR0P8bEdD/GxHQ/RsR0L0aEdByGxHP+RsR0P8bEdD/GhHP/xsR0P8bEdD/GxHQ/xsR0P8bEdD/GxHQ/xoQz/8aEM//GxHQ/xoR0P8aEND/GxHQ/xoQ0P8bEdD/GxDQ/xsR0P8bEM//GxHQ/xsRz/8bEc//GxHQ/xsQ0P8bEM//GxDQ/xsR0P8bEdD/GhDQ/xsR0P8bEdD/GxHQ/xoQ0P8bEND/GxHQ/xsR0P8bEND/GxHQ/xsR0P8bEND/GxHQ/xsR0P8bEdD/GxHP+xsR0J8bEdBAGxHQ9RoQz/8bEdD/GxDQ/xsR0P8bEdD/GxHQ/xsR0P8bEdD/GxHP/xsR0P8bEdD/GxHQ/xsR0P8aEc//GxHQ/xsR0P8bEdD/GxHQ/xsR0P8aEc//GhDP/xsR0P8bEdD/GxHQ/xsQ0P8bEdD/GxHQ/xoQz/8bEdD/GxDP/xoQz/8bEdD/GxHP/xsR0P8bEdD/GxHP/xsR0P8aEc//GxHP/xsR0P8aEM//GxHQ/xoQz/8bEc//GxDQ+RsR0FwbEdAOGxHQ0RsRz/0bEdD/GxHQ/xsR0P8bEdD/GxHQ/xsR0P8bEdD/GxDP/xsR0P8bEdD/GxDP/xsR0P8bEdD/GhHQ/xsQz/8bEM//GxHQ/xsQz/8bEM//GxHQ/xsQz/8bEM//GxHQ/xsQz/8bEM//GxHQ/xsQz/8bEM//GxHQ/xsQz/8bEdD/GxHQ/xsR0P8bEdD/GxHQ/xsR0P8aEc//GxHQ/xsR0P8aEc//GxHQ/xoR0P8bEc//GxHQ4xoR0BoAAAAAGhHQZhsRz+sbEc//GhHQ/xsR0P8bEND/GhHP/xoR0P8bEc//GxDQ/xoQz/8bEM//GxDQ/xsRz/8bEdD/GxHQ/xsQ0P8bEND/GhDP/xsR0P8bEc//GhHP/xoQ0P8aEND/GhDP/xsQz/8aEND/GhDP/xsR0P8bEND/GhDP/xsR0P8aEM//GxHQ/xoQz/8bEc//GxHQ/xsR0P8bEdD/GxHP/xoQz/8bEc//GhHQ/xsRz/8bEM/vGxHQgwAAAAAAAAACAAAAABsR0KkbEdDtGxHQ/xsR0P8bEdD/GxHP/xsR0P8bEdD/GxDQ/xsRz/8bEc//GxDQ/xsR0P8bEc//GxHQ/xsRz/8aEc//GhDP/xsQz/8aEM//GhDP/xoRz/8aEc//GhDP/xsR0P8bEND/GhHQ/xsR0P8bEdD/GxHP/xsR0P8bEdD/GxHQ/xoQz/8bEdD/GxHQ/xoQz/8aEdD/GxHQ/xsRz/8aEM//GxHQ/xsR0PEbEc+rGxHQDgAAAAAAAAAAAAAAABsR0A4bEdCPGxDP5RoR0PkbEdD/GxHQ/xoRz/8aEND/GhDQ/xsR0P8bEdD/GxHQ/xoQ0P8bEdD/GxHQ/xsR0P8bEdD/GxHQ/xsR0P8bEdD/GxHQ/xsR0P8bEdD/GxHQ/xoQ0P8aEND/GxHQ/xoQ0P8aEND/GxHQ/xoQ0P8bEM//GhHQ/xsQz/8bEdD/GhHQ/xsQz/8bEdD/GhHQ/xsRz/8bEdD7GxHQ6RsR0KkbEdAOAAAAAAAAAAAAAAAAAAAAAgAAAAAAAAAAGhHQTBsR0LEbEdDpGxHQ9xsQ0PcbEdD3GxHQ9xsR0PcbEdD3GxDP9xsR0PcbEdD3GxDQ9xsRz/cbEM/3GxDP9xoQz/cbEc/3GxDP9xsRz/cbEc/3GxHP9xsRz/cbEc/3GhDP9xsQz/cbEdD3GxHP9xsR0PcbEM/3GxHQ9xsQz/cbEM/3GxHQ9xsQz/cbEM/3GxHQ9xsR0O8bEc+9GxHQTAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACAAAAAAAAAAAbEc8MGhDQMhsR0EAbEdBAGhHPQBsR0EAbEdBAGhHPQBsR0EAbEdBAGxHQQBsR0EAaEdBAGhHPQBoR0EAbEdBAGhHQQBsR0EAbEdBAGhHQQBsR0EAaEdBAGhHPQBoR0EAbEdBAGxHQQBoRz0AaEdBAGxHQQBoR0EAaEdBAGxHQQBoR0EAbEdBAGxDQOBsR0BgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD8AAAAAB8AAPAAAAAADwAAwAAAAAADAADAAAAAAAMAAIAAAAAAAQAAgAAAAAABAACAAAAAAAAAAAAAAAAAAAAAAH////4AAAAAQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAIAAAAAAAAAAgAAAAAABAACAAAAAAAEAAMAAAAAAAQAAwAAAAAADAADgAAAAAAcAAPgAAAAAHwAA////////AAA=
// @grant        GM_xmlhttpRequest
// @grant        unsafeWindow
// @connect      api.leadfluid.net
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/492636/LF-ERP-User-Enhance.user.js
// @updateURL https://update.greasyfork.org/scripts/492636/LF-ERP-User-Enhance.meta.js
// ==/UserScript==

(function() {
    'use strict';
    let sysConfig =  unsafeWindow.window.top.SysConfig;
    let zbVer = (sysConfig && sysConfig.AppVersion) ? sysConfig.AppVersion : "";
    if(zbVer!="32.11") return;

    let scriptVer = GM_info.script.version;
    let href = unsafeWindow.window.location.href.toLowerCase();
    //异步获取元素的脚本库 ElementGetter 2.0.0 文档见https://bbs.tampermonkey.net.cn/thread-2726-1-1.html
    var elmGetter = function() {
        const win = window.unsafeWindow || document.defaultView || window;
        const doc = win.document;
        const listeners = new WeakMap();
        let mode = 'css';
        let $;
        const elProto = win.Element.prototype;
        const matches = elProto.matches ||
              elProto.matchesSelector ||
              elProto.webkitMatchesSelector ||
              elProto.mozMatchesSelector ||
              elProto.oMatchesSelector;
        const MutationObs = win.MutationObserver ||
              win.WebkitMutationObserver ||
              win.MozMutationObserver;
        function addObserver(target, callback) {
            const observer = new MutationObs(mutations => {
                for (const mutation of mutations) {
                    if (mutation.type === 'attributes') {
                        callback(mutation.target);
                        if (observer.canceled) return;
                    }
                    for (const node of mutation.addedNodes) {
                        if (node instanceof Element) callback(node);
                        if (observer.canceled) return;
                    }
                }
            });
            observer.canceled = false;
            observer.observe(target, {childList: true, subtree: true, attributes: true});
            return () => {
                observer.canceled = true;
                observer.disconnect();
            };
        }
        function addFilter(target, filter) {
            let listener = listeners.get(target);
            if (!listener) {
                listener = {
                    filters: new Set(),
                    remove: addObserver(target, el => listener.filters.forEach(f => f(el)))
                };
                listeners.set(target, listener);
            }
            listener.filters.add(filter);
        }
        function removeFilter(target, filter) {
            const listener = listeners.get(target);
            if (!listener) return;
            listener.filters.delete(filter);
            if (!listener.filters.size) {
                listener.remove();
                listeners.delete(target);
            }
        }
        function query(all, selector, parent, includeParent, curMode) {
            switch (curMode) {
                case 'css':
                    const checkParent = includeParent && matches.call(parent, selector);
                    if (all) {
                        const queryAll = parent.querySelectorAll(selector);
                        return checkParent ? [parent, ...queryAll] : [...queryAll];
                    }
                    return checkParent ? parent : parent.querySelector(selector);
                case 'jquery':
                    let jNodes = $(includeParent ? parent : []);
                    jNodes = jNodes.add([...parent.querySelectorAll('*')]).filter(selector);
                    if (all) return $.map(jNodes, el => $(el));
                    return jNodes.length ? $(jNodes.get(0)) : null;
                case 'xpath':
                    const ownerDoc = parent.ownerDocument || parent;
                    selector += '/self::*';
                    if (all) {
                        const xPathResult = ownerDoc.evaluate(selector, parent, null, 7, null);
                        const result = [];
                        for (let i = 0; i < xPathResult.snapshotLength; i++) {
                            result.push(xPathResult.snapshotItem(i));
                        }
                        return result;
                    }
                    return ownerDoc.evaluate(selector, parent, null, 9, null).singleNodeValue;
            }
        }
        function isJquery(jq) {
            return jq && jq.fn && typeof jq.fn.jquery === 'string';
        }
        function getOne(selector, parent, timeout) {
            const curMode = mode;
            return new Promise(resolve => {
                const node = query(false, selector, parent, false, curMode);
                if (node) return resolve(node);
                let timer;
                const filter = el => {
                    const node = query(false, selector, el, true, curMode);
                    if (node) {
                        removeFilter(parent, filter);
                        timer && clearTimeout(timer);
                        resolve(node);
                    }
                };
                addFilter(parent, filter);
                if (timeout > 0) {
                    timer = setTimeout(() => {
                        removeFilter(parent, filter);
                        resolve(null);
                    }, timeout);
                }
            });
        }
        return {
            get currentSelector() {
                return mode;
            },
            get(selector, ...args) {
                let parent = typeof args[0] !== 'number' && args.shift() || doc;
                if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
                const timeout = args[0] || 0;
                if (Array.isArray(selector)) {
                    return Promise.all(selector.map(s => getOne(s, parent, timeout)));
                }
                return getOne(selector, parent, timeout);
            },
            each(selector, ...args) {
                let parent = typeof args[0] !== 'function' && args.shift() || doc;
                if (mode === 'jquery' && parent instanceof $) parent = parent.get(0);
                const callback = args[0];
                const curMode = mode;
                const refs = new WeakSet();
                for (const node of query(true, selector, parent, false, curMode)) {
                    refs.add(curMode === 'jquery' ? node.get(0) : node);
                    if (callback(node, false) === false) return;
                }
                const filter = el => {
                    for (const node of query(true, selector, el, true, curMode)) {
                        const _el = curMode === 'jquery' ? node.get(0) : node;
                        if (refs.has(_el)) break;
                        refs.add(_el);
                        if (callback(node, true) === false) {
                            return removeFilter(parent, filter);
                        }
                    }
                };
                addFilter(parent, filter);
            },
            create(domString, ...args) {
                const returnList = typeof args[0] === 'boolean' && args.shift();
                const parent = args[0];
                const template = doc.createElement('template');
                template.innerHTML = domString;
                const node = template.content.firstElementChild;
                if (!node) return null;
                parent ? parent.appendChild(node) : node.remove();
                if (returnList) {
                    const list = {};
                    node.querySelectorAll('[id]').forEach(el => list[el.id] = el);
                    list[0] = node;
                    return list;
                }
                return node;
            },
            selector(desc) {
                switch (true) {
                    case isJquery(desc):
                        $ = desc;
                        return mode = 'jquery';
                    case !desc || typeof desc.toLowerCase !== 'function':
                        return mode = 'css';
                    case desc.toLowerCase() === 'jquery':
                        for (const jq of [window.jQuery, window.$, win.jQuery, win.$]) {
                            if (isJquery(jq)) {
                                $ = jq;
                                break;
                            };
                        }
                        return mode = $ ? 'jquery' : 'css';
                    case desc.toLowerCase() === 'xpath':
                        return mode = 'xpath';
                    default:
                        return mode = 'css';
                }
            }
        };
    }();
    if(!unsafeWindow.window.Help) unsafeWindow.window.Help = new Object();
    Help.showExplan = function(h, g) {
        g = g || unsafeWindow.window.event;
        var f = document.getElementById("bill_help_expaln");
        var t = document.documentElement.clientWidth || document.body.clientWidth;
        var s = document.documentElement.clientHeight || document.body.clientHeight;
        var l = parseInt(t * 0.8) > 700 ? 700 : parseInt(t * 0.8);
        var k = parseInt(s * 0.8) > 400 ? 400 : parseInt(s * 0.8);
        if (f) {
            $(f).remove();
            f = null
        }
        if (!f) {
            f = document.createElement("div");
            f.id = "bill_help_expaln";
            var r = "";
            if (h.getAttribute) {
                r = (h.getAttribute("text") || "")
            } else {
                r = (h.text || "")
            }
            if (r.length < 500) {
                if (l > 500) {
                    l = 500
                }
            }
            f.innerHTML = "<div id='bill_help_expaln_text' class='bill_help_expaln_text'  style='max-height:" + k + "px;overflow-y:auto;'><div class='bill_help_expaln_top'><a href='javascript:;' class='bill_help_expaln_close'></a></div>" + r + "</div>";
            document.body.appendChild(f)
        } else {
            var r = "";
            if (h.getAttribute) {
                r = (h.getAttribute("text") || "")
            } else {
                r = (h.text || "")
            }
            unsafeWindow.window.$ID("bill_help_expaln_text").innerHTML = r
        }
        f.style.maxWidth = l + "px";
        var p = $(h)[0].getBoundingClientRect();
        var j = $(f).height();
        var m = $(f).width();
        var u = document.documentElement.clientWidth || document.body.clientWidth;
        var a = $("div.bill_help_expaln_top");
        var d = a.width();
        var b = a.height();
        var q = p.top - j - b;
        if (q < 0) {
            q = p.top + $(h).height() + b;
            a.removeClass("up")
        } else {
            a.addClass("up")
        }
        var o = p.left + $(h).width() / 2 - m / 2;
        if (o < 10) {
            o = 10
        }
        if (o + m > u) {
            o = u - m - 10
        }
        f.style.top = q + "px";
        f.style.left = o + "px";
        f.style.display = "block";
        var c = p.left + $(h).width() / 2 - o - d / 2;
        if (a[0]) {
            a[0].style.left = c + "px"
        }
        $(unsafeWindow.window).off("scroll", Help.closExplan).on("scroll", Help.closeExplan);
        $(document).unbind("click", Help.closeExplan).bind("click", Help.closeExplan)
    }
    ;
    Help.closeExplan = function() {
        if (unsafeWindow.window.event && unsafeWindow.window.event.target && (unsafeWindow.window.event.target.id == "bill_help_expaln" || $(unsafeWindow.window.event.target).parents("#bill_help_expaln")[0])) {
            return
        }
        setTimeout(function() {
            $(document.getElementById("bill_help_expaln")).remove()
        }, 10)
    }
    ;
    function adjustAlwaysRequiredField(fieldName) {
		let notNullInput = document.createElement("input");
		notNullInput.setAttribute("type", "button");
		notNullInput.className = "notnull";
		notNullInput.title = "必填";
		notNullInput.value = "*";
        document.querySelector("#" + fieldName + "_fbg").setAttribute("bill_field_notnull", 1);
		document.querySelector("#" + fieldName + "_div").setAttribute("nul","1");
        document.querySelector("#" + fieldName + "_tit").setAttribute("nul","1");
        document.querySelector("#" + fieldName + "_div").append(notNullInput);
    }
    function adjustConditionRequiredField(fieldName, condition) {
        //Hack begin
        if(condition) {
            document.querySelector("#" + fieldName + "_fbg").setAttribute("bill_field_notnull","1");
            document.querySelector("#" + fieldName + "_div").setAttribute("nul","1");
            document.querySelector("#" + fieldName + "_0").setAttribute("nul","1");
        }else {
            document.querySelector("#" + fieldName + "_fbg").setAttribute("bill_field_notnull","0");
            document.querySelector("#" + fieldName + "_div").setAttribute("nul","0");
            document.querySelector("#" + fieldName + "_0").setAttribute("nul","0");
        }//Hack end
    }

    //判断产品是否为一码多物类型的产品
    function isOcmmProduct(productBH) {
        let products = ['3050100101090', '3030300201154', '4030300101020','3050100100134','3050100100166', '3050100101039', '3010400101003','3050100101021','3050100101020', '3050100101035'];
        let isOcmm = false;
        for(let zz = 0; zz < products.length; zz++) {
            //判断产品是否为一码多物产品
            if(productBH == products[zz]) isOcmm = true;
        }
        return isOcmm;
    }
    //产品明细里的一码多物备注字段增加校验
    function adjustDetailOcmmCol(detailName, productDbname) {
        let ocmmName = "一码多物备注";
        let spanHtml = `
        一码多物备注<span class="help_explan_ico" onmouseover="Bill.showHelpExplan(this)" text="&nbsp;&nbsp;&nbsp;&nbsp;<span style='color:yellow;font-weight: bold;'>注意：禁止使用以下一码多物产品代替系统已有产品!</span><br/>&nbsp;&nbsp;&nbsp;&nbsp;当使用一码多物类型的产品时，为了让后续流程相关人员知道具体是什么产品，必须：</BR>&nbsp;&nbsp;&nbsp;&nbsp;1. 不同的产品则应拆分成多行；</BR>&nbsp;&nbsp;&nbsp;&nbsp;2. 填写‘一码多物备注’字段，至少应包含产品的实际名称。</BR>&nbsp;&nbsp;&nbsp;&nbsp;包括但不限于以下产品：</BR>&nbsp;&nbsp;&nbsp;&nbsp;1. 研发耗材-实体（3050100100166）</BR>&nbsp;&nbsp;&nbsp;&nbsp;2. 实验工具耗材（3050100101090）</BR>&nbsp;&nbsp;&nbsp;&nbsp;3. 生产耗材-实体（3050100100134）</BR>&nbsp;&nbsp;&nbsp;&nbsp;4. 工艺耗材（4030300101020）</BR>&nbsp;&nbsp;&nbsp;&nbsp;5. 机加车间物资（3050100101039）</BR>&nbsp;&nbsp;&nbsp;&nbsp;6. 研发通用-内部机加件（3030300201154）</BR>&nbsp;&nbsp;&nbsp;&nbsp;7. 机加物料：304不锈钢料 （3010400101003）、pom原材料（3050100101021）、6061铝料（3050100101020）" style="cursor: default;display: inline-block;float: none;vertical-align: middle;"></span>
        `
        let headers = unsafeWindow.window["lvw_JsonData_" + detailName].headers;
        let proBhColIndex = -1;
        for(let i = 0; i < headers.length; i++) {
            if(headers[i].dbname == productDbname) {
                proBhColIndex = headers[i].index;
            }
        }
        //let vheaders = window.PageInitParams[0].groups[1].fields[0].listview.vheaders[0];
        let vheaders = unsafeWindow.window["lvw_JsonData_" + detailName].vheaders[0];
        let ocmmVIndex = -1;
        let ocmmColIndex = -1;
        for(let i = 0; i < vheaders.length; i++) {
            if(vheaders[i].text == ocmmName) {
                ocmmColIndex = vheaders[i].colindex;
                ocmmVIndex = vheaders[i].vindex;
            }
        }
        if(ocmmVIndex!=-1)
            document.querySelector("#lvw_dbtable_" + detailName +" > tbody > tr.lvwheadertr.hideheader0 > th.lvwheader.h_1.l_" + ocmmVIndex + ".lvw_header_Filter > div.lvwheadertdoverflow").innerHTML = spanHtml;
        //Hack 智邦的ListView.DataVerifiShowMsgItem函数
        ListView.orginDataVerifiShowMsgItem = ListView.DataVerifiShowMsgItem;
        ListView.DataVerifiShowMsgItem = function(lvw, ch, ri, ci, bgdom, verifyInfo) {
            if(proBhColIndex!=-1 && ocmmColIndex!=-1 && ci == ocmmColIndex) {//一码多物字段
                ch.notnull = isOcmmProduct(lvw.rows[ri][proBhColIndex]);
            }
           return ListView.orginDataVerifiShowMsgItem.call(this, lvw, ch, ri, ci, bgdom, verifyInfo);
        }
    }
    //标题栏插入帮助链接
    function insertTitleSectionHelp(elementQuery, helpTitle, helpUrl) {
        let element = document.querySelector(elementQuery);
        let spanHtml = `
            <a  href="${helpUrl}" target="_blank"><img src="/SYSN/skin/default/img/bhelp.png" height="24" width="24"  style="vertical-align:middle" title="${helpTitle}" /></a>
        `
        element.insertAdjacentHTML("beforeend", spanHtml);
    }
    //SYSA页面给单据主栏位名称前面插入帮助ToolTip
    function insertSysaMasterFieldHelp(elementXpath, helpText) {
        let spanHtml = `
                    <span class="help_explan_ico" onmouseover="Help.showExplan(this)" text="${helpText}"/>
        `
        document.querySelector(elementXpath).style.display ="flex";
        document.querySelector(elementXpath).style.justifyContent = "flex-end";
        document.querySelector(elementXpath).insertAdjacentHTML("afterbegin", spanHtml);
    }
    function insertSysnMasterFieldHelp(elementXpath, helpText) {
        let element = document.querySelector(elementXpath);
        let title = element.innerText;
        document.querySelector(elementXpath).innerHTML = "";
        let spanHtml = `
                    <span class="help_explan_ico" onmouseover="Bill.showHelpExplan(this)" text="${helpText}"></span><span>${title}</span>
        `
        element.style.display ="flex";
        element.style.justifyContent = "flex-end";
        element.style.alignItems = "center";
        element.className = "fcell";
        element.insertAdjacentHTML("afterbegin", spanHtml);
    }
    //单据详情页的列表里某一区间的多个列按指定顺序重新排序
    function moveDetailCol(detailName, fromColName, toColName, resortCols){
        let jsonData = unsafeWindow.window["lvw_JsonData_" + detailName];
        let vheaders = jsonData.vheaders[0];
        let colnum = vheaders.length;
        let from = -1, to = -1, resortheaders = [];
        for(let i = 0; i < colnum; i++) {
            if(vheaders[i].text == fromColName) from = i;
            if(vheaders[i].text == toColName) to = i;
            if(from!=-1 && to !=-1) break;
        }
        for(let i = 0; i < resortCols.length; i++) {
            for(let j = 0; j < colnum; j++) {
                if(vheaders[j].text == resortCols[i]) {
                    let o = new Object();
                    o.text = vheaders[j].text;
                    o.orginshowindex = j;
                    o.colindex = vheaders[j].colindex;
                    o.showindex = from + i;
                    resortheaders.push(o);
                }
            }
        }
        let rsshowmaps = [];
        for(let i = 0; i < resortheaders.length; i++) {
            rsshowmaps.push(resortheaders[i].colindex);
        }
        jsonData.showmaps.splice(from, to - from + 1, ...rsshowmaps);

        //console.log("lvw_JsonData_" + detailName + JSON.stringify(unsafeWindow.window["lvw_JsonData_" + detailName]));

        if(from == -1 || to == -1 || (resortCols.length!=resortheaders.length) || ((Math.abs(to - from) + 1)!= resortCols.length)) return;

        let detail = document.querySelector("#lvw_dbtable_" + detailName);
        let colgroup = detail.querySelector("colgroup");
        //如果当前行的列数与标题行的列数不相同，则可能是非可见行，不进行处理
        if(colgroup.children.length == colnum) {
            for(let j = 0; j < resortheaders.length; j++) {
                resortheaders[j].insertElement = colgroup.children[resortheaders[j].orginshowindex].cloneNode(true);
                resortheaders[j].removeElement = colgroup.children[resortheaders[j].orginshowindex];
            }
            let anchorElement = (to < (colnum - 1) ) ? colgroup.children[to + 1] : undefined;
            for(let j = 0; j < resortheaders.length; j++) {
                colgroup.removeChild(resortheaders[j].removeElement);
            }
            for(let j = 0; j < resortheaders.length; j++) {
                if(anchorElement)
                    colgroup.insertBefore(resortheaders[j].insertElement, anchorElement);
                else
                    colgroup.insertAdjacentElement("beforeend", resortheaders[j].insertElement);
            }
        }
        let rows = detail.rows;
        for(let i = 0; i < rows.length; i++) {
            let tds = rows[i].cells;
            if(tds[0].tagName=="TH") {
                for(let j = 0; j < resortheaders.length; j++) {
                    let cloneElement = rows[i].children[resortheaders[j].orginshowindex].cloneNode(true);
                    cloneElement.setAttribute("realindex", resortheaders[j].showindex);
                    cloneElement.onmousemove = function() {
                        $(this).TableColResize(function(){ListView.OnColResize(detailName,resortheaders[j].colindex, resortheaders[j].showindex);})
                    };
                    cloneElement.className = `lvwheader h_1 l_${resortheaders[j].showindex+1} lvw_header_freeze`;
                    let btnFreeze = cloneElement.querySelector("div > button");
                    if(btnFreeze) {
                        btnFreeze.id = detailName + "_freezeIcon_" + resortheaders[j].showindex;
                        btnFreeze.onclick = function() {
                            //console.log("detailName=" + detailName + ",colindex=" + resortheaders[j].colindex);
                            ListView.ApplyCurrFixedCol(detailName, resortheaders[j].colindex,this,1);
                        };
                    }
                    resortheaders[j].insertElement = cloneElement;
                    resortheaders[j].removeElement = rows[i].children[resortheaders[j].orginshowindex];
                }
                 let anchorElement = (to < (colnum - 1) ) ? rows[i].children[to + 1] : undefined;
                //不能在上面的循环删除元素，因为删除一个元素后索引可能会变
                for(let j = 0; j < resortheaders.length; j++) {
                    rows[i].removeChild(resortheaders[j].removeElement);
                }
                for(let j = 0; j < resortheaders.length; j++) {
                    if(anchorElement)
                        rows[i].insertBefore(resortheaders[j].insertElement, rows[i].children[resortheaders[j].showindex]);
                    else
                        rows[i].insertAdjacentElement("beforeend", resortheaders[j].insertElement);
                }
            }else {
                if(rows[i].children.length!=colnum) continue;//如果当前行的列数与标题行的列数不相同，则可能是非可见行，不进行处理
                for(let j = 0; j < resortheaders.length; j++) {
                    resortheaders[j].insertElement = rows[i].children[resortheaders[j].orginshowindex].cloneNode(true);
                    resortheaders[j].removeElement = rows[i].children[resortheaders[j].orginshowindex];
                }
                let anchorElement = (to < (colnum - 1) ) ? rows[i].children[to + 1] : undefined;
                for(let j = 0; j < resortheaders.length; j++) {
                    rows[i].removeChild(resortheaders[j].removeElement);
                }
                for(let j = 0; j < resortheaders.length; j++) {
                    if(anchorElement)
                        rows[i].insertBefore(resortheaders[j].insertElement, anchorElement);
                    else
                        rows[i].insertAdjacentElement("beforeend", resortheaders[j].insertElement);
                }
            }
        }
    }
    //获取预期收款客户信息
   function getcustomers(url, data, callback) {
      var xhr = new XMLHttpRequest();
      xhr.open("POST", url, true);
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.send(JSON.stringify(data.cus));
      xhr.onreadystatechange = function() {
      if (xhr.readyState === 4 && xhr.status === 200) {
        callback(xhr.responseText);
      }
    };
   }
    function handleButtonClick() {
    alert('该用户欠款超过规定时间，无法出库!');
    return;
   }
    //日志上报
    if(href.indexOf("/sysn/view/init/home.ashx") != -1) {
        let user = unsafeWindow.top.window.UserInfo;
        let url = "https://api.leadfluid.net/l.gif?user=" + user.Name + "&ver=" + scriptVer + "&key=" + new Date().getTime();
        GM_xmlhttpRequest({
            url: url,
            method :"GET",
            onload:function(xhr){}
        });
    }
    //显示LF-ERP-User-Enhance标记
    else if(href.indexOf("/sysn/view/init/login.ashx") != -1) {
        let divHtml = `
            <div >Enhance by LF，ver：${scriptVer}</div>
        `
        document.querySelector("#mb_cont").insertAdjacentHTML("beforeend", divHtml);
        //down_bg
        let divHtmlTitle= `
 <div style="position:absolute;right:50px;top:5px;width:40%;height:100%; padding: 10px;"><a href="https://alidocs.dingtalk.com/i/nodes/6LeBq413JAzPdYZdSXrRdbgO8DOnGvpb" target="_blank"> 《APP使用手册》</a></div>
        `
        document.querySelector("#cont_body > div.main-foot > div").insertAdjacentHTML("afterend", divHtmlTitle);
    }
    //来料送检单据“质检负责人”为必填项
	else if(href.indexOf("/sysn/view/producev2/outsourceinspection/addinspection.ashx") != -1) {
        adjustAlwaysRequiredField("Inspector");
        if(href.indexOf("view=details") == -1){
        adjustDetailOcmmCol("sjcpList","order1");
       }
    }
    //委外质检增加对质检结果字段的说明
    else if(href.indexOf("/sysn/view/producev2/qualitycontrol/qcexecbill.ashx") != -1) {
        let helpText = `
            当质检有部分不合格时：
            <ol>
                <li>选择'合格'则视为让步接收；</li>
                <li>选择'不合格'则不合格产品不入库</li>
            </ol>
        `
        let spanHtml = `
            <div class="billfieldunitdom">
                <span style="float:right;position:absolute;top:11px">
                    <span class="help_explan_ico" onmouseover="Bill.showHelpExplan(this)" text="${helpText}"></span>
                </span>
            </div>
        `
        //document.querySelector("#QTResult_div").insertAdjacentHTML("beforeend", spanHtml);
        insertSysnMasterFieldHelp('#editbody > tbody > tr[dbname=QCResultgp] + tr + tr > td:first-child', helpText);
    }
    //预购单据增加对一码多物产品必填“一码多物备注”字段的判断
    else if(href.indexOf("/sysn/view/store/yugou/yugou.ashx") != -1) {
        if(href.indexOf("&view=details") == -1) {//详情页不需要显示帮助和支持"一码多物"
            insertTitleSectionHelp("#comm_itembarText","点击此链接，查看预购单填写说明（未完成）", "https://alidocs.dingtalk.com/i/nodes/vy20BglGWOe9pXwptwXG05ldJA7depqY");
            adjustDetailOcmmCol("yugoulist", "Order1");
        }
    }
    //派工单需要对“一码多物备注”字段进行必填校验
    else if(href.indexOf("/sysn/view/producev2/workassign/addworkassign.ashx") != -1) {//生产派工
        //派工产品如果是一码多物产品则“一码多物备注”字段不能为空
        Bill.originDataVerification = Bill.DataVerification;
        Bill.DataVerification = function(...args) {
            adjustConditionRequiredField("\\@sys_mforlist_InheritId_id_15357", isOcmmProduct(document.querySelector("#probh_0").value));
            return Bill.originDataVerification.call(this, ...args);
        };
        //所需物料如果是一码多物产品则“一码多物备注”字段不能为空
        adjustDetailOcmmCol("MaterialRegister", "bh");
    }
    //采购单需要对“一码多物备注”字段进行必填验证
    else if(href.indexOf("/sysn/view/store/caigou/caigou.ashx") != -1)
    {
        if(href.indexOf("view=details") == -1) {
        adjustDetailOcmmCol("caigoulist","order1");
       }
    }

    //合同页面添加的产品如果是一码多物的，需要提示一码多物的说明为必填项
    else if(href.indexOf("/sysn/view/sales/contract/contract.ashx")!=-1)
    {
        if(href.indexOf("view=details") == -1) {
        adjustDetailOcmmCol("contractlist","order1");
        }
    }
    //调整采购单详情中采购明细的“数量”字段的位置
    else if(href.indexOf("/sysn/view/store/caigou/caigoudetails.ashx") != -1) {//采购单详情
        moveDetailCol("caigoulist", "报废数量", "数量", ["数量","报废数量","可入库数量","入库申请数量","入库数量"]);
    }
    //产品列表中图片用新窗口查看以便能显示完整照片
    else if(href.indexOf("/sysn/view/sales/product/productalllist.ashx") != -1) {
        let opener = unsafeWindow.window.baseWindowOpen ? unsafeWindow.window.baseWindowOpen : unsafeWindow.window.open;

        elmGetter.each('#lvw_dbtable_MainList > tbody > tr > td:nth-child(2) > img', document, function open(element, isInserted) {
            element.onclick = function() {
                opener(this.src.replace("&size=small", ""), ("W" + (new Date()).getTime()).replace(".", ""), "width=1200px,height=700px,fullscreen =no,scrollbars=1,toolbar=0,resizable=1,left=" + (90 + Math.random() * 20) + "px,top=" + (60 + Math.random() * 20) + "px", true);
           };
        });
     document.querySelector("#ad_scarch_tb > tbody > tr:nth-child(11) > td.rpt_af_lb").textContent = "图片与附件(产品备注)：";
    }
    //费用申请
    else if(href.indexOf("/sysa/pay/addsq.asp") != -1) {
        //标题栏插入业务单据帮助链接
        insertTitleSectionHelp("#demo > table > tbody > tr:nth-child(1) > td > table:nth-child(1) > tbody > tr > td.place", "点击此链接，查看费用申请填写说明（未完成）", "https://alidocs.dingtalk.com/i/nodes/Gl6Pm2Db8D3PKZnKuz3Y64YpJxLq0Ee4");
        let titleHelp = `
            主题格式必须为：“**中心-[**部]-[具体事项]”，举例：“营销中心-内贸销售部-差旅费”，其中：
            <ul style='margin:0em'>
                <li>中&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;心：营销中心/技术中心/生产中心/人力行政中心/财务中心</li>
                <li>部&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;门：内贸销售/外贸销售/技术支持部/市场部/实验室/技术综合部/生产部/采购//仓储/质检/机加车间/人力资源/行政/信息部/财务</li>
            </ul>
        `;
        insertSysaMasterFieldHelp('#content > tbody > tr:nth-child(2) > td:nth-child(1) > div', titleHelp);
        let borrowHelp = `
            根据付款和票据取得的时间先后选择是否借款：
            <ol style='margin:0em'>
                <li>公司先行支付款项，正式票据在付款后收到时</li>
                <ul>
                    <li>按照申请金额一次付款的，是否借款选择（是）</li>
                    <li>付款分两次及以上，是否借款选择（否）</br>另需要付款时再单独添加费用借款，借款主题与费用申请主题保持一致</li>
                </ul>
                <li>先收到正式票据后付款的，是否借款选择（否）</li>
            </ol>
        `
        insertSysaMasterFieldHelp('#content > tbody > tr:nth-child(4) > td:nth-child(1) > div', borrowHelp);
    }
    //费用使用
    else if(href.indexOf("/sysa/pay/add2.asp") != -1) {
        insertTitleSectionHelp("#demo > table > tbody > tr:nth-child(1) > td > table:nth-child(1) > tbody > tr > td.place", "点击此链接，查看费用使用填写说明（未完成）", "https://alidocs.dingtalk.com/i/nodes/Gl6Pm2Db8D3PKZnKuz3Y64YpJxLq0Ee4");
    }
    //费用报销
    else if(href.indexOf("/sysa/pay/add.asp") != -1) {
        insertTitleSectionHelp("#demo > table > tbody > tr:nth-child(1) > td > table:nth-child(1) > tbody > tr > td.place", "点击此链接，查看费用报销填写说明（未完成）", "https://alidocs.dingtalk.com/i/nodes/Gl6Pm2Db8D3PKZnKuz3Y64YpJxLq0Ee4");
    }
    //费用借款
    else if(href.indexOf("/sysa/pay/addgr.asp") != -1) {
        insertTitleSectionHelp("body > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td.place", "点击此链接，查看费用借款填写说明（未完成）", "https://alidocs.dingtalk.com/i/nodes/Gl6Pm2Db8D3PKZnKuz3Y64YpJxLq0Ee4");
    }
    //费用返还
    else if(href.indexOf("/sysa/pay/addfh.asp") != -1) {
        insertTitleSectionHelp("body > table > tbody > tr:nth-child(1) > td > table > tbody > tr > td.place", "点击此链接，查看费用返还填写说明（未完成）", "https://alidocs.dingtalk.com/i/nodes/Gl6Pm2Db8D3PKZnKuz3Y64YpJxLq0Ee4");
    }
    else if(href.indexOf("/sysn/view/attendance/attendancemanage/addapply.ashx") != -1) {
        insertTitleSectionHelp("#comm_itembarText", "点击此链接，查看考勤申请填写说明（未完成）", "https://alidocs.dingtalk.com/i/nodes/o14dA3GK8g5roGboCZ0MR9Y4V9ekBD76");
    }
    //产品详情 //产品添加页
    else if(href.indexOf("/sysa/product/content.asp")!=-1 || href.indexOf("/sysa/product/add.asp")!=-1)
    {
        let rows =document.querySelectorAll('#content tr');
        rows.forEach(function(row) {
            // 获取当前行中的所有单元格
            let cells = row.querySelectorAll('td div');//#content > tbody > tr:nth-child(24) > td:nth-child(1) > div
            // 遍历每一个单元格
            cells.forEach(function(cell) {
            // 在这里处理每个单元格
           if(cell.textContent=="图片与附件：")
           {
              cell.textContent="图片与附件(产品备注)：";
           }
         });
        });
    }
    //库存预警
    else if(href.indexOf("/sysn/view/store/kuwarn/warnproductlist.ashx")!=-1)
    {
        document.querySelector("#ad_scarch_tb > tbody > tr:nth-child(12) > td.rpt_af_lb").textContent = "";
          let spanHtml = `
                    图片与附件：<br/>(产品备注)&nbsp;&nbsp;&nbsp;
        `
        document.querySelector("#ad_scarch_tb > tbody > tr:nth-child(12) > td.rpt_af_lb").insertAdjacentHTML("afterbegin", spanHtml);
    }
    //超期收款的客户，禁止出库申请
    else if(href.indexOf("/sysn/view/sales/contract/contractsimplelist.ashx")!=-1)
    {
        //点击检索按钮后，禁用相应按钮
        elmGetter.each('#lvw_dbtable_MainList > tbody > tr > td:nth-child(12) > input:nth-child(2)', document, function open(element, isInserted) {
            if(element!=null && element.value=="出库申请")
            {
                let pathurl=element.parentNode.parentNode.querySelector("td:nth-child(3)> a:nth-child(1)").getAttribute("onclick");
                let start=pathurl.indexOf("ord=")+4;
                let end=pathurl.indexOf("',");
                let customerid=pathurl.substr(start,end-start);
                let url = "http://121.18.51.58:85/api/Customer/getcustomer_byid";
                let data = { "cus": customerid };
                getcustomers(url, data, function(response) {
                   if(Number(response)>0 )
                  {
                      //element.disabled = true;
                      element.style.color = 'grey';
                      element.removeAttribute('onclick');
                      element.addEventListener('click', handleButtonClick);
                  }
                });
            }
        });
    }
    //禁用合同详细页面的“申请出库”按钮(应收款超期客户的合同)
    else if(href.indexOf("/sysn/view/sales/contract/contractdetails.ashx")!=-1)
    {
         let pathurl=decodeURIComponent(document.querySelector("#CompanyLink_fbg > div > a").getAttribute("onclick"));//将URL中的乱码转成文字
         let start=pathurl.indexOf("ord=")+4;
         let end=pathurl.indexOf("\')");
         let customerid=pathurl.substr(start,end-start);
         let url = "http://121.18.51.58:85/api/Customer/getcustomer_byid";
         let data = { "cus": customerid };
         getcustomers(url, data, function(response) {
              if(Number(response)>0 )
              {
                let btn=document.getElementById("btnKuout_btn");
                btn.style.color = 'grey';
                btn.removeAttribute('onclick');
                btn.addEventListener('click', handleButtonClick);
               // btn.disabled = true;
              }
             });
    }
	//报价添加界面指字字段增加必填限制功能
	else if(href.indexOf("/sysn/view/sales/price/price.ashx")!=-1)
	{
		adjustConditionRequiredField("Intro3",true);
		adjustConditionRequiredField("Intro5",true);
		adjustConditionRequiredField("Intro4",true);
		adjustConditionRequiredField("Intro2",true);
	}
})();