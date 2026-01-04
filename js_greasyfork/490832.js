// ==UserScript==
// @name        [루시퍼홍] 아실 차트 가격표
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/app/apt_info.jsp?*
// @grant       none
// @version     2.21
// @author      -
// @description 버튼 배치/레이아웃 동일 + 로드시 h2 위치를 기준으로 apt_info의 top을 (h2 top + 45px)로 보정
// @downloadURL https://update.greasyfork.org/scripts/490832/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%B0%A8%ED%8A%B8%20%EA%B0%80%EA%B2%A9%ED%91%9C.user.js
// @updateURL https://update.greasyfork.org/scripts/490832/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%B0%A8%ED%8A%B8%20%EA%B0%80%EA%B2%A9%ED%91%9C.meta.js
// ==/UserScript==


 const TS  = () => new Date().toISOString();
  const log = (...a) => console.log(`[%s][ASIL]`, TS(), ...a);
  const warn= (...a) => console.warn(`[%s][ASIL]`, TS(), ...a);
  const err = (...a) => console.error(`[%s][ASIL]`, TS(), ...a);

(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/10782960';
  const popupDismissKey = 'scriptUpdatePopupDismissed';
  const dismissDuration = 24 * 60 * 60 * 1000; // 24시간

  // 한국 시간을 가져오는 함수
  function getKoreanTime() {
    const now = new Date();
    const utcNow = now.getTime() + (now.getTimezoneOffset() * 60000); // UTC 시간
    const koreanTime = new Date(utcNow + (9 * 60 * 60 * 1000)); // 한국 시간 (UTC+9)
    return koreanTime;
  }

  // 날짜를 24시간 형식으로 포맷하는 함수
  function formatDateTo24Hour(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  }

  // 최신 버전을 가져오기 위해 메타 파일을 가져옴
  fetch(`${updateUrl}?_=${Date.now()}`)
    .then(response => response.text())
    .then(meta => {
      const latestVersionMatch = meta.match(/@version\s+([^\s]+)/);

      if (latestVersionMatch) {
        const latestVersion = latestVersionMatch[1];
        console.log(scriptName + ' ' + "latestVersion: " + latestVersion);

        if (currentVersion !== latestVersion) {
          if (!shouldDismissPopup()) {
            showUpdatePopup(latestVersion);
          }
        }
      }
    })
    .catch(error => {
      console.error('Failed to fetch the latest version information:', error);
    });

  function shouldDismissPopup() {
    const lastDismissTime = localStorage.getItem(popupDismissKey);
    if (!lastDismissTime) return false;

    const timeSinceDismiss = getKoreanTime().getTime() - new Date(lastDismissTime).getTime();
    return timeSinceDismiss < dismissDuration;
  }

  function dismissPopup() {
    const koreanTime = getKoreanTime();
    const formattedTime = formatDateTo24Hour(koreanTime);
    localStorage.setItem(popupDismissKey, formattedTime);
  }

  function showUpdatePopup(latestVersion) {
    const popup = document.createElement('div');
    popup.style.position = 'fixed';
    popup.style.top = '50%';
    popup.style.left = '50%';
    popup.style.transform = 'translate(-50%, -50%)';
    popup.style.padding = '20px';
    popup.style.backgroundColor = 'white';
    popup.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';
    popup.style.zIndex = '10000';

    const message = document.createElement('p');
    message.innerHTML = `${scriptName} (${latestVersion}) 버젼 업데이트가 있습니다. 확인하시겠습니까?<br><br>(닫기 버튼을 누르실 경우 24시간 동안 다시 알림이 뜨지 않습니다)<br><br>`;
    popup.appendChild(message);

    const confirmButton = document.createElement('button');
    confirmButton.textContent = '확인';
    confirmButton.style.marginRight = '10px';
    confirmButton.onclick = () => {
      window.open(cafeUrl, '_blank');
      document.body.removeChild(popup);
    };
    popup.appendChild(confirmButton);

    const closeButton = document.createElement('button');
    closeButton.textContent = '닫기';
    closeButton.onclick = () => {
      dismissPopup();
      document.body.removeChild(popup);
    };
    popup.appendChild(closeButton);

    document.body.appendChild(popup);
  }
})();

(function () {
  'use strict';

  /* ===================== 0) 공통 유틸 (appendChild 우회 등) ===================== */
  const __insBefore = Node.prototype.insertBefore;
  const __remove    = Element.prototype.remove;
  function safeInsert(parent, node, ref = null){ try { return __insBefore.call(parent, node, ref); } catch(_){} }
  function safeAppend(parent, node){ return safeInsert(parent, node, null); }
  function safeRemove(node){ try { return __remove.call(node); } catch(_){} }

  /* ===================== 1) 버전 안내 팝업(기존 유지) ===================== */


  /* ===================== 2) 상단 버튼바: 개별거래와 동일 레이아웃 ===================== */
  (function installTitleBar(){
    if (window.__asil_titlebar_installed) return;

    if (!document.getElementById('asil-titlebar-style')) {
      const st = document.createElement('style');
      st.id = 'asil-titlebar-style';
      st.textContent = [
        '.asil-titlebar{display:flex;gap:8px;align-items:center;',
        'margin:0 0 10px 0;padding:6px 10px;background:#fff;border-radius:8px;',
        'box-shadow:inset 0 0 0 1px #e5e7eb;position:relative;z-index:9;flex-wrap:wrap;}',
        '.asil-titlebar .hongbu-btn{display:inline-flex;align-items:center;justify-content:center;height:26px;',
        'padding:0 10px;border-radius:6px;border:1px solid rgba(0,0,0,.1);font-size:12px;font-weight:600;line-height:1;',
        'cursor:pointer;user-select:none;box-shadow:0 1px 0 rgba(0,0,0,.05);transition:filter .12s ease,transform .04s ease;}',
        '.asil-titlebar .hongbu-btn:hover{filter:brightness(.97);} .asil-titlebar .hongbu-btn:active{transform:translateY(1px);}',
        '.hongbu-green{background:#99CC00;color:#fff;border-color:#8ab800;}',
        '.hongbu-orange{background:#EB7B43;color:#fff;border-color:#d36f3d;}',
        '.hongbu-blue{background:#0070C0;color:#fff;border-color:#0063a8;}',
        'body > div.asilScroll > div.apt_info > div.hgroup{padding:8px 12px 6px !important;}',
        'body > div.asilScroll > div.apt_info > div.hgroup h2.h2{margin:0 0 6px 0 !important;line-height:1.25;}',
      ].join('');
      safeAppend(document.head, st);
    }

    function findH2() {
      return document.querySelector('div.asilScroll div.apt_info div.hgroup h2.h2')
          || document.querySelector('div.asilScroll div.hgroup h2.h2')
          || document.querySelector('h2.h2');
    }
    function reflowForHeader(headerDiv){
      if (!headerDiv) return;
      headerDiv.style.height = 'auto';
      const scrollRoot = document.querySelector('body > div.asilScroll');
      const aptInfo    = document.querySelector('body > div.asilScroll > div.apt_info');
      if (!scrollRoot || !aptInfo) return;
      const bar = headerDiv.querySelector('.asil-titlebar');
      if (bar) {
        const padLeft = parseFloat(getComputedStyle(headerDiv).paddingLeft) || 0;
        bar.style.marginLeft = `-${padLeft}px`;
        bar.style.width      = `calc(100% + ${padLeft}px)`;
      }
      scrollRoot.style.paddingTop = '41px';
      const rectH = headerDiv.getBoundingClientRect();
      let h = 45;
      if (bar && rectH.width) {
        const rectB = bar.getBoundingClientRect();
        h = Math.ceil(rectB.bottom - rectH.top);
        if (!(h > 0 && h < 200)) h = 45;
        if (h < 30) h = 30;
      }
      aptInfo.style.height = `calc(100% - ${h}px)`;
    }

    function makeBtn(text, cls, onClick){
      const el = document.createElement('button');
      el.type = 'button';
      el.className = `hongbu-btn ${cls}`;
      el.textContent = text;
      el.addEventListener('click', onClick);
      return el;
    }

    function mount(){
      const h2 = findH2();
      const headerDiv = h2 ? h2.parentElement : null;
      if (!h2 || !headerDiv || window.__asil_titlebar_installed) return false;

      const bar = document.createElement('div');
      bar.className = 'asil-titlebar';

      const btnNaver = makeBtn('네이버부동산 링크', 'hongbu-green', () => {
        const links = document.getElementsByTagName('a');
        for (let link of links) {
          if (link.textContent.trim() === '네이버평면도') { link.click(); break; }
        }
      });
      const btnBig   = makeBtn('크게 보기', 'hongbu-orange', () => window.open(location.href, '_blank'));
      const btnMore  = makeBtn('거래현황 더보기', 'hongbu-blue', () => { try { viewAll(); } catch(_){} });

      safeAppend(bar, btnNaver);
      safeAppend(bar, btnBig);
      safeAppend(bar, btnMore);

      safeInsert(headerDiv, bar, h2);
      window.__asil_titlebar_installed = true;

      reflowForHeader(headerDiv);
      const ro = new ResizeObserver(() => reflowForHeader(headerDiv));
      ro.observe(headerDiv);
      window.addEventListener('resize', () => reflowForHeader(headerDiv));
      setTimeout(() => reflowForHeader(headerDiv), 0);

      return true;
    }

    if (!mount()) {
      const mo = new MutationObserver(() => { if (mount()) mo.disconnect(); });
      mo.observe(document.documentElement, { childList:true, subtree:true });
      let tries = 0;
      const t = setInterval(() => { if (mount() || ++tries > 20) clearInterval(t); }, 300);
    }
  })();

  /* ===================== 2-1) 로드시 h2 위치를 찾아 apt_info top = (h2 top + 45px)로 보정 ===================== */
  function adjustAptInfoTopByH2() {
    const aptInfo = document.querySelector('body > div.asilScroll > div.apt_info');
    const h2 = document.querySelector('body > div.asilScroll > div.apt_info > div.hgroup h2.h2')
            || document.querySelector('div.asilScroll div.hgroup h2.h2')
            || document.querySelector('h2.h2');
    if (!aptInfo || !h2) return;

    // viewport 기준 h2의 top 값을 얻어 +45px 한 값을 apt_info의 top으로 설정
    const h2Top = h2.getBoundingClientRect().top;
    aptInfo.style.position = 'relative';
    aptInfo.style.top = (Math.max(0, Math.round(h2Top) - 60)) + 'px';
  }

  /* ===================== 3) 기존: 차트/돋보기/갭/전세가율/표 ===================== */

  var chartElement;
  var currentColumnIndex = 1;

  function newViewAll(type){
    if (!type) return;
    const spanElementDate = document.getElementById('chart_info_yyyymm');
    const spanElementPy   = document.getElementById('txtPy');
    const textDate = spanElementDate?.textContent.trim() || '';
    const textPy   = spanElementPy?.textContent.trim() || '';

    function toYYYYMM(t){
      const m = t.match(/(\d{2})년 (\d{1,2})월/);
      if (!m) return null;
      return `20${m[1]}${m[2].padStart(2,'0')}`;
    }
    function toPy(t){
      const m = t.match(/(\d+)평/);
      return m ? `${m[1]}py` : null;
    }

    const yyyymm = toYYYYMM(textDate);
    const v_py   = toPy(textPy);

    const u = new URL(location.href);
    const apt = u.searchParams.get('apt') || '';

    let v_deal = (type === 'M' ? '1' : (type === 'J' ? '2' : ''));
    if (!yyyymm || !v_py || !apt || !v_deal) return;

    const newUrl = `/asil/apt_price_2020.jsp?os=pc&building=apt&evt=${v_py}&year=${yyyymm}&deal=${v_deal}&apt=${apt}`;
    parent.openSecond(newUrl);
  }

  function showIcon(){
    const mTxt = document.getElementById('chart_info_m')?.textContent || '';
    const jTxt = document.getElementById('chart_info_j')?.textContent || '';
    const mEl  = document.querySelector("body > div.asilScroll > div.apt_info > div.article.apt_info_chart.mt0 > p > div:nth-child(1) > span.magnifier_emoji");
    const jEl  = document.querySelector("body > div.asilScroll > div.apt_info > div.article.apt_info_chart.mt0 > p > div:nth-child(2) > span.magnifier_emoji");
    if (mEl) mEl.style.display = (mTxt === "매매 거래내역 없음") ? 'none' : 'block';
    if (jEl) jEl.style.display = (jTxt === "전세 거래내역 없음") ? 'none' : 'block';
  }

  function makeIcon() {
    const style = document.createElement('style');
    style.textContent = `
      .chart_info { display:flex; flex-direction:column; }
      .flex-container { display:flex; align-items:center; }
      #chart_info_m, #chart_info_j { width:150px; display:inline-block; }
      .magnifier_emoji { margin-left:0px; cursor:pointer; }
    `;
    safeAppend(document.head, style);

    const parent = document.querySelector('.chart_info');
    if (!parent) return;
    const spanM = document.getElementById('chart_info_m');
    if (spanM) {
      spanM.style.width = '140px';
      const box = document.createElement('div');
      box.className = 'flex-container';
      const emoji = document.createElement('span');
      emoji.innerText = '🔎';
      emoji.className = 'magnifier_emoji';
      emoji.onclick = () => newViewAll('M');
      box.appendChild(spanM); box.appendChild(emoji);
      parent.insertBefore(box, document.getElementById('chart_info_j'));
    }
    const spanJ = document.getElementById('chart_info_j');
    if (spanJ) {
      spanJ.style.width = '140px';
      const box = document.createElement('div');
      box.className = 'flex-container';
      const emoji = document.createElement('span');
      emoji.innerText = '🔎';
      emoji.className = 'magnifier_emoji';
      emoji.onclick = () => newViewAll('J');
      box.appendChild(spanJ); box.appendChild(emoji);
      parent.appendChild(box);
    }
  }


/* ========== 6) 호버 시 chart_info 갱신 (중복 설치 방지) ========== */
(function installHoverUpdateOnce(){
  // 두 스크립트 공용 플래그 (한 번만 설치)
  const GLOBAL_FLAG = '__asil_hover_update_installed';
  if (window[GLOBAL_FLAG]) {
    log('[hover] already installed — skip');
    return;
  }
  window[GLOBAL_FLAG] = true;

  // 개별 함수에 달아둘 식별자 (다른 스크립트가 덮어써도 판별 가능)
  const PATCH_FLAG = '__asilHoverPatched';

  const newFn = function(seriesId, seriesName, index, xName, yName, data, values){
    if (!data) return '';
    if (seriesId === 'G') return '';
    if (seriesId === 'M' || seriesId === 'J') {
      try { showChartInfo(data); } catch (e) {}
      return '';
    }
    return '';
  };
  // 우리 패치임을 명시
  try { newFn[PATCH_FLAG] = true; } catch (_) {}

  // 최초 주입
  try {
    Object.defineProperty(window, 'dataTipFuncForSingle', {
      configurable: true, writable: true, value: newFn
    });
  } catch {
    window.dataTipFuncForSingle = newFn;
  }

  // 원본/다른 스크립트가 다시 바꿔치기해도 40회(≈20초) 동안 감시해서,
  // 우리 패치가 아니면 다시 덮어씀
  let guardCount = 0;
  const guard = setInterval(() => {
    const fn = window.dataTipFuncForSingle;
    const patched = (typeof fn === 'function' && fn[PATCH_FLAG] === true);

    if (!patched) {
      try {
        window.dataTipFuncForSingle = newFn;
        window.dataTipFuncForSingle[PATCH_FLAG] = true;
        log('[hover] re-patched');
      } catch (_) {}
    }

    if (++guardCount > 40) clearInterval(guard);
  }, 500);

  log('[hover] installed (idempotent)');
})();

  function showGapSpan() {

	showIcon();
    var chartInfoM = document.getElementById("chart_info_m").innerText;
    var chartInfoJ = document.getElementById("chart_info_j").innerText;

    var regexM = /매매\s+(\d+),(\d+)/; // Regex to extract the numbers between "매매" and "/"
    var regexJ = /전세\s+(\d+),(\d+)/; // Regex to extract the numbers between "매매" and "/"
    var matchM = chartInfoM.match(regexM);
    var matchJ = chartInfoJ.match(regexJ);
    var valueM = matchM ? matchM[1] + matchM[2] : ""; // Concatenate the matched numbers
    var valueJ = matchJ ? matchJ[1] + matchJ[2] : "";

    var gap = valueM - valueJ;
    var jspercent = Math.floor(valueJ / valueM * 100);

    var gapSpan = document.createElement('span');
    gapSpan.textContent = ' 갭 '.padEnd(6, '\u00A0') + gap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " / " + jspercent + "%";
    gapSpan.style.color = 'green';
	gapSpan.setAttribute("id", "gapSpanId");

    // Append the span element to the parent of chart_info_j
    var parentElement = document.querySelector('.chart_info');
	if(!document.getElementById("gapSpanId")){
		parentElement.appendChild(gapSpan);
	}else{
		document.getElementById("gapSpanId").textContent = ' 갭 '.padEnd(6, '\u00A0') + gap.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + " / " + jspercent + "%";
	}
    // 가장 높은 전세가율과 해당 날짜를 저장할 변수 초기화
    var highestRentRatio = 0;
    var highestRentDate = "";
    var highestMValue = 0;
    var highestMDate = "";

    // 데이터 순회하여 가장 높은 전세가율과 해당 날짜, 전체 기간 중 가장 큰 M 값과 해당 날짜 찾기
    for (var i = 0; i < chartPData.length; i++) {
        var rent = parseInt(chartPData[i].J);
        var monthly = parseInt(chartPData[i].M);

        // J 값이 null인 경우 무시
        if (!isNaN(rent) && !isNaN(monthly)) {
            var rentRatio = (rent / monthly) * 100;
            if (rentRatio > highestRentRatio) {
                highestRentRatio = rentRatio;
                highestRentDate = chartPData[i].date;
            }
        }

        // M 값이 null이 아니고 현재 저장된 최대값보다 큰 경우 업데이트
        if (!isNaN(monthly) && monthly > highestMValue) {
            highestMValue = monthly;
            highestMDate = chartPData[i].date;
        }
    }

    // 날짜 형식 변환 함수
    function formatDate(date) {
        var parts = date.split("/");
        return parts[0] + "." + parts[1];
    }

    // 숫자에 콤마 추가 함수
    function addCommas(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }

    // 새로운 <p> 요소 생성
    var newParagraph = document.createElement("p");
    newParagraph.setAttribute("class", "chart_info");

    // 새로운 <span> 요소 생성
    var newSpan1 = document.createElement("span");
    newSpan1.setAttribute("id", "new_chart_info1");
    newSpan1.textContent = "최고 전세가율 : " + Math.floor(highestRentRatio) + "% (" + formatDate(highestRentDate) + ")";
    newSpan1.style.color = 'black';

    var newSpan2 = document.createElement("span");
    newSpan2.setAttribute("id", "new_chart_info2");
    newSpan2.textContent = "전고점 : " + addCommas(highestMValue) + "(" + formatDate(highestMDate) + ") ";
    newSpan2.innerHTML += "&nbsp;"; // 공백 문자 삽입

    function convertToDateFormat(monthYear) {
        // "19년 11월"을 "19"와 "11"로 분할
        var parts = monthYear.split(" ");

        // 연도 부분을 추출하고 "20"을 추가하여 4자리 연도로 변환
        var year = "20" + parts[0].slice(0, -1);

        // 월 부분을 추출하고 한 자리 숫자인 경우 앞에 0을 추가하여 2자리 숫자로 변환
        var month = ("0" + parts[1].slice(0, -1)).slice(-2);

        // 변환된 연도와 월을 결합하여 "YYYY/MM/01" 형식의 문자열로 반환
        return year + "/" + month + "/01";
    }

    // 테스트를 위해 주어진 문자열 "19년 11월"을 "2017/12/01"로 변환하는 예시
    var yyyymm = document.getElementById("chart_info_yyyymm").innerText;
    var yyyymmdd = convertToDateFormat(yyyymm);

    // highestMDate와 yyyymmdd를 Date 객체로 변환
    var highestMDateObj = new Date(highestMDate);
    var yyyymmddObj = new Date(yyyymmdd);

    var redTextSpan = document.createElement("span");
	redTextSpan.setAttribute("id", "new_chart_info3");
    var updownPercent = "";


    // 전고점 시점보다 이전이면 상승률로 표시
    if (valueM !== "" && highestMDateObj >= yyyymmddObj) {
        updownPercent = Math.round(((highestMValue / valueM - 1) * 100));

        redTextSpan.textContent = "전고까지 상승률 : " + updownPercent + "%";
    } else if (valueM !== "" && highestMDateObj < yyyymmddObj) {
        updownPercent = Math.round(((valueM / highestMValue - 1) * 100));

        redTextSpan.textContent = "전고대비 하락률 : " + updownPercent + "%";
    }

    redTextSpan.style.color = 'red';
    redTextSpan.style.display = 'inline'; // 인라인 요소로 변경

    newSpan2.appendChild(redTextSpan);
    // 스타일 적용
    newSpan2.style.color = 'black';

    // Append the span elements to the parent element
	if(!document.getElementById("new_chart_info1")){
		parentElement.appendChild(newSpan1);
	}else{
		document.getElementById("new_chart_info1").textContent = "최고 전세가율 : " + Math.floor(highestRentRatio) + "% (" + formatDate(highestRentDate) + ")";

	}
	if(!document.getElementById("new_chart_info2")){
		parentElement.appendChild(newSpan2);
	}else{
		var newChartInfo2Span = document.getElementById('new_chart_info2');
		if (newChartInfo2Span) {
			newChartInfo2Span.parentNode.removeChild(newChartInfo2Span);
		}
		parentElement.appendChild(newSpan2);
		//document.getElementById("new_chart_info2").textContent = "전고점 : " + addCommas(highestMValue) + "(" + formatDate(highestMDate) + ") ";
		//document.getElementById("new_chart_info2").innerHTML += "&nbsp;";
		//document.getElementById("new_chart_info2").textContent += "전고대비 하락률 : " + updownPercent + "%"
		//document.getElementById("new_chart_info2").appendChild(newSpan2);
	}
    //showDetail();
}

// chart_info DOM과 값이 실제로 준비되었을 때만 cb 실행
function whenChartInfoReady(cb){
  let tries = 0;
  const maxTries = 40; // ~6초 (150ms * 40)

  const tick = setInterval(() => {
    const ym = document.getElementById('chart_info_yyyymm');
    const m  = document.getElementById('chart_info_m');
    const j  = document.getElementById('chart_info_j');

    // 요소가 있고, 매매/전세 둘 중 하나라도 숫자를 포함하면 준비 완료로 간주
    const hasNumber = (el) => el && /\d/.test(el.textContent || '');
    if (ym && m && j && (hasNumber(m) || hasNumber(j))) {
      clearInterval(tick);
      cb();
      return;
    }

    // 일정 횟수 이상 대기했는데도 없으면 MutationObserver로 대기 전환
    if (++tries > maxTries) {
      clearInterval(tick);
      const target = document.querySelector('.chart_info') || document.body;
      if (!target) return;
      const mo = new MutationObserver(() => {
        const m2 = document.getElementById('chart_info_m');
        const j2 = document.getElementById('chart_info_j');
        if ((m2 && /\d/.test(m2.textContent||'')) || (j2 && /\d/.test(j2.textContent||''))) {
          mo.disconnect();
          cb();
        }
      });
      mo.observe(target, { childList:true, subtree:true, characterData:true });
    }
  }, 150);
}



  function initWhenReady() {
  // h2 기준 top 보정은 그대로 유지
  setTimeout(adjustAptInfoTopByH2, 300);

  setTimeout(addTableIfChartExistsInNestedIframe, 1000);

  // ✅ chart_info가 준비되었을 때만 갭/전세가율 계산
  setTimeout(showGapSpan, 1000);

  const selectW = document.querySelector("#selectW");
  if (selectW?.classList.contains('on')) selectW.click();

  window.addEventListener('resize', () => setTimeout(adjustAptInfoTopByH2, 150));
}

  if (document.readyState === 'complete' || document.readyState === 'interactive') {
    initWhenReady();
  } else {
    document.addEventListener('DOMContentLoaded', initWhenReady);
  }

  function addTableIfChartExistsInNestedIframe() {
    chartElement = document.getElementsByClassName("rMateH5__Combination2DChart")[0];
    if (!chartElement) { return; }

    // 돋보기 추가
    makeIcon();

    // 표 채우기 유틸
    function addNumberToTableCell(row, col, number) {
      const cell = document.getElementById("tbl_price").rows[row].cells[col];
      cell.innerText = Number(number).toLocaleString();
      cell.style.textAlign = "right";
    }
    function addDataToTableCell(row, col, data, isPercentage = false) {
      const cell = document.getElementById("tbl_price").rows[row].cells[col];
      if (isPercentage) {
        cell.innerText = `${data}%`;
      } else {
        if (row === 0) {
          data = String(data).replace(/(\d+)년 (\d+)월/g, (_,a,b)=>`${String(a).padStart(2,'0')}.${String(b).padStart(2,'0')}`);
          cell.innerText = data;
        } else {
          cell.innerText = data;
        }
      }
      cell.style.textAlign = (row === 0 && col === 0) ? 'center' : 'right';
    }


    function mouseupEventAdd() {
  setTimeout(function() {
    chartElement = document.getElementsByClassName("rMateH5__Combination2DChart")[0];
    if (!chartElement) return;

    // ✅ 이미 바인딩되어 있으면 재바인딩 금지
    if (chartElement.dataset.asilMouseupBound === '1') return;

    chartElement.addEventListener('mouseup', function(event) {
      if (event.button === 0 && !event.shiftKey && !event.ctrlKey) {
        let table = document.getElementById("tbl_price");
        if (!table) {
          createTable("initial");
        } else {
          table.style.userSelect = 'text';
          table.style.cursor = 'default';
        }

        const ym  = document.getElementById("chart_info_yyyymm")?.innerText || '';
        const mTxt= document.getElementById("chart_info_m")?.innerText || '';
        const jTxt= document.getElementById("chart_info_j")?.innerText || '';
        const m = mTxt.match(/매매\s+(\d+),(\d+)/);
        const j = jTxt.match(/전세\s+(\d+),(\d+)/);
        const vM = m ? +(m[1] + m[2]) : NaN;
        const vJ = j ? +(j[1] + j[2]) : NaN;

        const table2 = document.getElementById("tbl_price");
        if (table2 && currentColumnIndex < table2.rows[0].cells.length) {
          addDataToTableCell(0, currentColumnIndex, ym);
          if (Number.isFinite(vM)) addNumberToTableCell(1, currentColumnIndex, vM);
          if (Number.isFinite(vJ)) addNumberToTableCell(2, currentColumnIndex, vJ);
          if (Number.isFinite(vM) && Number.isFinite(vJ)) {
            addNumberToTableCell(3, currentColumnIndex, vM - vJ);
            addDataToTableCell(4, currentColumnIndex, Math.floor(vJ / vM * 100), true);
          } else {
            table2.rows[4].cells[currentColumnIndex].innerText = '0%';
            table2.rows[4].cells[currentColumnIndex].style.textAlign = "right";
          }

          const h2Title = (document.querySelector("div.asilScroll div.apt_info div.hgroup h2.h2")
                           || document.querySelector("h2.h2"));
          addDataToTableCell(0, 0, h2Title ? h2Title.innerText : '');

          const ths = document.querySelectorAll("#tbl_price th");
          ths.forEach(cell => {
            let fontSize = 14;
            const cellWidth = parseInt(cell.style.width||'76',10);
            while (cell.scrollWidth > cellWidth && fontSize > 10) {
              fontSize--; cell.style.fontSize = fontSize + "px";
            }
          });
          currentColumnIndex++;
        }
      }
    });

    // ✅ 바인딩 표시 플래그
    chartElement.dataset.asilMouseupBound = '1';
  }, 1000);
}

    window.asilMouseupEventAdd = mouseupEventAdd;
    mouseupEventAdd();


     /* ===== chartPData 변경 감지 훅 (재할당/내부변경 모두 트리거) ===== */
/* ===== chartPData 변경 감지 훅 (재바인딩도 감지: 바인딩 토큰 스탬프) ===== */
/* ===== chartPData 변경 감지 훅 (재바인딩도 감지: 바인딩 토큰 + 재후킹 가드) ===== */
(function hookChartPDataChanges(){
  if (window.__asil_chartp_hook_installed) return;
  window.__asil_chartp_hook_installed = true;

  // 디바운스: 잦은 변경 묶기
  const debounce = (fn, ms=150) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; };

  // 변경/재바인딩 시 실행
  const onChanged = debounce(() => {
    try { window.asilMouseupEventAdd?.(); } catch(_) {}
    try { showGapSpan?.(); } catch(_) {}
  }, 150);

  // 배열 내부 set 감지 프록시
  const proxifyArray = (arr) => {
    if (!Array.isArray(arr)) return arr;
    if (arr.__asilProxied) return arr;
    const p = new Proxy(arr, {
      set(target, prop, value){
        const ret = Reflect.set(target, prop, value);
        if (prop !== 'length' || value !== target.length) onChanged();
        return ret;
      }
    });
    Object.defineProperty(p, '__asilProxied', { value:true, enumerable:false });
    return p;
  };

  // 바인딩 토큰
  let __asil_last_bind_token = '';
  function __asil_stamp_bind(obj) {
    const token = `bind:${Date.now()}:${Math.random().toString(36).slice(2, 8)}`;
    try {
      Object.defineProperty(obj, '__asilBindToken', {
        value: token, writable: true, configurable: true, enumerable: false
      });
    } catch(_) { try { obj.__asilBindToken = token; } catch(_) {} }
    return token;
  }

  // 현재 값 저장
  let _val = ('chartPData' in window) ? proxifyArray(window.chartPData) : undefined;

  // 세터/게터 설치 함수 (configurable:false 로 고정)
  const OWNER_MARK = Symbol('asilChartHook');
  function installAccessor() {
    const desc = Object.getOwnPropertyDescriptor(window, 'chartPData');
    // 이미 우리 훅이면 패스
    if (desc && desc.get && desc.get[OWNER_MARK]) return true;

    try {
      Object.defineProperty(window, 'chartPData', {
        configurable: false, // ← 중요: var/재정의가 못 덮어쓰게
        enumerable: true,
        get: (function(){ function g(){ return _val; } g[OWNER_MARK]=true; return g; })(),
        set(v){
          try { __asil_stamp_bind(v); } catch(_) {}
          _val = proxifyArray(v);
          const curToken = (v && v.__asilBindToken) ? v.__asilBindToken : '';
          if (curToken !== __asil_last_bind_token) {
            __asil_last_bind_token = curToken;
            onChanged(); // 동일 값/참조여도 "새 바인딩"이면 반드시 실행
          }
        }
      });
      return true;
    } catch (e) {
      // 이미 non-configurable 데이터 프로퍼티로 박혀 있으면 여기서 교체 불가
      return false;
    }
  }

  // 1) 즉시 설치 시도
  const ok = installAccessor();

  // 2) 실패했거나, 이후에 누가 덮어쓰는 경우를 위해 가드 루프
  let guardTicks = 0;
  const guard = setInterval(() => {
    const desc = Object.getOwnPropertyDescriptor(window, 'chartPData');
    const ours = !!(desc && desc.get && desc.get[OWNER_MARK]);
    if (!ours) {
      installAccessor();
    }
    // 초기 10초(≈50회) 정도만 과도한 감시, 이후 느슨하게
    guardTicks++;
    if (guardTicks === 50) { clearInterval(guard); slowGuard(); }
  }, 200);

  function slowGuard(){
    setInterval(() => {
      const desc = Object.getOwnPropertyDescriptor(window, 'chartPData');
      const ours = !!(desc && desc.get && desc.get[OWNER_MARK]);
      if (!ours) installAccessor();
    }, 2000);
  }

  // 3) 폴백: 아예 접근자 설치가 불가한 환경 — 시그니처 폴링
  if (!ok) {
    let lastSig = '';
    setInterval(() => {
      try {
        const d = window.chartPData;
        const sig = Array.isArray(d)
          ? `${d.length}:${d[0]?.date||''}:${d[d.length-1]?.date||''}:${d[0]?.M||''}:${d[0]?.J||''}`
          : String(d);
        if (sig !== lastSig) { lastSig = sig; onChanged(); }
      } catch(_) {}
    }, 300);
  }

  // 초기 1회 실행
  onChanged();
})();




/*
    const slider = document.querySelector('.slider_year_wrap');
    if (slider) slider.addEventListener('mouseup', mouseupEventAdd);

    const obs1 = new MutationObserver(() => mouseupEventAdd());
    const t1 = document.querySelector('#txtPy');
    if (t1) obs1.observe(t1, { childList:true, characterData:true, subtree:true });
*/
    const obs2 = new MutationObserver(() => showGapSpan());
    const t2 = document.querySelector('#chart_info_m');
    if (t2) obs2.observe(t2, { childList:true, characterData:true, subtree:true });

    function createTable(option) {
      const priceTableDiv = document.createElement('div');
      Object.assign(priceTableDiv.style, {
        position:'absolute', left:'0', top:'617px', backgroundColor:'#fff', zIndex:'9999'
      });
      priceTableDiv.id = "priceTableDiv";
      if (option === "close") {
        document.getElementById("priceTableDiv")?.remove();
        currentColumnIndex = 1;
        return;
      }

      const tableHTML = '<table id="tbl_price" border="1" style="width:100%; height:110px">'+
        '<tr><th style="width:76px; background-color:#FAFAFA;">단지명</th>'+
        '<th style="width:76px; background-color:#FAFAFA;"></th>'+
        '<th style="width:76px; background-color:#FAFAFA;"></th>'+
        '<th style="width:76px; background-color:#FAFAFA;"></th>'+
        '<th style="width:76px; background-color:#FAFAFA;"></th></tr>'+
        '<tr><th style="width:76px; background-color:#FAFAFA;">매매</th>'+
        '<th style="width:76px"></th><th style="width:76px"></th>'+
        '<th style="width:76px"></th><th style="width:76px"></th></tr>'+
        '<tr><th style="width:76px; background-color:#FAFAFA;">전세</th>'+
        '<th style="width:76px"></th><th style="width:76px"></th>'+
        '<th style="width:76px"></th><th style="width:76px"></th></tr>'+
        '<tr><th style="width:76px; background-color:#FAFAFA;">갭</th>'+
        '<th style="width:76px"></th><th style="width:76px"></th>'+
        '<th style="width:76px"></th><th style="width:76px"></th></tr>'+
        '<tr><th style="width:76px; background-color:#FAFAFA;">전세가율</th>'+
        '<th style="width:76px"></th><th style="width:76px"></th>'+
        '<th style="width:76px"></th><th style="width:76px"></th></tr>'+
        '</table>';

      priceTableDiv.innerHTML = tableHTML;

      function makeBtn(txt, left, w, bg, color, fn){
        const b = document.createElement('button');
        b.innerText = txt;
        Object.assign(b.style, { position:'absolute', left: `${left}px`, width:`${w}px`,
          backgroundColor:bg, color, height:'24px' });
        b.addEventListener('click', fn);
        priceTableDiv.appendChild(b);
        return b;
      }

      const resetBtn = document.createElement('button');
      resetBtn.innerText = '리셋';
      Object.assign(resetBtn.style, { position:'relative', left:'0', width:'50px',
        backgroundColor:'red', color:'#fff', marginBottom:'8px' });
      resetBtn.addEventListener('click', () => {
        document.body.removeChild(priceTableDiv);
        currentColumnIndex = 1;
        createTable("reset");
      });
      priceTableDiv.appendChild(resetBtn);

      makeBtn('취소', 60, 50, '#E97132', '#fff', () => {
        const table = document.getElementById("tbl_price");
        if (table && currentColumnIndex > 1) {
          for (let i=0;i<5;i++) table.rows[i].cells[currentColumnIndex-1].innerText = '';
          currentColumnIndex = Math.max(1, currentColumnIndex - 1);
        }
      });
      makeBtn('닫기', 120, 50, '#000', '#fff', () => createTable("close"));
      makeBtn('전체 복사', 180, 70, '#4EA72E', '#fff', () => { makecomma(); copyResultToClipboard(5); });
      makeBtn('전세까지 복사', 260, 100, '#0F9ED5', '#fff', () => { makecomma(); copyResultToClipboard(3); });

      priceTableDiv.appendChild(document.createElement("br"));

      const moreBtn = document.createElement('button');
      moreBtn.innerText = '거래현황 더보기';
      Object.assign(moreBtn.style, { position:'relative', width:'360px', height:'30px',
        backgroundColor:'#1C32F7', color:'#fff' });
      moreBtn.addEventListener('click', () => { try { viewAll(); } catch(_){} });
      priceTableDiv.appendChild(moreBtn);

      function makecomma() {
        const table = document.getElementById('tbl_price');
        for (let j=4;j>0;j--) {
          for (let k=1;k<3;k++) {
            table.rows[k].cells[j].textContent =
              table.rows[k].cells[j].textContent.toString()
                .replace(/[^0-9.%]/g,'')
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",");
          }
        }
      }
      function copyResultToClipboard(rowNumber) {
        const result = getResult(rowNumber);
        const ta = document.createElement('textarea');
        ta.value = result;
        document.body.appendChild(ta);
        ta.select(); ta.setSelectionRange(0, result.length);
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      function getResult(rowNumber) {
        const table = document.getElementById('tbl_price');
        let out = '';
        for (let i=0;i<rowNumber;i++) {
          const row = table.rows[i];
          const first = row.cells[0].textContent.trim();
          out += first;
          for (let j=1;j<row.cells.length;j++) {
            const cell = row.cells[j];
            const cleaned = cell.textContent.trim().replace(/[^0-9,.%]/g,'');
            out += `\t${cleaned}`;
          }
          out += '\n';
        }
        return out;
      }

      document.body.appendChild(priceTableDiv);

      const tbl = document.getElementById("tbl_price");
      if (tbl) {
        tbl.style.tableLayout = "fixed";
        tbl.style.width  = "380px";
        tbl.style.height = "110px";
        document.querySelectorAll("#tbl_price th").forEach(cell=>{
          cell.style.width = "76px";
          cell.style.height = "22px";
          cell.style.whiteSpace = "nowrap";
          cell.style.overflow   = "hidden";
          cell.style.textOverflow = "ellipsis";
        });
      }

      if (option === "initial" || option === "reset") {
        document.getElementById('tbl_price').addEventListener('input', function() {
          const table = document.getElementById('tbl_price');
          for (let j=1;j<5;j++) {
            const sale = table.rows[1].cells[j].textContent.trim().replace(/[^0-9.%]/g,'');
            const rent = table.rows[2].cells[j].textContent.trim().replace(/[^0-9.%]/g,'');
            const s = +sale, r = +rent;
            if (sale !== "" && Number.isFinite(s) && Number.isFinite(r)) {
              table.rows[3].cells[j].textContent = (s-r).toLocaleString();
              table.rows[4].cells[j].textContent = `${Math.floor(r/s*100)}%`;
            }
          }
          outer: for (let j=4;j>0;j--) {
            for (let k=0;k<3;k++) {
              if (table.rows[k].cells[j].textContent) { currentColumnIndex = j+1; break outer; }
            }
          }
        });
      }

      if (chartElement && chartElement.dataset.asilRevealBound !== '1') {
  chartElement.addEventListener('mouseup', () => {
    const div = document.getElementById("priceTableDiv");
    if (div) div.style.display = "block";
  });
  chartElement.dataset.asilRevealBound = '1';
}


      tbl?.setAttribute('contenteditable', 'true');
    }
  }




})();


/* ===== chartPData 강제 프록시 래핑 (configurable:false 대응) ===== */
(function forceWrapChartPData(){
  // onChanged: 바뀌었을 때 실행할 기존 콜백 재사용
  const debounce = (fn, ms=150) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a), ms); }; };
  const onChanged = debounce(() => {
    try { window.asilMouseupEventAdd?.(); } catch(_) {}
    try { showGapSpan?.(); } catch(_) {}
  }, 150);

  // 배열 내부 변경 감지용 프록시
  const proxifyArray = (arr) => {
    if (!Array.isArray(arr)) return arr;
    if (arr.__asilProxied) return arr;
    const p = new Proxy(arr, {
      set(target, prop, value){
        const ret = Reflect.set(target, prop, value);
        if (prop !== 'length' || value !== target.length) onChanged();
        return ret;
      }
    });
    Object.defineProperty(p, '__asilProxied', { value:true, enumerable:false });
    return p;
  };

  // 현재 상태 점검
  const desc = Object.getOwnPropertyDescriptor(window, 'chartPData');
  // 없으면 할 일 없음
  if (!desc) return;

  // 이미 접근자(get/set)로 후킹된 경우(다른 코드가 심어둔 경우) -> 여기서 추가 조치 불필요
  if (desc.get || desc.set) return;

  // 핵심: configurable:false 여서 접근자 교체 불가. 하지만 writable:true면 값(배열)을 프록시로 교체 가능.
  if (desc.writable) {
    const stamp = () => `bind:${Date.now()}:${Math.random().toString(36).slice(2,8)}`;

    const wrapOnce = () => {
      try {
        const cur = window.chartPData;
        // 배열이면서 아직 우리 프록시가 아니면 프록시로 교체 + 바인딩 토큰 부여 + 즉시 트리거
        if (Array.isArray(cur) && !cur.__asilProxied) {
          const proxied = proxifyArray(cur);
          // 바인딩(재대입) 흔적: 값/내용 동일해도 새 교체 시마다 토큰 갱신되어 구분 가능
          try { Object.defineProperty(proxied, '__asilBindToken', { value: stamp(), enumerable:false, configurable:true, writable:true }); }
          catch(_) { proxied.__asilBindToken = stamp(); }
          window.chartPData = proxied;   // ← writable 이므로 대입 가능
          onChanged();                    // ← 교체 직후 한 번 실행 (초기 반영)
        }
      } catch(_) {}
    };

    // 최초 1회 시도
    wrapOnce();

    // 가드: 사이트가 나중에 새 배열로 갈아끼우면 다시 프록시로 교체
    // (프록시가 빠졌거나, 레퍼런스가 바뀐 경우에만 wrap)
    setInterval(() => {
      try {
        const cur = window.chartPData;
        if (Array.isArray(cur) && !cur.__asilProxied) {
          wrapOnce(); // 재프록시 + onChanged()
        }
      } catch(_) {}
    }, 250);
  }
})();


