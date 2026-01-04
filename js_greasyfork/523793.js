// ==UserScript==
// @name         绿化UGG
// @namespace    http://tampermonkey.net/
// @version      1.4
// @description  针对指定网站禁用页面部分元素
// @author       as176590811
// @match        *://www.uu-gg.one./*
// @match        *://www.uu-gg.one/*
// @match        *://uu-gg.work.gd/*
// @match        *://uu-gg.work.gd./*
// @match        *://uu-gg.run.place./*
// @match        *://uu-gg.run.place/*
// @match        *://uu-gg.linkpc.net./*
// @match        *://uu-gg.linkpc.net/*
// @match        *://uu-gg.ggff.net./*
// @match        *://uu-gg.ggff.net/*
// @license     GPL License
// @icon        data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAMMOAADDDgAAAAAAAAAAAAD58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//fx7v/27+z/9u/s//fw7f/38e7/9u/t//bv7P/27+z/+PHu//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//fx7v/38O3//vn1/////P////z///35///59v///fr////8/////P/+9/T/9+/s//jx7v/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//37+z//Pf0///9+f/c1tT/p6Kg/4OAf/91cXL/aGVl/3l2df+GhYL/ramm/+Pd2f///vv/+/bz//fv7P/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//9u/s///8+P/i3tv/dHJw/zIzNP8oKSn/Jygo/yQlJf8lJib/IyQk/yUmJv8pKSr/Nzk6/3h2dv/m4d////z5//bv7P/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//fv7P///Pj/zcrG/zw7PP8mJib/NDQ0/yoqK/8uLS7/Pz4//0RDQ/9DQkL/NDQ1/ygoKf8vLy//JiYm/0NCQv/Szsr///z4//fw7f/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//48e7//vf0/+Xh3f8/Pj7/LC0t/zU1Nv8tLi7/dXRy/8bAv//l4N3/7efj/+vl4f/Uz83/nJqY/z8/Pv8vLzD/Li4u/zc3N//b19P///j1//fw7f/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//fw7f///vr/dnVz/yUlJv82Njb/NDQ0/8C6t/////z//vz5//328//89fL//fXy//759v//////5eDc/1FQUP8vLzD/KCgo/21sa////fr/9/Dt//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//48e7///j1/93a1f81NTX/NjY1/yYnJ/+jop////////Xt6v/27+z/+PHu//jx7v/48e7/9/Dt//Tt6v///fr/3dnV/zo6Of8yMjL/MjMy/9XRzv//+fb/9/Dt//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//bv7P////z/pKGf/ycnKP8vLy//UVJP//fz8P/48e7/+PHu//ny7//58u//+fLv//ny7//58u//+fLv//Tt6v////7/hoOD/ykpKf8nKCj/k5GO/////f/27+z/+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//9u/s/////P+Cf37/KSkq/ygoKP+XlZL////8//bu7P/58u//+fLv//ny7//58u//+fLv//ny7//58u//9/Dt///8+f/Ev73/LS0t/yorK/9jYWH///n3//fw7f/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//48e7///n2/2RjYv8rKyv/LC0t/8O+vP///Pn/9/Dt//ny7//58u//+fLv//ny7//58u//+fLv//ny7//48e7//vbz/+Tg3P88PDz/LCwt/0dHR//w6uf//PTx//jx7v/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//jx7v//+fT/Xlxc/yoqKv8yMzL/1c/M///69//38O3/+fLv//ny7//58u//+fLv//ny7//58u//+fLv//jx7v/89PH/7+nm/0VFRv8sLCz/Pj4+/+ni3v/99vP/+PHu//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//v18P9YV1f/KSkp/zw9PP/k3tr//vf0//jx7v/58u//+fLv//ny7//58u//+fLv//ny7//58u//+PLu//rz8P/17+v/UE9O/ywsLP83Nzb/3NXR///59f/38O7/+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58+//+PLt/1RSU/8pKir/PT49/+fg3f/99vP/+PHu//ny7//58u//+fLv//ny7//58u//+fLv//ny7//48u//+vPw//bw7P9RUFD/LS0t/zIyMf/Vzsr///r3//fw7f/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//nz7//58u3/VFNT/ykqKv89Pj3/5uDc//728//48e7/+fLv//ny7//58u//+fLv//ny7//58u//+fLv//jy7//68/D/9vDs/1FQT/8tLS3/MjIx/9XPyv//+vf/9/Dt//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fPv//ny7f9UU1P/KSoq/z0+Pf/n4Nz//vbz//jx7v/58u//+fLv//ny7//58u//+fLv//ny7//58u//+PLv//rz8P/28Oz/UVBQ/y0tLf8yMjH/1c/K///69//38O3/+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58+//+fLt/1RTU/8pKir/PT49/+fg3P/+9vP/+PHu//ny7//58u//+fLv//ny7//58u//+fLv//ny7//48u//+vPw//bw7P9RUFD/LS0t/zIyMf/Vz8r///r3//fw7f/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//nz7//58u3/VFNT/ykqKv89Pj3/5+Dc//728//48e7/+fLv//ny7//58u//+fLv//ny7//58u//+fLv//jy7//68/D/9vDs/1FQUP8tLS3/MjIx/9XPyv//+vf/9/Dt//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fPv//ny7f9UU1P/KSoq/z0+Pf/n4Nz//vbz//jx7v/58u//+fLv//ny7//58u//+fLv//ny7//58u//+PLv//rz8P/28Oz/UVBQ/y0tLf8yMjH/1c/K///69//38O3/+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58+//+fLt/1RTU/8pKir/PT49/+fg3P/+9vP/+PHu//ny7//58u//+fLv//ny7//58u//+fLv//ny7//48u//+vPw//bw7P9RUFD/LS0t/zIyMf/Vz8r///r3//fw7f/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//nz7//58u3/VFNT/ykqKv89Pj3/5+Dc//728//48e7/+fLv//ny7//58u//+fLv//ny7//58u//+fLv//jy7//68/D/9vDs/1FQUP8tLS3/MjIx/9XPyv//+vf/9/Dt//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fPv//ny7f9UU1P/KSoq/z0+Pf/n4Nz//vbz//jx7v/58u//+fLv//ny7//58u//+fLv//ny7//58u//+PLv//rz8P/28Oz/UVBQ/y0tLf8yMjH/1c/K///69//38O3/+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58+//+fLt/1RTU/8pKir/PT49/+fg3P/+9vP/+PHu//ny7//58u//+fLv//ny7//58u//+fLv//ny7//48u//+vPw//bw7P9RUFD/LS0t/zIyMf/Vz8r///r3//fw7f/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//nz7//58u3/VFNT/ykqKv89Pj3/5+Dc//728//48e7/+fLv//ny7//58u//+fLv//ny7//58u//+fLv//jy7//68/D/9vDs/1FQUP8tLS3/MjIx/9XPyv//+vf/9/Dt//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fPv//ny7f9UU1P/KSoq/z0+Pf/n4Nz//vbz//jx7v/58u//+fLv//ny7//58u//+fLv//ny7//58u//+PLv//rz8P/28Oz/UVBQ/y0tLf8yMjH/1c/K///69//38O3/+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58+//+fLt/1RTU/8pKir/PT49/+fg3P/+9vP/+PHu//ny7//58u//+fLv//ny7//58u//+fLv//ny7//48u//+vPw//bw7P9RUFD/LS0t/zIyMf/Vz8r///r3//fw7f/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//nz7//58u3/V1VV/ywtLf9AQED/5+Dd//328//48e7/+fLv//ny7//58u//+fLv//ny7//58u//+fLv//jy7//68/D/9vDs/1NSUv8wMDD/NTQ0/9bPyv//+vf/9/Dt//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fPv//ny7f9KSUn/HB0d/zEyMv/l39z//vf0//jx7v/58u//+fLv//ny7//58u//+fLv//ny7//58u//+PLu//rz8P/18Oz/RUVG/yAgIf8mJSX/08zI///6+P/38O3/+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLu/46Liv9ycG//f318/+3m4//89fL/+PHu//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+vLw//fx7f+Lion/dHJx/3h2dP/i29j//vf0//jx7v/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u///vv4///++////fn/+vPw//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv///8+P///vr///76//r08f/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//38O3/9u/s//bv7f/58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//+fLv//ny7//58u//9/Dt//bv7P/27+z/+PHu//ny7//58u//+fLv//ny7//58u//AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/523793/%E7%BB%BF%E5%8C%96UGG.user.js
// @updateURL https://update.greasyfork.org/scripts/523793/%E7%BB%BF%E5%8C%96UGG.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const a_uggElement = document.querySelector('#hd .wp .a_ugg_mu');
    if (a_uggElement) {
        a_uggElement.style.display = "none";
        console.log("隐藏了a_ugg_mu元素");
    }

    const scbarElement = document.querySelector('#scbar_hot');
    if (scbarElement) {
        scbarElement.style.display = "none";
        console.log("隐藏了scbar_hot元素");
    }

    const topElement = document.querySelector('#hd #wp .cl #toptable #top-content');
    if (topElement) {
        topElement.style.display = "none";
        console.log("隐藏了top-content元素");
    }

    const flBmElement = document.querySelector('#hd #wp #ct .fl.bm');
    if (flBmElement) {
        flBmElement.style.display = "none";
        console.log("隐藏了.fl.bm元素");
    }

    const zBmElement = document.querySelector('#toptb .wp .z');
    if (zBmElement) {
        zBmElement.style.display = "none";
        console.log("隐藏了.z元素");
    }

    const wolfElement = document.querySelector('#hd #wp form#postform #ct.ct2_a.ct2_a_r.wp.cl #editorbox.bm.bw0.cl #postbox #wolfcodepostwarn_div');
    if (wolfElement) {
        wolfElement.style.display = "none";
        console.log("隐藏了第一个wolfcodepostwarn_div元素");
    }

    const wolfcodepostwarnElement = document.querySelector('#hd #wp #ct #f_pst .plc #wolfcodepostwarn_div');
    if (wolfcodepostwarnElement) {
        wolfcodepostwarnElement.style.display = "none";
        console.log("隐藏了第二个wolfcodepostwarn_div元素");
    }

    const textareaElement = document.querySelector('#hd #wp #ct #f_pst .plc .cl .area #fastpostmessage');
    if (textareaElement) {
        textareaElement.placeholder = '';// 清除placeholder中的文本
        console.log("清除了placeholder中的内容");
    }

    const clElement = document.querySelector('#hd #wp #ct #f_pst .plc .cl');
    if (clElement) {
        clElement.style.display = "none";
        console.log("隐藏了cl元素");
    }

    const pbnElement = document.querySelector('#hd #wp .boardnav #ct .mn .bm.bml.pbn');
    if (pbnElement) {
        pbnElement.style.display = "none";
        console.log("隐藏了bm bml pbn元素");
    }

    const bm_hElement = document.querySelector('#hd #wp .boardnav #ct .mn .bm.bmw .bm_h.cl');
    if (bm_hElement) {
        bm_hElement.style.display = "none";
        console.log("隐藏了bm_h cl元素");
    }

    const bm_cElement1 = document.querySelector('#hd #wp .boardnav #ct .mn .bm.bmw .bm_c.cl');
    if (bm_cElement1) {
        bm_cElement1.style.display = "none";
        console.log("隐藏了bm_c cl元素");
    }

    const observer = new MutationObserver(() => {
        const modalElement1 = document.querySelector('#modal');
        if (modalElement1) {
            modalElement1.style.display = "none";
            console.log("隐藏了modal元素");
        }
    });

    // 监控整个文档的变化
    observer.observe(document, { childList: true, subtree: true });

})();