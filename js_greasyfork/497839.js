// ==UserScript==
// @name         Vstats Kit
// @namespace    http://tampermonkey.net/
// @version      1.51
// @description  Show median peak, true average, add change date arrows on month stats page, change hololive channel.
// @author       Irushia
// @license      MIT
// @match        https://www.vstats.jp/channels/1:*/*
// @exclude      https://www.vstats.jp/channels/1:*/overall
// @icon         https://www.google.com/s2/favicons?sz=64&domain=vstats.jp
// @run-at       document-end
// @require      https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant        GM.getValue
// @grant        GM.setValue
// @grant        GM_registerMenuCommand
// @downloadURL https://update.greasyfork.org/scripts/497839/Vstats%20Kit.user.js
// @updateURL https://update.greasyfork.org/scripts/497839/Vstats%20Kit.meta.js
// ==/UserScript==

(() => {
	const gmc = new GM_config({
		id: "MyConfig",
		title: `${GM_info.script.name} Settings`,
		fields: {
			COPY_TO_CLIPBOARD: {
				label: "Copy stats to clipboard",
				type: "select",
				options: [
					"None",
					"HW",
					"HS",
					"MEDIAN",
					"AVERAGE",
					"VIDNUM",
					"LIVENUM",
					"PRENUM",
				],
				default: "None",
			},
		},
		events: {
			init: () => {
				const cpy = gmc.get("COPY_TO_CLIPBOARD");
				copyToClipboard(cpy);
			},
		},
	});

	const HololiveChs = [
		{ id: "UCp6993wxpyDPHUpavwDFqgg", name: "Sora" },
		{ id: "UCDqI2jOz0weumE8s7paEk6g", name: "Roboco" },
		{ id: "UCFTLzh12_nrtzqBPsTCqenA", name: "Aki" },
		{ id: "UC1CfXB_kRs3C-zaeTG3oGyg", name: "Haato" },
		{ id: "UCdn5BQ06XqgXoAxIhbqw5Rg", name: "Fubuki" },
		{ id: "UCQ0UDLQCjY0rmuxCDE38FGg", name: "Matsuri" },
		{ id: "UCXTpFs_3PqI41qX2d9tL2Rw", name: "Shion" },
		{ id: "UC7fk0CB07ly8oSl0aqKkqFg", name: "Ayame" },
		{ id: "UC1suqwovbL1kzsoaZgFZLKg", name: "Choco" },
		{ id: "UCvzGlP9oQwU--Y0r9id_jnA", name: "Subaru" },
		{ id: "UC0TXe_LYZ4scaW2XMyi5_kw", name: "AZKi" },
		{ id: "UCp-5t9SrOQwXMU7iIjQfARg", name: "Mio" },
		{ id: "UC-hM6YJuNYVAmUWxeIr9FeA", name: "Miko" },
		{ id: "UCvaTdHTWBGv3MKj3KVqJVCw", name: "Okayu" },
		{ id: "UChAnqc_AY5_I3Px5dig3X1Q", name: "Korone" },
		{ id: "UC5CwaMl1eIgY8h02uZw7u8A", name: "Suisei" },
		{ id: "UC1DCedRgGHBdm81E1llLhOQ", name: "Pekora" },
		{ id: "UCvInZx9h3jC2JzsIzoOebWg", name: "Flare" },
		{ id: "UCdyqAaZDKHXg4Ahi7VENThQ", name: "Noel" },
		{ id: "UCCzUftO8KOVkV4wQG1vkUvg", name: "Marine" },
		{ id: "UCZlDXzGoo7d44bwdNObFacg", name: "Kanata" },
		{ id: "UCqm3BQLlJfvkTsX_hvm0UmA", name: "Watame" },
		{ id: "UC1uv2Oq6kNxgATlCiez59hw", name: "Towa" },
		{ id: "UCa9Y57gfeY0Zro_noHRVrnw", name: "Luna" },
		{ id: "UCOyYb1c43VlX9rc_lT6NKQw", name: "Risu" },
		{ id: "UCP0BspO_AMEe3aQqqpo89Dg", name: "Moona" },
		{ id: "UCAoy6rzhSf4ydcYjJw3WoVg", name: "Iofiteen" },
		{ id: "UCFKOVgVbGmX65RxO3EtH3iw", name: "Lamy" },
		{ id: "UCAWSyEs_Io8MtpY3m-zqILA", name: "Nene" },
		{ id: "UCUKD-uaobj9jiqB-VXt71mA", name: "Botan" },
		{ id: "UCK9V2B22uJYu3N7eR_BT9QA", name: "Polka" },
		{ id: "UCL_qhgtOy0dy1Agp8vkySQg", name: "Calliope" },
		{ id: "UCHsx4Hqa-1ORjQTh9TYDhww", name: "Kiara" },
		{ id: "UCMwGHR0BTZuLsmjY_NT5Pwg", name: "Ina'nis" },
		{ id: "UCoSrY_IQQVpmIRZ9Xf-y93g", name: "Gura" },
		// { id: "UCyl1z3jo3XHR1riLFKG5UAg", name: "Amelia" },
		{ id: "UCYz_5n-uDuChHtLo7My1HnQ", name: "Ollie" },
		{ id: "UC727SQYUvx5pDDGQpTICNWg", name: "Anya" },
		{ id: "UChgTyjG-pdNvxxhdsXfHQ5Q", name: "Reine" },
		{ id: "UC8rcEBzJSleTkf_-agPM20g", name: "IRyS" },
		{ id: "UCO_aKKYxn4tvrqPjcTzZ6EQ", name: "Fauna" },
		{ id: "UCmbs8T6MWqUHP1tIQvSgKrg", name: "Kronii" },
		{ id: "UC3n5uGu18FoCy23ggWWp8tA", name: "Mumei" },
		{ id: "UCgmPnx-EEeOrZSg5Tiw7ZRQ", name: "Baelz" },
		{ id: "UCENwRMx5Yh42zWpzURebzTw", name: "Laplus" },
		{ id: "UCs9_O1tRPMQTHQ-N_L6FU2g", name: "Lui" },
		{ id: "UC6eWCld0KwmyHFbAqK3V-Rw", name: "Koyori" },
		{ id: "UCIBY1ollUsauvVi4hW4cumw", name: "Chloe" },
		{ id: "UC_vMYWcDjmfdpH6r4TTn1MQ", name: "Iroha" },
		{ id: "UCTvHWSfBZgtxE4sILOaurIQ", name: "Zeta" },
		{ id: "UCZLZ8Jjx_RN2CXloOmgTHVg", name: "Kaela" },
		{ id: "UCjLEmnpCNeisMxy134KPwWw", name: "Kobo" },
		{ id: "UCgnfPPb9JI3e9A4cXHnWbyg", name: "Shiori" },
		{ id: "UC9p_lqQ0FEDz327Vgf5JwqA", name: "Bijou" },
		{ id: "UC_sFNM0z0MWm9A6WlKPuMMg", name: "Nerissa" },
		{ id: "UCt9H_RpQzhxzlyBxFqrdHqA", name: "Fuwamoco" },
		{ id: "UCMGfV7TVTmHhEErVJg1oHBQ", name: "Ao" },
		{ id: "UCWQtYtq9EOB4-I5P-3fh8lA", name: "Kanade" },
		{ id: "UCtyWhCj3AqKh2dXctLkDtng", name: "Ririka" },
		{ id: "UCdXAk5MpyLD8594lm_OvtGQ", name: "Raden" },
		{ id: "UC1iA6_NT4mtAcIII6ygrvCw", name: "Hajime" },
		{ id: "UCW5uhrG1eCBYditmhL0Ykjw", name: "Elizabeth" },
		{ id: "UCDHABijvPBnJm7F-KlNME3w", name: "Gigi" },
		{ id: "UCvN5h1ShZtc7nly3pezRayg", name: "Cecillia" },
		{ id: "UCl69AEx4MdqMZH7Jtsm7Tig", name: "Raora" },
		{ id: "UC9LSiN9hXI55svYEBrrK-tw", name: "Riona" },
		{ id: "UCuI_opAVX6qbxZY-a-AxFuQ", name: "Niko" },
		{ id: "UCjk2nKmHzgH5Xy-C5qYRd5A", name: "Su" },
		{ id: "UCKMWFR6lAstLa7Vbf5dH7ig", name: "Chihaya" },
		{ id: "UCGzTVXqMQHa4AgJVJIVvtDQ", name: "Vivi" },
	];

	const findEle = (ele, title) => {
		const value = ele.querySelector(`[title="${title}"]`);
		return value && value.textContent !== "---"
			? Number.parseInt(value.textContent.replace(/,/g, ""), 10)
			: 0;
	};

	const sortList = () => {
		const divClass =
			"row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-2 g-lg-3";
		const divEle = document.getElementsByClassName(divClass)[0];

		const sortedChildren = Array.from(divEle.children).sort(
			(a, b) => findEle(b, "最大視聴者数") - findEle(a, "最大視聴者数"),
		);
		for (const col of sortedChildren) {
			divEle.appendChild(col);
		}
	};

	const getMedian = (arr) => {
		const sortedArr = arr.sort((a, b) => a - b);
		const mid = Math.floor(sortedArr.length / 2);
		return sortedArr.length % 2 === 0
			? (sortedArr[mid - 1] + sortedArr[mid]) / 2
			: sortedArr[mid];
	};

	const formatNumberWithCommas = (num) => {
		return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
	};

	const arrIndex = (arr, index) => {
		if (!arr) return null;
		return arr[index];
	};

	const toInt = (str) => {
		if (!str || str === "---") return 0;
		return Number.parseInt(str.replace(/,/g, ""), 10);
	};

	const toFloat = (str) => {
		if (!str || str === "0:00") return 0.0;
		return (
			Number.parseInt(str.split(":")[0]) +
			Number.parseInt(str.split(":")[1]) / 60
		).toFixed(2);
	};

	const addTime = (time1, time2) => {
		const [h1, m1] = time1.split(":").map(Number);
		const [h2, m2] = time2.split(":").map(Number);
		const totalMinutes = h1 * 60 + m1 + (h2 * 60 + m2);
		const hours = Math.floor(totalMinutes / 60);
		const minutes = totalMinutes % 60;
		return `${hours}:${minutes.toString().padStart(2, "0")}`;
	};

	const Stats = {
		hourswatched: "",
		hourstream: "",
		median: 0,
		average: 0,
		vidNum: 0,
		liveNum: 0,
		preNum: 0,
		init(hourswatched, hourstream, median, vidNum, liveNum, preNum) {
			this.hourswatched = hourswatched; // string
			this.hourstream = hourstream; // string
			this.median = median; //
			const hw = Number.parseInt(hourswatched.replace(/,/g, ""));
			const hs = toFloat(hourstream);
			this.average = Math.round(hw / hs); // int
			this.vidNum = vidNum; // int
			this.liveNum = liveNum; // int
			this.preNum = preNum; // int
		},
		toString() {
			return `動画:${this.vidNum}本\nライブ配信:${this.liveNum}本\n
            同接中央値:${formatNumberWithCommas(this.median)}\n
            同接平均値:${formatNumberWithCommas(this.average)}\n
            総視聴時間:${this.hourswatched}\n配信時間:${this.hourstream}\n
            プレミア公開:${this.preNum}本`;
		},
	};

	const editStats = () => {
		const divClass =
			"row row-cols-2 row-cols-md-3 row-cols-lg-4 row-cols-xl-5 g-2 g-lg-3";
		const divEle = document.getElementsByClassName(divClass)[0];
		const eleList = divEle.children;

		const peakList = [];
		let hourstream = "0:00";

		for (let i = 0; i < eleList.length; i++) {
			const peak = findEle(eleList[i], "最大視聴者数");
			if (peak > 0) {
				peakList.push(peak);
				const hs = eleList[i]
					.querySelector(`[title="放送時間"]`)
					.textContent.trim();
				hourstream = addTime(hourstream, hs);
			}
		}

		if (peakList.length === 0) return;

		const statsEle = document.querySelector("h5");

		Stats.init(
			statsEle.innerHTML.match(/総視聴時間:\s*([\d,]+)/)[1],
			hourstream,
			getMedian(peakList).toFixed(0),
			toInt(arrIndex(statsEle.innerHTML.match(/動画:\s*(\d+)/), 1)),
			peakList.length,
			toInt(arrIndex(statsEle.innerHTML.match(/プレミア公開:\s*(\d+)/), 1)),
		);

		statsEle.innerHTML = Stats.toString();
	};

	const addDateChangeArrow = () => {
		const url = new URL(window.location.href);
		const [channel, date] = url.pathname.split("/").slice(-2);
		const [year, month] = date.split("-").map(Number);

		const prevDate = new Date(year, month - 2, 1);
		const nextDate = new Date(year, month, 1);

		const prevMonthUrl = `/channels/${channel}/${prevDate.getFullYear()}-${
			prevDate.getMonth() + 1
		}`;
		const nextMonthUrl = `/channels/${channel}/${nextDate.getFullYear()}-${
			nextDate.getMonth() + 1
		}`;

		const dateNavElement = document.querySelector(
			"body > main > div.content.mt-3 > div > div:nth-child(1) > div:nth-child(2) > h4",
		);
		dateNavElement.insertAdjacentHTML(
			"afterbegin",
			`<a href="${prevMonthUrl}" class="link-dark"><i class="fas fa-angle-left" aria-hidden="true"></i></a>`,
		);
		dateNavElement.insertAdjacentHTML(
			"beforeend",
			`<a href="${nextMonthUrl}" class="link-dark"><i class="fas fa-angle-right" aria-hidden="true"></i></a>`,
		);
	};

	const addChannelChangeArrow = () => {
		const url = new URL(window.location.href);
		const [channel, date] = url.pathname.split("/").slice(-2);
		const channelId = channel.split(":")[1];

		const index = HololiveChs.findIndex((ch) => ch.id === channelId);
		if (index === -1) return;

		const prevIndex = index === 0 ? HololiveChs.length - 1 : index - 1;
		const nextIndex = index === HololiveChs.length - 1 ? 0 : index + 1;

		const prevHtml = `<a href="/channels/1:${HololiveChs[prevIndex].id}/${date}" class="link-dark"><i class="fas fa-angle-left" aria-hidden="true"></i></a>`;
		const nextHtml = `<a href="/channels/1:${HololiveChs[nextIndex].id}/${date}" class="link-dark"><i class="fas fa-angle-right" aria-hidden="true"></i></a>`;

		const channelNavElement = document.querySelector(
			"body > main > div.content.mt-3 > div > div:nth-child(1) > div.col-12.d-flex.justify-content-start.align-items-center.py-2 > img",
		);
		channelNavElement.insertAdjacentHTML("beforebegin", prevHtml);
		channelNavElement.insertAdjacentHTML("afterend", nextHtml);
	};

	const copyToClipboard = (settings) => {
		if (!settings) return;

		const map = {
			HW: toInt(Stats.hourswatched),
			HS: toFloat(Stats.hourstream),
			MEDIAN: Stats.median,
			AVERAGE: Stats.average,
			VIDNUM: Stats.vidNum,
			LIVENUM: Stats.liveNum,
			PRENUM: Stats.preNum,
			None: 0,
		};
		const tmp = map[settings];
		console.debug(`Copying: ${tmp}`);
		navigator.clipboard.writeText(tmp).then(
			() => {
				// alert(`Async: Copying ${settings} to clipboard was successful!`);
			},
			(err) => {
				console.error("Async: Could not copy text: ", err);
			},
		);
	};

	GM_registerMenuCommand("Settings", () => {
		gmc.open();
	});
	GM_registerMenuCommand("Sort", sortList);

	addDateChangeArrow();
	addChannelChangeArrow();
	editStats();
	// copyToClipboard("MEDIAN");
})();
