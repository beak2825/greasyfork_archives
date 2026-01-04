// ==UserScript==
// @name         B站动态按照日期归类
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  B站动态按照日期归类。仅作为DD调研用（考古也算的话），若有滥用等问题概不负责诶嘿。
// @author       太陽闇の力
// @include      /https?:\/\/space\.bilibili\.com/
// @grant        GM_addStyle
// @grant    GM_registerMenuCommand
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/439944/B%E7%AB%99%E5%8A%A8%E6%80%81%E6%8C%89%E7%85%A7%E6%97%A5%E6%9C%9F%E5%BD%92%E7%B1%BB.user.js
// @updateURL https://update.greasyfork.org/scripts/439944/B%E7%AB%99%E5%8A%A8%E6%80%81%E6%8C%89%E7%85%A7%E6%97%A5%E6%9C%9F%E5%BD%92%E7%B1%BB.meta.js
// ==/UserScript==

(function() {
    let flag = true;
    let flag2 = true;
    GM_registerMenuCommand("启动归类",async()=>{
        if(!flag)return;
        let cardList={};
        let dateList = [];
        const uid = /\d+/.exec(location.pathname)[0];
        const relation={"DYNAMIC_TYPE_WORD":"文本","DYNAMIC_TYPE_DRAW":"图片","DYNAMIC_TYPE_AV":"视频","DYNAMIC_TYPE_FORWARD":"转发","DYNAMIC_TYPE_LIVE_RCMD":"直播","DYNAMIC_TYPE_ARTICLE":"专栏","DYNAMIC_TYPE_COMMON_VERTICAL":"漫画","DYNAMIC_TYPE_COURSES_SEASON":"课程","DYNAMIC_TYPE_MUSIC":"音乐","DYNAMIC_TYPE_COMMON_SQUARE":"H5页"}
        let offset = "";
        do{
            let url = `https://api.bilibili.com/x/polymer/web-dynamic/v1/feed/space?offset=${offset}&host_mid=${uid}`
            let res =await fetcher(url);
            for (let item of res.data.items){
                const cardType = relation[item.type]||"未知";
                const cardId = item.id_str;
                const cardTime = item.modules.module_author.pub_ts*1000;
                const cardDate = fmtDate(cardTime);
                const content = item.modules.module_dynamic?.desc?.text||item.modules.module_dynamic.major?.archive?.title||item.modules.module_dynamic.major?.article?.title||item.modules.module_dynamic.major?.common?.title||JSON.parse(item.modules.module_dynamic?.major?.live_rcmd?.content||'{}')?.live_play_info?.title||item.modules.module_dynamic.major?.music?.title||item.modules.module_dynamic.major?.courses?.title;
                if(!cardList[cardDate]){
                    cardList[cardDate] = [];
                }
                cardList[cardDate].push([cardId,content,cardType]);
                dateList.push(cardTime);
            }
            offset = res.data.offset;
        }while(offset!="");
        if(dateList.length>1){
            if(dateList[0]<dateList[1]){
                let temp = dateList[0];
                dateList[0] = dateList[1];
                dateList[1] = temp;
            }
        }
        dateList = dateList.map(fmtDate);
        function fmtDate(obj){
            var date = new Date(obj);
            var y = 1900+date.getYear();
            var m = "0"+(date.getMonth()+1);
            var d = "0"+date.getDate();
            return y+"-"+m.substring(m.length-2,m.length)+"-"+d.substring(d.length-2,d.length);
        }
        async function fetcher(url) {
            const res = await fetch(url)
            if (!res.ok) {
                throw new Error(res.statusText)
            }
            const data = await res.json()
            if (data.code != 0) {
                throw new Error("B站API请求错误:" + data.message)
            }
            return data
        }
        GM_addStyle(`
    * {
			margin: 0;
			padding: 0;
		}

		ul {
			list-style: none;
		}

		#schedule-box {
			width: 320px;
			margin-bottom: 10px;
			padding: 10px 20px;
			font-size: 13px;
		}

		.schedule-hd {
			display: flex;
			justify-content: space-between;
			padding: 0 15px;
		}

		.today {
			flex: 1;
			text-align: center;
		}

		.ul-box {
			overflow: hidden;
		}

		.ul-box>li {
			float: left;
			width: 14.28%;
			text-align: center;
			padding: 5px 0;
		}

		.other-month {
			color: #999999;
		}

		.disabled {
			pointer-events: none;
			background-color: #eeeeee;
			color: #999999;
		}

		.current-month {
			color: #333333;
		}

		.today-style {
			border-radius: 50%;
			background: #58d321;
		}

		.arrow {
			cursor: pointer;
		}

		.dayStyle {
			display: inline-block;
			width: 35px;
			height: 35px;
			border-radius: 50%;
			text-align: center;
			line-height: 35px;
			cursor: pointer;
		}

		.current-month>.dayStyle:hover {
			background: #ffba5a;
			color: #ffffff;
		}

		.today-flag {
			background: #00C2B1;
			color: #fff;
		}

		.boxshaw {
			box-shadow:2px -4px 15px 2px #e3e3e3;
		}

		.selected-style {
			background-color: #00BDFF;
			color: #ffffff;
		}
        .active-style {
			background: #ffba5a;
			color: #ffffff;
		}


		.today {
			text-align: center;
			color: #8ac6d1;
			padding: 5px 0 0;
			font-weight: bold;
			cursor: pointer;
			font-size: 15px;
		}
  @font-face {font-family: "iconfont";
}

.iconfont {
  font-family:"iconfont" !important;
  font-size:16px;
  font-style:normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.icon-115rightarrowheads:before { content: "▶"; }

.icon-111arrowheadright:before { content: "▷"; }

.icon-116leftarrowheads:before { content: "◀"; }

.icon-112leftarrowhead:before { content: "◁"; }

table {
  font-family: arial, sans-serif;
  border: 1px solid #dddddd80;
  border-radius: 8px;
  border-collapse:separate;
  width: 100%;
}

td{
  border: 0;
  text-align: left;
  padding: 8px;
}
#tdiv::-webkit-scrollbar{
display:none

}

    `
                   )

        var div = document.createElement('div');
        div.style.cssText = 'max-width:360px;position:fixed;top:70px;left:200px;z-index:999;background-color:#ffffffc2;border-bottom-right-radius:8px;border-bottom-left-radius:8px;';

        const closeButton = window.document.createElement('button');
        closeButton.innerText = "ㄨ";
        closeButton.style.cssText = 'float:right;border:none;cursor:pointer;background-color:#ffffffc2;border-radius:1px;color:red;';

        const collapseButton = window.document.createElement('button');
        collapseButton.innerText = "─";
        collapseButton.style.cssText = 'width:13.34px;height:17px;float: right;margin-right:3px;border:none;cursor:pointer;background-color:#ffffffc2;border-radius:1px;';

        var sb = document.createElement('div');
        sb.id = 'schedule-box';
        sb.classList.add('boxshaw');

        var tb = document.createElement('table');
        var tdiv = document.createElement('div');
        tdiv.id = "tdiv";
        tdiv.style.cssText ="max-height:200px;overflow-y:scroll;overflow-x:hidden;"


        tdiv.append(tb)
        div.append(closeButton);
        div.append(collapseButton);
        div.append(sb);
        tdiv.append(tb);
        div.append(tdiv);
        document.body.appendChild(div);

        closeButton.addEventListener("click",()=>{
            div.remove();
            flag = true;
            flag2 = true;
        });


        collapseButton.addEventListener("click",()=>{
            if(flag2){
                sb.style.display = "none";
                tdiv.style.display = "none";
                closeButton.style.display = "none";
                collapseButton.style.height = "20px";
                collapseButton.style.width = "15.7px";
                flag2 = false;
            }else{
                sb.style.display = "block";
                tdiv.style.display = "block";
                closeButton.style.display = "block";
                collapseButton.style.height = "17px";
                collapseButton.style.width = "13.34px";
                flag2 = true;
            }
        });

        var mySchedule = new Schedule({
            el: '#schedule-box',	//容器元素
            disabledBefore: dateList[dateList.length-1],	//禁用此日期之前
            disabledAfter: dateList[0],	//禁用此日期之后
            selectedDate: dateList,	//选中的日期
            showToday: true,	//回到今天
            clickCb: function (date) {
                tb.innerHTML="";
                if(cardList[date]){
                    for(let i of cardList[date]){
                        const cardurl = `https://t.bilibili.com/${i[0]}?tab=2`
                        tb.innerHTML += `<tr><td><a href="${cardurl}" target="_blank">${i[1]}</a></td><td>${i[2]}</td></tr>`;
                    }
                }
            }
        });
        flag = false;
    });



    //工具函数
    //配置合并
    function extend(def, opt, override) {
        for (var k in opt) {
            if (opt.hasOwnProperty(k) && (!def.hasOwnProperty(k) || override)) {
                def[k] = opt[k]
            }
        }
        return def;
    }
    //日期格式化
    function concatDate(y, m, d) {
        var symbol = '-';
        if (m) {
            m = (m.toString())[1] ? m : '0' + m;
        }
        if (d) {
            d = (d.toString())[1] ? d : '0' + d;
        }

        return y + (m ? symbol + m : '') + (d ? symbol + d : '');
    }
    //得到时间戳
    function getTimeStamp(d) {

        var date = new Date(d);

        if (isNaN(date.getTime())) {
            console.error(d + ' is invalid date');
            return '';
        }

        return date.getTime();
    }

    //polyfill
    if (!Array.isArray) {
        Array.isArray = function (arg) {
            return Object.prototype.toString.call(arg) === '[object Array]';
        };
    }
    //过滤非日期，格式化日期
    function filterDate(arr) {

        if(!Array.isArray(arr)) {
            return [];
        }

        arr = arr || [];
        var dateArr = [];

        for (var i = 0; i < arr.length; i++) {

            var item = arr[i];
            var date = new Date(item);

            if (isNaN(date.getTime())) {
                console.error(item + ' is invalid date')
            } else {
                var y = date.getFullYear();
                var m = date.getMonth();
                var d = date.getDate();
                var dateStr = concatDate(y, m + 1, d);
                dateArr.push(dateStr);
            }
        }

        return dateArr;
    }


    function Schedule(opta) {
        var def = {},
            opt = extend(def, opta, true),
            curDate = opt.date ? new Date(opt.date) : new Date(),
            disabledDate = opt.disabledDate ? filterDate(opt.disabledDate) : [],
            selectedDate = opt.selectedDate ? filterDate(opt.selectedDate) : [],
            disabledBefore = opt.disabledBefore ? getTimeStamp(opt.disabledBefore) : '',
            disabledAfter = opt.disabledAfter ? getTimeStamp(opt.disabledAfter) : '',
            showToday = opt.showToday,
            year = curDate.getFullYear(),
            month = curDate.getMonth(),
            currentYear = curDate.getFullYear(),
            currentMonth = curDate.getMonth(),
            currentDay = curDate.getDate(),
            activeDate = '',
            el = document.querySelector(opt.el) || document.querySelector('body'),
            _this = this;
        var bindEvent = function () {
            el.addEventListener('click', function (e) {
                switch (e.target.id) {
                    case 'nextMonth':
                        _this.nextMonthFun();
                        break;
                    case 'nextYear':
                        _this.nextYearFun();
                        break;
                    case 'prevMonth':
                        _this.prevMonthFun();
                        break;
                    case 'prevYear':
                        _this.prevYearFun();
                        break;
                    case 'todayBtn':
                        _this.renderToday();
                        break;
                    default:
                        break;
                };
                if (e.target.className.indexOf('currentDate') > -1) {
                    activeDate = e.target.title;
                    opt.clickCb && opt.clickCb(activeDate);
                    render();
                }
            }, false)
        }
        var init = function () {
            var scheduleHd = '<div class="schedule-hd">' +
                '<div>' +
                '<span class="arrow icon iconfont icon-116leftarrowheads" id="prevYear" ></span>' +
                '<span class="arrow icon iconfont icon-112leftarrowhead" id="prevMonth"></span>' +
                '</div>' +
                '<div class="today"></div>' +
                '<div>' +
                '<span class="arrow icon iconfont icon-111arrowheadright" id="nextMonth"></span>' +
                '<span class="arrow icon iconfont icon-115rightarrowheads" id="nextYear"></span>' +
                '</div>' +
                '</div>'
            var scheduleWeek = '<ul class="week-ul ul-box">' +
                '<li>日</li>' +
                '<li>一</li>' +
                '<li>二</li>' +
                '<li>三</li>' +
                '<li>四</li>' +
                '<li>五</li>' +
                '<li>六</li>' +
                '</ul>'
            var scheduleBd = '<ul class="schedule-bd ul-box" ></ul>';
            var todayBtn = '<div id="todayBtn" class="today">今天</div>'
            el.innerHTML = scheduleHd + scheduleWeek + scheduleBd + (showToday ? todayBtn : '');
            bindEvent();
            render();
        }
        var render = function () {
            var fullDay = new Date(year, month + 1, 0).getDate(), //当月总天数
                startWeek = new Date(year, month, 1).getDay(), //当月第一天是周几
                total = (fullDay + startWeek) % 7 == 0 ? (fullDay + startWeek) : fullDay + startWeek + (7 - (fullDay + startWeek) % 7),//元素总个数
                lastMonthDay = new Date(year, month, 0).getDate(), //上月最后一天
                eleTemp = [];
            for (var i = 0; i < total; i++) {

                var nowDate = concatDate(year, month + 1, (i + 1 - startWeek));
                var nowTimestamp = new Date(nowDate).getTime();
                var isDisbale = disabledDate.indexOf(nowDate) > -1;
                var isSelected = selectedDate.indexOf(nowDate) > -1;

                if (i < startWeek) {

                    eleTemp.push('<li class="other-month"><span class="dayStyle">' + (lastMonthDay - startWeek + 1 + i) + '</span></li>')
                } else if (i < (startWeek + fullDay)) {

                    var addClass = '';
                    if (isDisbale) {
                        addClass = 'disabled'
                    } else {
                        isSelected && (addClass = 'selected-style');
                        activeDate == nowDate && (addClass = 'active-style');
                        concatDate(currentYear, currentMonth + 1, currentDay) == nowDate && (addClass = 'today-flag');
                    }

                    if (disabledBefore && nowTimestamp < disabledBefore) {
                        addClass = 'disabled'
                    }
                    if (disabledAfter && nowTimestamp > disabledAfter) {
                        addClass = 'disabled'
                    }

                    eleTemp.push('<li class="current-month" ><span title=' + nowDate + ' class="currentDate dayStyle ' + addClass + '">' + (i + 1 - startWeek) + '</span></li>')
                } else {

                    eleTemp.push('<li class="other-month"><span class="dayStyle">' + (i + 1 - (startWeek + fullDay)) + '</span></li>')
                }
            }
            el.querySelector('.schedule-bd').innerHTML = eleTemp.join('');
            el.querySelector('.today').innerHTML = concatDate(year, month + 1);
        };
        this.nextMonthFun = function () {
            if (month + 1 > 11) {
                year += 1;
                month = 0;
            } else {
                month += 1;
            }
            render();
            opt.nextMonthCb && opt.nextMonthCb(year, month + 1);
        };
        this.nextYearFun = function () {
            year += 1;
            render();
            opt.nextYeayCb && opt.nextYeayCb(year, month + 1);
        };
        this.prevMonthFun = function () {
            if (month - 1 < 0) {
                year -= 1;
                month = 11;
            } else {
                month -= 1;
            }
            render();
            opt.prevMonthCb && opt.prevMonthCb(year, month + 1);
        };
        this.prevYearFun = function () {
            year -= 1;
            render();
            opt.prevYearCb && opt.prevYearCb(year, month + 1);
        }
        this.renderToday = function () {
            if (year === currentYear && month === currentMonth) {
                return;
            }

            year = currentYear;
            month = currentMonth;
            render();
        }
        init();
    }
})();
