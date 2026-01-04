// ==UserScript==
// @name        [루시퍼홍] 아실차트 호갱노노처럼
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/app/apt_info.jsp?*
// @grant       none
// @version     2.1
// @author      -
// @description Shift+두 번 클릭으로 기간 선택(차트 재생성 안전). updateChartInfo의 크기/구성은 그대로 유지. 정확한 팝업 식별자 사용.
// @downloadURL https://update.greasyfork.org/scripts/525618/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%EC%B0%A8%ED%8A%B8%20%ED%98%B8%EA%B0%B1%EB%85%B8%EB%85%B8%EC%B2%98%EB%9F%BC.user.js
// @updateURL https://update.greasyfork.org/scripts/525618/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%EC%B0%A8%ED%8A%B8%20%ED%98%B8%EA%B0%B1%EB%85%B8%EB%85%B8%EC%B2%98%EB%9F%BC.meta.js
// ==/UserScript==




(function () {
  'use strict';

  const currentVersion = GM_info.script.version;
  const scriptName = GM_info.script.name;
  console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
  const updateUrl = GM_info.script.updateURL;
  const cafeUrl = 'https://cafe.naver.com/wecando7/11409886';
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

  /* ======================= 0) 안전 유틸 ======================= */
  const isNode = (v) => v instanceof Node;
  const safeAppend = (parent, child, where = 'appendChild') => {
    try {
      if (!parent) return;
      if (!isNode(child)) {
        console.warn('[ASIL][safeAppend] non-Node to', where, '→', child);
        if (typeof child === 'string') {
          const frag = document.createDocumentFragment();
          const tmp = document.createElement('div');
          tmp.innerHTML = child;
          while (tmp.firstChild) frag.appendChild(tmp.firstChild);
          parent.appendChild(frag);
        }
        return;
      }
      parent.appendChild(child);
    } catch (e) {
      console.error('[ASIL][safeAppend] failed:', e, 'child=', child);
    }
  };
  const safeInsert = (el, html, pos = 'beforeend') => {
    try { el?.insertAdjacentHTML(pos, html); }
    catch (e) { console.error('[ASIL][safeInsert] failed:', e); }
  };
  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  /* ======================= 1) 상태/파서 ======================= */
  const getChart = () => document.querySelector('.rMateH5__Combination2DChart') || null;

  // 오버레이
  let backgroundArea, startLine, endLine;

  // 팝업과 닫기 버튼
  let chartInfoDiv, closeButton;

  // 선택 상태
  let startDate = null, endDate = null;
  let startPriceM = null, endPriceM = null;
  let startPriceJ = null, endPriceJ = null;
  let firstClick = true;
  let startClientX = null; // clientX를 보관

  // YYYY/MM -> YYYYMM
  const parseDateToNumber = (s) => (s && typeof s === 'string') ? parseInt(s.replace('/',''),10) : 0;

  function findNearestPrevJeonse(clickedDate) {
    if (!window.chartPData || !Array.isArray(chartPData)) return { jeonse: 0, date: 'N/A' };
    const clickedNum = parseDateToNumber(clickedDate);
    for (let i = chartPData.length - 1; i >= 0; i--) {
      const n = parseDateToNumber(chartPData[i].date);
      const j = parseInt(chartPData[i].J, 10);
      if (n < clickedNum && j > 0) return { jeonse: j, date: chartPData[i].date };
    }
    return { jeonse: 0, date: 'N/A' };
  }

  function getCurrentChartData() {
    const rawDate = document.getElementById('chart_info_yyyymm')?.innerText || 'N/A';
    const parseToYYYYMM = (s) => {
      const re = /(\d{2})년\s*(\d{1,2})월/; const m = s.match(re);
      if (m) { const y=2000+parseInt(m[1],10); const mo=String(parseInt(m[2],10)).padStart(2,'0'); return `${y}${mo}`; }
      return 'N/A';
    };
    const date = parseToYYYYMM(rawDate);

    const mTxt = document.getElementById('chart_info_m')?.innerText || '';
    const jTxt = document.getElementById('chart_info_j')?.innerText || '';
    const rm = /매매\s+([\d,]+)/.exec(mTxt);
    const rj = /전세\s+([\d,]+)/.exec(jTxt);
    const priceM = rm ? parseInt(rm[1].replace(/,/g,''),10) : 0;
    const priceJ = rj ? parseInt(rj[1].replace(/,/g,''),10) : 0;
    return { date, priceM, priceJ };
  }

  /* ======================= 2) 좌표 유틸 ======================= */
  function getChartMetrics(chart){
    const rect = chart.getBoundingClientRect();
    const parentRect = chart.parentElement.getBoundingClientRect();
    return {
      rect,
      leftInParent: rect.left - parentRect.left,
      topInParent:  rect.top  - parentRect.top,
      width: rect.width,
      height: rect.height
    };
  }

  /* ======================= 3) UI 생성 ======================= */
  function ensureOverlayAndPopup() {
    const chart = getChart();
    if (!chart) return null;
    const parent = chart.parentElement || chart;

    // 차트 부모를 기준으로 모두 배치
    const cs = getComputedStyle(parent);
    if (cs.position === 'static') parent.style.position = 'relative';
    // 차트 영역 밖의 오버레이는 잘라냄
    parent.style.overflow = 'hidden';

    if (!backgroundArea) {
      backgroundArea = document.createElement('div');
      Object.assign(backgroundArea.style, {
        position:'absolute',
        backgroundColor:'rgba(173,216,230,0.2)',
        display:'none',
        zIndex:'2',
        pointerEvents:'none'
      });
      safeAppend(parent, backgroundArea, 'backgroundArea');
    } else if (backgroundArea.parentElement !== parent) safeAppend(parent, backgroundArea, 'reparent backgroundArea');

    if (!startLine) {
      startLine = document.createElement('div');
      Object.assign(startLine.style, {
        position:'absolute',
        width:'2px',
        backgroundColor:'red',
        display:'none',
        zIndex:'3',
        top:'0px',
        pointerEvents:'none',
        transform:'translateX(-1px)'   // ← 2px 라인의 중앙을 포인터와 정렬
      });
      safeAppend(parent, startLine, 'startLine');
    } else if (startLine.parentElement !== parent) safeAppend(parent, startLine, 'reparent startLine');

    if (!endLine) {
      endLine = document.createElement('div');
      Object.assign(endLine.style, {
        position:'absolute',
        width:'2px',
        backgroundColor:'red',
        display:'none',
        zIndex:'3',
        top:'0px',
        pointerEvents:'none',
        transform:'translateX(-1px)'   // ← 동일 보정
      });
      safeAppend(parent, endLine, 'endLine');
    } else if (endLine.parentElement !== parent) safeAppend(parent, endLine, 'reparent endLine');

    if (!chartInfoDiv) {
      chartInfoDiv = document.createElement('div');
      chartInfoDiv.id = '__hongbu_chart_info';
      Object.assign(chartInfoDiv.style, {
        position:'absolute',                // 스크롤을 따라오게 absolute 유지
        backgroundColor:'#fff', padding:'10px', border:'1px solid #ccc',
        borderRadius:'8px', boxShadow:'0 2px 5px rgba(0,0,0,.2)',
        fontFamily:'Arial, sans-serif', fontSize:'14px',
        display:'none', zIndex:'10000', left:'0px'
      });
      safeAppend(document.body, chartInfoDiv, 'chartInfoDiv');

      // 작고 우측 상단에 붙일 '✕' 버튼
      closeButton = document.createElement('button');
      closeButton.type = 'button';
      closeButton.textContent = '✕';
      Object.assign(closeButton.style, {
        margin: '0',
        padding: '0 6px',
        height: '20px',
        lineHeight: '20px',
        fontSize: '12px',
        background: '#e5e7eb',
        color: '#111',
        border: '1px solid #d1d5db',
        borderRadius: '4px',
        cursor: 'pointer',
        width: 'auto',
        display: 'inline-block'
      });
      closeButton.addEventListener('click', () => {
        backgroundArea.style.display = 'none';
        startLine.style.display = 'none';
        endLine.style.display = 'none';
        document.querySelectorAll('.custom-horizontal-line').forEach(el => el.remove());
        chartInfoDiv.style.display = 'none';
        firstClick = true;
      });
      // 버튼은 헤더에 붙일 것이므로 여기서는 chartInfoDiv에 바로 append하지 않음
    }

    return chart;
  }

  /* ======================= 4) 팝업 본문/위치 ======================= */
  function updateChartInfo(startDate, endDate, startPriceM, endPriceM, startPriceJ, endPriceJ) {
    let 매매거래량 = 0, 전월세거래량 = 0;

    if (Array.isArray(window.chartPData)) {
      chartPData.forEach((d) => {
        const dn = parseDateToNumber(d.date);
        const sn = parseDateToNumber(startDate);
        const en = parseDateToNumber(endDate);
        if (dn >= sn && dn <= en) {
          매매거래량   += parseInt(d.M_CNT, 10) || 0;
          전월세거래량 += parseInt(d.J_CNT, 10) || 0;
        }
      });
    }

    const 매매변동 = endPriceM - startPriceM;
    const 전세변동 = endPriceJ - startPriceJ;
    const 매매상승률 = startPriceM > 0 ? ((매매변동 / startPriceM) * 100).toFixed(2) : "0.00";
    const 전세상승률 = startPriceJ > 0 ? ((전세변동 / startPriceJ) * 100).toFixed(2) : "0.00";

    const max거래량 = Math.max(매매거래량, 전월세거래량);
    const maxBarLength = 200;
    const 매매길이 = max거래량 > 0 ? (매매거래량 / max거래량) * maxBarLength : 0;
    const 전세길이 = max거래량 > 0 ? (전월세거래량 / max거래량) * maxBarLength : 0;

    const 투자금 = startPriceM - startPriceJ;
    const 수익 = endPriceM - startPriceM;
    const 수익률 = 투자금 > 0 ? ((수익 / 투자금) * 100).toFixed(2) : "0.00";

    const sY = parseInt(startDate.slice(0,4),10);
    const sM = parseInt(startDate.slice(4,6),10);
    const eY = parseInt(endDate.slice(0,4),10);
    const eM = parseInt(endDate.slice(4,6),10);
    let years = eY - sY, months = eM - sM;
    if (months < 0) { years -= 1; months += 12; }
    const 기간 = `${years}년 ${months}개월`;
    const fmtKR = (d) => `${d.slice(0,4)}년 ${String(+d.slice(4,6))}월`;

    // 헤더를 flex로 만들고, 오른쪽 박스에 버튼을 붙임
    const html = `
      <div id="__hongbu_header"
           style="display:flex;align-items:center;justify-content:space-between;
                  gap:8px;margin-bottom:8px;font-size:13px;font-weight:bold;">
        <div>
          <span style="color:#333;">${fmtKR(startDate)}</span> ~
          <span style="color:#333;">${fmtKR(endDate)}</span>
          <span style="font-size:13px;color:#333;">(${기간})</span>
        </div>
        <div id="__hongbu_header_right" style="display:flex;align-items:center;gap:6px;"></div>
      </div>

      <div style="margin-bottom:3px;">
        <span style="color:#5F90F6;font-weight:bold;">매매</span>:
        <span style="color:#5F90F6;font-weight:bold;">${startPriceM.toLocaleString()} → ${endPriceM.toLocaleString()}</span>
        <span style="color:#5F90F6;font-weight:bold;">(${매매상승률}%)</span>
        <span>(${매매변동.toLocaleString()}만원)</span>
      </div>
      <div style="margin-bottom:3px;">
        <span style="color:#FF7C53;font-weight:bold;">전세</span>:
        <span style="color:#FF7C53;font-weight:bold;">${startPriceJ.toLocaleString()} → ${endPriceJ.toLocaleString()}</span>
        <span style="color:#FF7C53;font-weight:bold;">(${전세상승률}%)</span>
        <span>(${전세변동.toLocaleString()}만원)</span>
      </div>
      <div style="margin-bottom:3px;">
        <span style="color:red;font-weight:bold;">수익률</span>:
        <span style="color:red;font-weight:bold;">수익 ${수익.toLocaleString()} / 투자금 ${투자금.toLocaleString()}</span>
        <span style="color:red;font-weight:bold;">(${수익률}%)</span>
      </div>
      <div style="margin-top:0px;">
        <strong>거래량</strong>
        <div style="margin-top:5px;display:flex;align-items:center;">
          <div style="background:#5F90F6;height:15px;width:${매매길이}px;margin-right:10px;"></div> 매매: ${매매거래량}건
        </div>
        <div style="margin-top:0px;display:flex;align-items:center;">
          <div style="background:#FF7C53;height:15px;width:${전세길이}px;margin-right:10px;"></div> 전세: ${전월세거래량}건
        </div>
      </div>
    `;
    chartInfoDiv.style.display = 'block';
    chartInfoDiv.innerHTML = '';
    safeInsert(chartInfoDiv, html, 'afterbegin');

    // 헤더 오른쪽에 닫기 버튼 부착
    const rightBox = document.getElementById('__hongbu_header_right');
    if (rightBox) safeAppend(rightBox, closeButton, 'append closeButton to header');

    const chart = getChart();
    const metrics = chart ? getChartMetrics(chart) : { width:0, rect:{bottom:0,left:0} };
    chartInfoDiv.style.width = `${metrics.width}px`;
  }

  // 스크롤 따라오도록 위치 보정
  function positionInfoNearChart() {
    const chart = getChart();
    const info  = document.getElementById('__hongbu_chart_info');
    if (!chart || !info || info.style.display === 'none') return;

    const rect = chart.getBoundingClientRect();
    info.style.position = 'absolute';
    info.style.zIndex   = '2147483647';
    info.style.left     = "16px";
    info.style.top      = (window.scrollY + rect.bottom) + 'px';
  }

  if (!window.__hongbuInfoFollowScroll) {
    window.__hongbuInfoFollowScroll = true;
    const rebounce = (() => { let raf=null; return ()=>{ if(raf) cancelAnimationFrame(raf); raf=requestAnimationFrame(positionInfoNearChart);} })();
    window.addEventListener('scroll', rebounce, { passive:true });
    window.addEventListener('resize', rebounce);
  }

  /* ======================= 5) 부팅 ======================= */
  function bootstrap() {
    let tries = 0;
    const tid = setInterval(() => {
      const chart = ensureOverlayAndPopup();
      if (chart) { clearInterval(tid); }
      if (++tries > 40) clearInterval(tid);
    }, 300);
  }
  if (document.readyState === 'complete' || document.readyState === 'interactive') setTimeout(bootstrap, 1500);
  else window.addEventListener('load', () => setTimeout(bootstrap, 1500));

  /* ======================= 6) 위임 mouseup ======================= */
  if (!window.__hongbuShiftDelegated) {
    window.__hongbuShiftDelegated = true;

    document.addEventListener('mouseup', function onChartMouseUp(event) {
      if (event.button !== 0) return; // 좌클릭
      const chart = event.target.closest('.rMateH5__Combination2DChart');
      if (!chart) return;

      ensureOverlayAndPopup();
      const m = getChartMetrics(chart);

      // Ctrl: 수평 가이드
      if (event.ctrlKey) {
        const h = document.createElement('div');
        h.className = 'custom-horizontal-line';
        Object.assign(h.style, {
          position:'absolute',
          left: `${m.leftInParent + 32}px`,
          width:`${m.width - 70}px`,
          height:'2px', backgroundColor:'#008000',
          zIndex:'3',
          top: `${m.topInParent + (event.clientY - m.rect.top)}px`,
          pointerEvents:'none'
        });
        safeAppend(chart.parentElement, h, 'horizontalGuide');
        return;
      }

      if (!event.shiftKey) return;

      const { date, priceM, priceJ } = getCurrentChartData();
      const adjustedPriceJ = priceJ === 0 ? findNearestPrevJeonse(date).jeonse : priceJ;

      if (firstClick) {
        // 시작선
        startDate = date; startPriceM = priceM; startPriceJ = adjustedPriceJ;
        startClientX = event.clientX; firstClick = false;

        const relX1 = clamp(event.clientX - m.rect.left, 0, m.width);
        startLine.style.left   = `${m.leftInParent + relX1}px`;   // ← 보정 제거
        startLine.style.top    = `${m.topInParent}px`;
        startLine.style.height = `${m.height - 30}px`;
        startLine.style.display= 'block';

        // 끝선/영역 숨기기
        endLine.style.display = 'none';
        backgroundArea.style.display = 'none';
      } else {
        // 종료선
        endDate = date; endPriceM = priceM; endPriceJ = adjustedPriceJ;

        const relX1 = clamp(startClientX - m.rect.left, 0, m.width);
        const relX2 = clamp(event.clientX - m.rect.left, 0, m.width);
        const sRel = Math.min(relX1, relX2);
        const eRel = Math.max(relX1, relX2);

        endLine.style.left   = `${m.leftInParent + relX2}px`;     // ← 보정 제거
        endLine.style.top    = `${m.topInParent}px`;
        endLine.style.height = `${m.height - 30}px`;
        endLine.style.display= 'block';

        Object.assign(backgroundArea.style, {
          left: `${m.leftInParent + sRel}px`,                       // ← 보정 제거
          top:  `${m.topInParent}px`,
          width: `${eRel - sRel}px`,
          height:`${m.height - 30}px`,
          display:'block'
        });

        updateChartInfo(startDate, endDate, startPriceM, endPriceM, startPriceJ, endPriceJ);
        positionInfoNearChart();

        // 다음 선택을 위해 초기화
        firstClick = true;
      }
    }, { capture:true, passive:true });
  }

  /* ======================= 7) 상태 리셋 ======================= */
  function hideAllOverlays() {
    if (startLine) startLine.style.display = 'none';
    if (endLine) endLine.style.display = 'none';
    if (backgroundArea) backgroundArea.style.display = 'none';
  }

  const slider = document.querySelector('.slider_year_wrap');
  if (slider && !slider.__hongbuBound) {
    slider.__hongbuBound = true;
    slider.addEventListener('mouseup', () => {
      setTimeout(() => { chartInfoDiv && (chartInfoDiv.style.display = 'none'); firstClick = true; }, 10);
    });
  }
  const targetNode = document.querySelector('#txtPy');
  if (targetNode && !targetNode.__hongbuObserved) {
    targetNode.__hongbuObserved = true;
    const observer = new MutationObserver(() => { chartInfoDiv && (chartInfoDiv.style.display = 'none'); firstClick = true; });
    observer.observe(targetNode, { characterData:true, childList:true, subtree:true });
  }
})();
