// ==UserScript==
// @name         移除UGG 24小时30秒弹窗
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  禁用页面弹窗和倒计时功能
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
// @downloadURL https://update.greasyfork.org/scripts/523942/%E7%A7%BB%E9%99%A4UGG%2024%E5%B0%8F%E6%97%B630%E7%A7%92%E5%BC%B9%E7%AA%97.user.js
// @updateURL https://update.greasyfork.org/scripts/523942/%E7%A7%BB%E9%99%A4UGG%2024%E5%B0%8F%E6%97%B630%E7%A7%92%E5%BC%B9%E7%AA%97.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 方法一：劫持 checkModal 函数
    if (typeof checkModal === 'function') {
        window.checkModal = function() {
            //console.log('checkModal 功能已禁用.');
        };
    }

    // 方法二：劫持 startCountdown 函数
    if (typeof startCountdown === 'function') {
        window.startCountdown = function() {
            //console.log('startCountdown 功能已禁用.');
        };
    }

    // 方法三：删除弹窗元素
    const observer = new MutationObserver(() => {
        const modal = document.getElementById('modal');
        if (modal) {
            modal.remove(); // 删除弹窗元素
            //console.log('元素已移除.');
        }
    });

    // 开始观察页面中的 DOM 变化
    observer.observe(document.body, { childList: true, subtree: true });

    // 方法四：清除 localStorage 中的相关键值
    localStorage.removeItem('isModalVisible');
    localStorage.removeItem('countdownTime');
    localStorage.removeItem('modalLastShown');
})();
