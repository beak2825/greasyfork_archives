// ==UserScript==
// @name         Google 时光机
// @namespace    http://tampermonkey.net/
// @version      1.3
// @description  随意跳转 Google 不同时间搜索结果
// @author       hzhbest
// @match        https://www.google.com/search?*
// @icon         https://www.google.com/favicon.ico
// @grant        none
// @license      GNU GPLv3 
// @downloadURL https://update.greasyfork.org/scripts/523564/Google%20%E6%97%B6%E5%85%89%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/523564/Google%20%E6%97%B6%E5%85%89%E6%9C%BA.meta.js
// ==/UserScript==

//

(function () {
    'use strict';

    // 根据 location.href 识别日期区间搜索行为
    // https://www.google.com/search?q=AAAA&tbs=cdr%3A1%2Ccd_min%3A4%2F11%2F2012%2Ccd_max%3A4%2F11%2F2013
    // 其中，“q=”后面是关键词，“tbs=”后面是结果过滤，“cdr%3A1%2Ccd_min%3A……%2Ccd_max%3A……”是日期区间的标识
    // 识别搜索关键词 kw 和日期区间始末点（M/D/YYYY，转换前要先转成日期）
    // 构建时光机框【divMain【labelTitle】【labelStart】【inputStart】【labelEnd】【inputEnd】【divBtnGo】】
    // 转换 qiri 和 vsri 为日期格式（yyyy-m-d）文本 qistr 和 vsstr 并放入 inputStart 和 inputEnd 中
    // 点 divBtnGo 时，补全两 input* 中的 *str 为日期格式，并转换为日期数 *ri，与 kw 重组新网址，并当前页面加载

    //const d0 = Date.parse('1970-1-1');
    const msxd = 24 * 60 * 60 * 1000;
    const units = ['天', '周', '月', '年'];
    let divMain = document.body.appendChild(document.createElement('div'));
    divMain.id = 'TM_Main';
    setTimeout(init, 2000);

    let csstxt = `
		.TM_Main {position: fixed; top: 100px; left: 0px; z-index: 100000; background: #fff;
			padding: 4px; border: 1px solid #ddd; font-size: 14pt; width: 150px; overflow: hidden;
			transition: width 0.2s linear 3s;}
		.TM_Main:hover {width: 190px; transition: width 0.2s linear 0s; box-shadow: 0 1px 12px 4px #ccc;}
		.TM_Title {font-size: 15pt; font-weight: bold;}
		.TM_Label {overflow: hidden; white-space: nowrap; display: block; color: #969696; padding-top: 9px;}
		.TM_Input {width: 180px; font-size: larger; border-bottom: 1px solid #cecece;
			border-top: none; border-left: none; border-right: none; margin-bottom: 1px;}
		.TM_Input:hover {border-bottom: 2px solid #878787; margin-bottom: 0px;}
		.TM_ilbox {width: 185px; padding-top: 9px;}
		#TM_last, #TM_unit {display: inline;}
		#TM_last {width: 40px;}
		.TM_Main:hover #TM_last {width: 65px;}
		#TM_unit {width: 45px; margin-left: 5px; outline: none; background: transparent;
			border-bottom: 1px solid #cecece; border-top: none; border-left: none; border-right: none;}
		#TM_unit:hover {border-bottom: 2px solid #878787;}
		.TM_Button {margin:5px; padding: 0px 5px; width: 50px; height: 50px;
			cursor: default; position: absolute; left: 120px; bottom: 3px;
			text-align: center; background: #f5f5f5;}
		.TM_Button:hover {outline: 2px solid #99e; background: #eef; color: black;}
		.TM_Button:active {outline: 2px solid #22f; background: #cce;}
	`;
    addCSS(csstxt);


    function init() {
        let kw, arri;
        let lTitle, lKword, inKword, lLast, inLast, seUnit, lStart, lEnd, inStart, inEnd, divBtnGo;

        lTitle = creaElemIn('label', divMain);
        lKword = creaElemIn('label', divMain);
        inKword = creaElemIn('input', divMain);
        let inlinebox = creaElemIn('div', divMain);
        lLast = creaElemIn('label', inlinebox);
        inLast = creaElemIn('input', inlinebox);
        seUnit = creaElemIn('select', inlinebox);
        units.forEach(unit => {
            let opUnit = creaElemIn('option', seUnit);
            opUnit.value = unit;
            opUnit.innerHTML = unit;
        });
        lStart = creaElemIn('label', divMain);
        inStart = creaElemIn('input', divMain);
        lEnd = creaElemIn('label', divMain);
        inEnd = creaElemIn('input', divMain);
        divBtnGo = creaElemIn('div', divMain);

        lTitle.innerHTML = "Google 时光机";
        lKword.innerHTML = "搜索关键词";
        lLast.innerHTML = "最近：";
        lStart.innerHTML = "开始日期";
        lEnd.innerHTML = "结束日期";
        divBtnGo.innerHTML = "立即穿梭";
        inKword.title = "在此输入关键词，跟随时光机穿梭！";
        inLast.title = "在此输入数字，可用鼠标滚轮增减";
        seUnit.title = "在此选择时间单位，可用鼠标滚轮切换";
        inStart.title = "开始日期，可只输年份或年月，可用鼠标滚轮增减月份";
        inEnd.title = "结束日期，可只输年份或年月，可用鼠标滚轮增减月份";

        inKword.id = 'TM_kword';
        inStart.id = 'TM_start';
        inEnd.id = 'TM_end';
        inLast.id = 'TM_last';
        seUnit.id = 'TM_unit';
        divMain.className = 'TM_Main';
        lTitle.className = 'TM_Title';
        lKword.className = lStart.className = lEnd.className = 'TM_Label';
        lLast.className = 'TM_llast';
        inKword.className = inStart.className = inEnd.className = inLast.className = 'TM_Input';
        inlinebox.className = 'TM_ilbox';
        inLast.value = 1;

        var wheelEvt = "onwheel" in document.createElement("div") ? "wheel" : (document.onmousewheel !== undefined ? "mousewheel" : "DOMMouseScroll");	//compatibility fix for Chrome-core browsers
        inLast.addEventListener(wheelEvt, changenumber);
        inLast.addEventListener('input', refreshLastdate);
        inLast.addEventListener('keypress', submit);
        seUnit.addEventListener(wheelEvt, changeunit);
        seUnit.addEventListener('change', refreshLastdate);
        inStart.addEventListener(wheelEvt, changemonth);
        inEnd.addEventListener(wheelEvt, changemonth);
        inStart.addEventListener('blur', checkdate);
        inEnd.addEventListener('blur', checkdate);
        inStart.addEventListener('keypress', submit);
        inEnd.addEventListener('keypress', submit);
        inKword.addEventListener('keypress', submit);
        divBtnGo.className = 'TM_Button';
        divBtnGo.addEventListener('click', go);

        kw = getkw(location.href);
        inKword.value = decodeURI(kw);

        arri = getds(location.href); //console.log(arri);
        let edate, sdate;
        if (arri.length < 2) {
            sdate = new Date(edate - 180 * msxd);
            edate = new Date();
        } else {
            sdate = numTOdate(arri[0]);
            edate = numTOdate(arri[1]);
        }
        inEnd.value = dateToStr(edate);
        inStart.value = dateToStr(sdate);
    }

    function go() {	//点“穿梭”按钮后以时光机内的关键词和日期进行跳转（若关键词为空则使用当前关键词）
        let inS = document.querySelector('#TM_start');
        let inE = document.querySelector('#TM_end');
        let inK = document.querySelector('#TM_kword');
        let ednum, sdnum;
        ednum = dateTOnum(fulldate(inE.value, true));//console.log(ednum);
        sdnum = dateTOnum(fulldate(inS.value, false));//console.log(sdnum);
        let kw = inK.value || getkw(location.href);
        window.location.href = "https://www.google.com/search?q=" + kw + "&tbs=cdr%3A1%2Ccd_min%3A" + sdnum + "%2Ccd_max%3A" + ednum;
    }

    function changemonth(e) {
        e.preventDefault();
        e.stopPropagation();
        let isend = (e.target.id == 'TM_end') ? true : false;
        let cdate = new Date(fulldate(e.target.value, isend));
        console.log('fulldate(e.target.value): ', fulldate(e.target.value, isend));
        let ddate = dateUnitConv(cdate, wheelToNum(e), "月");
        e.target.value = dateToStr(ddate);
    }

    function changenumber(e) {
        e.preventDefault();
        e.stopPropagation();
        let c = parseInt(e.target.value);
        e.target.value = wheelToNum(e, c);
        refreshLastdate();
    }

    function refreshLastdate() {
        let inS = document.querySelector('#TM_start');
        let inE = document.querySelector('#TM_end');
        let inL = document.querySelector('#TM_last');
        let seU = document.querySelector('#TM_unit');
        let cdate = new Date();
        inE.value = dateToStr(cdate);
        let ddate = dateUnitConv(cdate, -inL.value, seU.value);
        inS.value = dateToStr(ddate);
    }

    function changeunit(e) {
        e.preventDefault();
        e.stopPropagation();
        let seU = e.target;
        let c = seU.selectedIndex;
        c = wheelToNum(e, c);
        if (c >= seU.options.length) {
            c = 0;
        } else if (c < 0) {
            c = seU.options.length - 1;
        }
        seU.selectedIndex = c;
        refreshLastdate();
    }

    function checkdate(e) {
        let t = e.target;
        let d = fulldate(t.value, t.id == "TM_end");
        t.value = dateToStr(d);
    }

    function submit(e) {
        if (e.which == 10 || e.which == 13) {
            go();
        }
    }

    // https://www.google.com/search?q=AAAA&tbs=cdr%3A1%2Ccd_min%3A4%2F11%2F2012%2Ccd_max%3A4%2F11%2F2013
    function getkw(url) {	//从url中提取关键词
        return getUriParam(url, 'q');
    }

    // 
    /** 从url中提取名为【param】的参数的值；提取不到返回空字符
     * @param {string} surl 网址
     * @param {string} param 参数名称
     * @returns {string} 参数值
     */
    function getUriParam(surl, param) {
        var result = surl.match(new RegExp("(\\?|&)" + param + "(\\[\\])?=([^&]*)"));
        return result ? result[3] : '';
    }

    function getds(url) {	//从url中提取日期数数组[qiri,vsri]
        let tbs = getUriParam(url, 'tbs');
        if (!!tbs) return tbs.match(/\d{1,2}\%2F\d{1,2}\%2F\d{4}/g);
    }


    function wheelToNum(e, initval) {
        let v = initval || 0;
        return ((e.deltaY > 0) ? 1 : -1) + v;
    }

    function dateUnitConv(sdate, num, unit) {
        console.log('num: ', num);
        let y = sdate.getFullYear(), m = sdate.getMonth(), d = sdate.getDate();
        switch (unit) {
            case "天":
                return new Date(y, m, d + num);
            case "周":
                return new Date(y, m, d + num * 7);
            case "月":
                console.log('m + num: ', m + num);
                return new Date(y, m + num, d);
            case "年":
                return new Date(y + num, m, d);
        }
    }

    function dateToStr(ddate) {
        return ddate.getFullYear() + "-" + (ddate.getMonth() + 1) + "-" + ddate.getDate();
    }

    function fulldate(str, isend) {		//将文本补全为“yyyy-m-d”格式，并输出日期，其中要补全的文本必须有四位年，可缺日或缺月日，即“yyyy”、“yyyy-m”格式
        let odate, oy, om, od;
        let ard = str.split('-');
        if (ard.length == 1) {			// 只有年的话，非结尾则输出1月1日，结尾输出12月31日
            om = (isend) ? 11 : 0;
            od = (isend) ? 31 : 1;
            odate = new Date(parseInt(str), om, od);
        } else if (ard.length == 2) {	// 只有年月的话，非结尾输出当月1日，结尾输出当月末日（下月0日）
            oy = parseInt(ard[0]);
            om = parseInt(ard[1]) - 1;
            odate = (isend) ? new Date(oy, om + 1, 0) : new Date(oy, om, 1);
        } else {
            odate = new Date(ard[0], ard[1] - 1, ard[2]);		// 年月日皆有则直接输出
        }
        return odate;
    }

    function dateTOnum(odate) {	//日期转换成url的格式
        let d = odate.getDate();
        let m = odate.getMonth();
        let y = odate.getFullYear();
        return (m + 1) + '%2F' + d + '%2F' + y;
    }

    function numTOdate(ds) {	//日数（4%2F11%2F2012）转换为日期对象
        return new Date(ds.replaceAll("%2F", "/"));
    }

    function creaElemIn(tagname, destin) {
        let theElem = destin.appendChild(document.createElement(tagname));
        return theElem;
    }

    function addCSS(css) {
        let stylenode = creaElemIn('style', document.getElementsByTagName('head')[0]);
        stylenode.textContent = css;
        stylenode.type = 'text/css';
        stylenode.id = 'ali_c_toc';
    }




})();