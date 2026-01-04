// ==UserScript==
// @name         SearchTimeMachine 搜索时光机
// @namespace    http://tampermonkey.net/
// @version      0.0.6
// @description  Display time filtering function in the right sidebar. 在右侧栏中显示时间过滤功能
// @author       Exisi
// @license      MIT License
// @match        *://*.baidu.com/s*
// @match        *://*.google.com.*/search*
// @match        *://*.google.com/search*
// @match        *://*.google.com.hk/search*
// @match        *://*.bing.com/*search*
// @match        *://*.yahoo.com/search*
// @match        *://*.yandex.com/search*
// @downloadURL https://update.greasyfork.org/scripts/496729/SearchTimeMachine%20%E6%90%9C%E7%B4%A2%E6%97%B6%E5%85%89%E6%9C%BA.user.js
// @updateURL https://update.greasyfork.org/scripts/496729/SearchTimeMachine%20%E6%90%9C%E7%B4%A2%E6%97%B6%E5%85%89%E6%9C%BA.meta.js
// ==/UserScript==
(function () {
	"use strict";
	const data = [
		{
			name: "bing",
			timeFilterClass: [".b_dropdown div", "b_ans"],
			sideBarElement: "#b_context",
		},
		{
			name: "baidu",
			timeFilterClass: [],
			sideBarElement: "#content_right",
		},
		{
			name: "google",
			timeFilterClass: [],
			sideBarElement: "#rcnt>div:not(#center_col)",
			container: "#rcnt",
		},
		{
			name: "yahoo",
			timeFilterClass: ["#horizontal-bar .last .timefilter-list"],
			sideBarElement: "#right",
		},
		{
			name: "yandex",
			timeFilterClass: [],
			sideBarElement: "#search-result-aside",
		},
	];
	const url = window.location.href;
	const urlParams = new URLSearchParams(window.location.search);
	const type = data.findIndex((item) => url.includes(item.name));

	let filterItem = document.querySelector(data[type].timeFilterClass[0]);
	let sidebar = document.querySelector(data[type].sideBarElement);

	const style = document.createElement("style");
	style.innerHTML = `.form-footer button:hover{ background-color: #f5f5f6 !important;}`;
	document.head.appendChild(style);

	const customRangeFilter = `<div style="margin-top: 10px;font-size: 13px; border-top: 1px solid #ccc;">
		<div style="margin: 10px 0;">自定义范围</div>
		<form id="customDateFilter">
			<div class="form-container" style="display:flex;">
				<input class="filter-date-start" type="date"
					style="border-radius: 2px;border: 1px solid #ddd; line-height: 16px; padding: 5px;" />
				<input class="filter-date-end" type="date"
					style="margin-left: 10px; border-radius: 2px;border: 1px solid #ddd; line-height: 16px; padding: 5px;" />
			</div>
			<div class="form-footer" style="margin: 10px 0; display: flex; justify-content: space-between; align-items: center">
				<span class="validateMessage" style="visibility: hidden; color:red;font-size:12px;">*日期不合法</span>
				<button style="cursor:pointer; padding: 0 10px; min-height: 32px; background-color: #FAFAF9; color: #111; border-radius: 2px; border: 1px solid #ddd;">应用</button>
			</div>
		</form>
	</div>`;

	if (data[type].name == "bing") {
		const cloneFilterItem = filterItem.cloneNode(true);
		cloneFilterItem.style.padding = 0;
		cloneFilterItem.querySelectorAll("a").forEach((item) => {
			item.style.color = "#666";
			item.style.borderRadius = "5px";
			item.addEventListener("mouseover", () => {
				item.style.backgroundColor = "#f5f5f5";
			});
			item.addEventListener("mouseout", () => {
				item.style.backgroundColor = "#ffffff";
			});
		});

		const timeFilterItem = document.createElement("li");
		timeFilterItem.appendChild(cloneFilterItem);
		timeFilterItem.className = data[type].timeFilterClass[1] + " sidebar-filter";
		timeFilterItem.style.marginBottom = "35px";
		timeFilterItem.style.borderRadius = "6px";
		timeFilterItem.style.marginTop = "5px";
		timeFilterItem.style.padding = "10px 20px 5px 20px";
		timeFilterItem.style.border = "1px solid #ddd";

		sidebar.prepend(timeFilterItem);

		const customDateFilter = document.createElement("div");
		customDateFilter.innerHTML = customRangeFilter;
		const innerFilterItem = document.querySelector(data[type].sideBarElement + " .sidebar-filter");
		innerFilterItem.appendChild(customDateFilter);

		const { startDateInput, endDateInput } = validateDateInput();

		const rangeFilterBtn = document.querySelector(".form-footer button");
		rangeFilterBtn.addEventListener("click", (e) => {
			e.preventDefault();
			const startDateText = startDateInput.value;
			const endDateText = endDateInput.value;

			if (!startDateText || !endDateText) {
				return;
			}

			const startDayDiff = getDiffDay(startDateText, "1970/1/1");
			const endDayDiff = getDiffDay(endDateText, "1970/1/1");

			urlParams.set("filters", `ex1:"ez5_${startDayDiff}_${endDayDiff}"`);
			window.location.search = urlParams.toString();
		});
	}

	if (data[type].name == "baidu") {
		style.innerHTML += `.sidebar-filter-list li { background-color: #ffffff; padding: 5px; list-style-type: none; cursor: pointer; } .sidebar-filter-list li:hover { background-color: #f1f4fe; color: #2440b3; }`;

		const filterList = document.createElement("ul");
		filterList.className = "sidebar-filter-list";

		const customDateFilter = document.createElement("div");
		customDateFilter.innerHTML = customRangeFilter;

		const filterSidebarItem = document.createElement("div");
		filterSidebarItem.style.marginBottom = "20px";
		filterSidebarItem.appendChild(filterList);
		filterSidebarItem.appendChild(customDateFilter);

		sidebar.prepend(filterSidebarItem);

		const liUnlimited = document.createElement("li");
		const liOneDay = document.createElement("li");
		const liOneWeek = document.createElement("li");
		const liOneMonth = document.createElement("li");
		const liOneYear = document.createElement("li");

		liUnlimited.textContent = "时间不限";
		liOneDay.textContent = "一天内";
		liOneWeek.textContent = "一周内";
		liOneMonth.textContent = "一月内";
		liOneYear.textContent = "一年内";

		liUnlimited.addEventListener("click", () => {
			urlParams.delete("gpc");
			window.location.search = urlParams.toString();
		});

		const urlParamsEvent = (type) => {
			const now = new Date();
			const curTimestamp = now.getTime().toString().slice(0, -3);

			const timeUnitModifiers = {
				day: (date) => date.setDate(date.getDate() - 1),
				week: (date) => date.setDate(date.getDate() - 7),
				month: (date) => date.setMonth(date.getMonth() - 1),
				year: (date) => date.setFullYear(date.getFullYear() - 1),
			};

			const preTime = timeUnitModifiers[type](now);
			const preTimestamp = preTime.toString().slice(0, -3);

			const rangeTimeStamp = `stf=${preTimestamp},${curTimestamp}|stftype=1`;
			urlParams.set("gpc", rangeTimeStamp);
			window.location.search = urlParams.toString();
		};
		liOneDay.addEventListener("click", () => urlParamsEvent("day"));
		liOneWeek.addEventListener("click", () => urlParamsEvent("week"));
		liOneMonth.addEventListener("click", () => urlParamsEvent("month"));
		liOneYear.addEventListener("click", () => urlParamsEvent("year"));

		filterList.appendChild(liUnlimited);
		filterList.appendChild(liOneDay);
		filterList.appendChild(liOneWeek);
		filterList.appendChild(liOneMonth);
		filterList.appendChild(liOneYear);

		const { startDateInput, endDateInput } = validateDateInput();

		const rangeFilterBtn = document.querySelector(".form-footer button");
		rangeFilterBtn.addEventListener("click", (e) => {
			e.preventDefault();
			const startDateText = startDateInput.value;
			const endDateText = endDateInput.value;

			if (!startDateText || !endDateText) {
				return;
			}

			const startDateTimestamp = new Date(startDateText).getTime().toString().slice(0, -3);
			const endDateTimestamp = new Date(endDateText).getTime().toString().slice(0, -3);

			urlParams.set("gpc", `stf=${startDateTimestamp},${endDateTimestamp}|stftype=2`);
			window.location.search = urlParams.toString();
		});
	}

	if (data[type].name == "google") {
		style.innerHTML += `.sidebar-filter-list li { background-color: #ffffff; padding: 5px; list-style-type: none; cursor: pointer; } .sidebar-filter-list li:hover { background-color: #f1f4fe; color: #2440b3; }`;

		const filterList = document.createElement("ul");
		filterList.className = "sidebar-filter-list";

		const customDateFilter = document.createElement("div");
		customDateFilter.innerHTML = customRangeFilter;

		const filterSidebarItem = document.createElement("div");
		filterSidebarItem.style.marginBottom = "20px";
        filterSidebarItem.style.width = "372px";
		filterSidebarItem.appendChild(filterList);
		filterSidebarItem.appendChild(customDateFilter);

		if (!sidebar) {
			sidebar = document.createElement("div");
			sidebar.style.width = "372px";
			sidebar.style.marginLeft = "76px";
			const container = document.querySelector(data[type].container);
			container.appendChild(sidebar);
		}
		sidebar.appendChild(filterSidebarItem);

		const liUnlimited = document.createElement("li");
		const liOneHour = document.createElement("li");
		const liOneDay = document.createElement("li");
		const liOneWeek = document.createElement("li");
		const liOneMonth = document.createElement("li");
		const liOneYear = document.createElement("li");

		liUnlimited.textContent = "时间不限";
		liOneHour.textContent = "过去 1 小时内";
		liOneDay.textContent = "过去 24 小时内";
		liOneWeek.textContent = "过去 1 周内";
		liOneMonth.textContent = "过去 1 个月内";
		liOneYear.textContent = "过去 1 年内";

		filterList.appendChild(liUnlimited);
		filterList.appendChild(liOneHour);
		filterList.appendChild(liOneDay);
		filterList.appendChild(liOneWeek);
		filterList.appendChild(liOneMonth);
		filterList.appendChild(liOneYear);

		liUnlimited.addEventListener("click", () => {
			urlParams.delete("tbs");
			window.location.search = urlParams.toString();
		});

		const urlParamsEvent = (type) => {
			urlParams.set("tbs", type);
			window.location.search = urlParams.toString();
		};
		liOneHour.addEventListener("click", () => urlParamsEvent("qdr:h"));
		liOneDay.addEventListener("click", () => urlParamsEvent("qdr:d"));
		liOneWeek.addEventListener("click", () => urlParamsEvent("qdr:w"));
		liOneMonth.addEventListener("click", () => urlParamsEvent("qdr:m"));
		liOneYear.addEventListener("click", () => urlParamsEvent("qdr:y"));

		const { startDateInput, endDateInput } = validateDateInput();

		const rangeFilterBtn = document.querySelector(".form-footer button");
		rangeFilterBtn.addEventListener("click", (e) => {
			e.preventDefault();
			const startDateText = startDateInput.value;
			const endDateText = endDateInput.value;

			if (!startDateText || !endDateText) {
				return;
			}

			const startDate = new Date(startDateText);
			const endDate = new Date(endDateText);
			const formatStartDate = `${startDate.getMonth() + 1}/${startDate.getDate()}/${startDate.getFullYear()}`;
			const formatEndDate = `${endDate.getMonth() + 1}/${endDate.getDate()}/${endDate.getFullYear()}`;

			urlParams.set("tbs", `cdr:1,cd_min:${formatStartDate},cd_max:${formatEndDate}`);
			window.location.search = urlParams.toString();
		});
	}

	if (data[type].name == "yahoo") {
		const cloneFilterItem = filterItem.cloneNode(true);
		cloneFilterItem.className = "";
		cloneFilterItem.style.backgroundColor = "#fcfbfb";
		cloneFilterItem.style.marginBottom = "15px";
		cloneFilterItem.style.padding = "5px";
		cloneFilterItem.style.border = "1px solid rgba(0,0,0,.03)";
		cloneFilterItem.style.borderRadius = "16px";

		sidebar.prepend(cloneFilterItem);
	}

	if (data[type].name == "yandex") {
		style.innerHTML += `.sidebar-filter-list{ margin:0; padding: 10px; background-color: #ffffff; border-radius: 16px; box-shadow: 0 4px 12px 0#0d234308; } .sidebar-filter-list li { background-color: #ffffff; padding: 5px; list-style-type: none; cursor: pointer; } .sidebar-filter-list li:hover { background-color: #f1f4fe; color: #2440b3; }`;

		const filterList = document.createElement("ul");
		filterList.className = "sidebar-filter-list";

		const filterSidebarItem = document.createElement("div");
		filterSidebarItem.style.marginBottom = "20px";
		filterSidebarItem.appendChild(filterList);

		sidebar.prepend(filterSidebarItem);

		const liUnlimited = document.createElement("li");
		const liOneDay = document.createElement("li");
		const liTwoWeek = document.createElement("li");
		const liOneMonth = document.createElement("li");

		liUnlimited.textContent = "All time";
		liOneDay.textContent = "Last day";
		liTwoWeek.textContent = "Last 2 weeks";
		liOneMonth.textContent = "Last month";

		liUnlimited.addEventListener("click", () => {
			urlParams.delete("within");
			window.location.search = urlParams.toString();
		});

		const urlParamsSetter = (value) => {
			urlParams.set("within", value);
			window.location.search = urlParams.toString();
		};
		liOneDay.addEventListener("click", () => urlParamsSetter("77"));
		liTwoWeek.addEventListener("click", () => urlParamsSetter("1"));
		liOneMonth.addEventListener("click", () => urlParamsSetter("2"));

		filterList.appendChild(liUnlimited);
		filterList.appendChild(liOneDay);
		filterList.appendChild(liTwoWeek);
		filterList.appendChild(liOneMonth);
	}

	function validateDateInput() {
		const startDateInput = document.querySelector(".filter-date-start");
		const endDateInput = document.querySelector(".filter-date-end");

		startDateInput.addEventListener("change", () => {
			startDateInput.value = validateDateValue(startDateInput.value) ? startDateInput.value : "";
		});

		endDateInput.addEventListener("change", () => {
			endDateInput.value = validateDateValue(endDateInput.value) ? endDateInput.value : "";
		});

		return { startDateInput, endDateInput };
	}

	function validateDateValue(date) {
		const validateMesBlock = document.querySelector(".validateMessage");
		const startDateInput = document.querySelector(".filter-date-start");
		const endDateInput = document.querySelector(".filter-date-end");

		if (isNaN(Date.parse(date))) {
			validateMesBlock.innerText = "*日期不合法";
			validateMesBlock.style.visibility = "visible";
			return false;
		}

		if (startDateInput.value && endDateInput.value && startDateInput.value > endDateInput.value) {
			validateMesBlock.innerText = "*开始日期不能大于结束日期";
			validateMesBlock.style.visibility = "visible";
			return false;
		}

		validateMesBlock.style.visibility = "hidden";
		return true;
	}

	function getDiffDay(startDate, endDate) {
		const oneDay = 1000 * 60 * 60 * 24;
		const timestamp = Date.parse(startDate) - Date.parse(endDate);
		return Math.floor(timestamp / oneDay);
	}
})();
