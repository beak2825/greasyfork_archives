// ==UserScript==
// @name         MES(Mobile Element Selector)
// @author       삼플
// @version      1.2.8
// @description  Material M3의 진보한 디자인, 아름다운 애니메이션, 완벽한 기능을 가진 모바일 요소 선택기
// @match        *://*/*
// @license      MIT
// @grant        GM_setClipboard
// @grant        GM_setValue
// @grant        GM_getValue
// @namespace https://adguard.com
// @downloadURL https://update.greasyfork.org/scripts/534270/MES%28Mobile%20Element%20Selector%29.user.js
// @updateURL https://update.greasyfork.org/scripts/534270/MES%28Mobile%20Element%20Selector%29.meta.js
// ==/UserScript==

(async function() {
	'use strict';
	const SCRIPT_ID = "[MES v1.2.8 M3]";
	const ADGUARD_LOGO_URL = 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4c/AdGuard.svg/500px-AdGuard.svg.png';

	const STRINGS = {
		panelTitle: '요소 차단',
		settingsTitle: 'MES by 삼플',
		listTitle: '저장된 차단 규칙',
		selectedElementLabel: '선택된 요소 (CSS 선택자)',
		parentLevelLabel: '상위 요소 선택 레벨:',
		copy: '복사',
		preview: '미리보기',
		restorePreview: '되돌리기',
		saveRule: '규칙 저장',
		list: '목록',
		settings: '설정',
		cancel: '취소',
		close: '닫기',
		includeSiteNameLabel: '규칙에 사이트명 포함',
		useAdguardLogoLabel: '토글 버튼 AdGuard 로고',
		panelOpacityLabel: '패널 투명도',
		toggleSizeLabel: '토글 버튼 크기',
		toggleOpacityLabel: '토글 버튼 투명도',
		tempDisableLabel: '모든 규칙 임시 비활성화',
		backupLabel: '규칙 백업 (JSON)',
		restoreLabel: '규칙 복원 (JSON)',
		togglePositionLabel: '토글 버튼 위치',
		posTopLeft: '좌상',
		posTopRight: '우상',
		posBottomLeft: '좌하',
		posBottomRight: '우하',
		on: 'ON',
		off: 'OFF',
		noRules: '저장된 규칙이 없습니다.',
		noElementSelected: '⚠️ 선택된 요소가 없습니다.',
		cannotGenerateSelector: '❌ 유효한 선택자를 생성할 수 없습니다.',
		selectorCopied: '✅ 선택자가 복사되었습니다!',
		clipboardError: '❌ 클립보드 복사 실패',
		promptCopy: '선택자를 직접 복사하세요:',
		alreadyHidden: 'ℹ️ 이미 숨겨진 요소입니다.',
		previewDifferentElement: '⚠️ 다른 요소가 미리보기 중입니다.',
		ruleSavedReloading: '✅ 규칙 저장됨! 적용 중...',
		ruleSavedApplyFailed: '⚠️ 규칙은 저장했으나 즉시 적용 실패.',
		ruleAddError: '❌ 규칙 추가 중 오류:',
		ruleExists: 'ℹ️ 이미 저장된 규칙입니다.',
		listShowError: '❌ 목록 표시 중 오류 발생',
		ruleCopied: '✅ 규칙 복사됨',
		ruleDeleted: '🗑️ 규칙 삭제됨',
		ruleDeleteError: '❌ 규칙 삭제 실패',
		settingsSaved: '✅ 설정 저장됨',
		settingsSaveError: '❌ 설정 저장 실패',
		backupStarting: '💾 규칙 백업 파일 다운로드를 시작합니다.',
		backupError: '❌ 규칙 백업 실패',
		restorePrompt: '📁 복원할 JSON 파일을 선택하세요.',
		restoreSuccess: '✅ 규칙 복원 완료! 적용 중...',
		restoreErrorInvalidFile: '❌ 잘못된 파일 형식 또는 내용입니다.',
		restoreErrorGeneral: '❌ 규칙 복원 실패',
		blockingApplied: (count) => `✅ ${count}개의 규칙 적용됨`,
		blockingApplyError: '❌ 규칙 적용 중 오류 발생',
		tempBlockingOn: '🚫 모든 규칙 임시 비활성화됨',
		tempBlockingOff: '✅ 규칙 다시 활성화됨'
	};

	const DEFAULT_SETTINGS = {
		includeSiteName: true,
		panelOpacity: 0.65,
		toggleSizeScale: 1.0,
		toggleOpacity: 1.0,
		showAdguardLogo: false,
		tempBlockingDisabled: false,
		toggleBtnCorner: 'bottom-right'
	};

	let settings = {};
	const SETTINGS_KEY = 'mobileElementSelectorSettings_v1_2';
	const BLOCKED_SELECTORS_KEY = 'mobileBlockedSelectors_v2';

	async function loadSettings() {
		let storedSettings = {};
		try {
			const storedValue = await GM_getValue(SETTINGS_KEY, JSON.stringify(DEFAULT_SETTINGS));
			storedSettings = JSON.parse(storedValue || '{}');
		} catch (e) {
			console.error(SCRIPT_ID, `Error loading settings from GM_getValue('${SETTINGS_KEY}'), using defaults.`, e);
			storedSettings = {
				...DEFAULT_SETTINGS
			};
		}

		settings = {
			...DEFAULT_SETTINGS,
			...storedSettings
		};

		settings.panelOpacity = parseFloat(settings.panelOpacity);
		if (isNaN(settings.panelOpacity) || settings.panelOpacity < 0.1 || settings.panelOpacity > 1.0) {
			settings.panelOpacity = DEFAULT_SETTINGS.panelOpacity;
		}
		settings.toggleSizeScale = parseFloat(settings.toggleSizeScale);
		if (isNaN(settings.toggleSizeScale) || settings.toggleSizeScale < 0.5 || settings.toggleSizeScale > 2.0) {
			settings.toggleSizeScale = DEFAULT_SETTINGS.toggleSizeScale;
		}
		settings.toggleOpacity = parseFloat(settings.toggleOpacity);
		if (isNaN(settings.toggleOpacity) || settings.toggleOpacity < 0.1 || settings.toggleOpacity > 1.0) {
			settings.toggleOpacity = DEFAULT_SETTINGS.toggleOpacity;
		}
		settings.includeSiteName = typeof settings.includeSiteName === 'boolean' ? settings.includeSiteName : DEFAULT_SETTINGS.includeSiteName;
		settings.showAdguardLogo = typeof settings.showAdguardLogo === 'boolean' ? settings.showAdguardLogo : DEFAULT_SETTINGS.showAdguardLogo;
		settings.tempBlockingDisabled = typeof settings.tempBlockingDisabled === 'boolean' ? settings.tempBlockingDisabled : DEFAULT_SETTINGS.tempBlockingDisabled;

		const validCorners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
		if (!validCorners.includes(settings.toggleBtnCorner)) {
			settings.toggleBtnCorner = DEFAULT_SETTINGS.toggleBtnCorner;
		}

		console.log(SCRIPT_ID, "Settings loaded:", settings);
	}

	async function saveSettings() {
		try {
			await GM_setValue(SETTINGS_KEY, JSON.stringify(settings));
			console.log(SCRIPT_ID, "Settings saved:", settings);
		} catch (e) {
			console.error(SCRIPT_ID, `Error saving settings to GM_setValue('${SETTINGS_KEY}')`, e);
			showToast(STRINGS.settingsSaveError, 'error');
		}
	}

	const style = document.createElement('style');

	function updateCSSVariables() {
		document.documentElement.style.setProperty('--panel-opacity', settings.panelOpacity);
		document.documentElement.style.setProperty('--toggle-size', `${56 * settings.toggleSizeScale}px`);
		document.documentElement.style.setProperty('--toggle-opacity', settings.toggleOpacity);

		document.querySelectorAll('#mobile-block-panel, #mobile-settings-panel, #mobile-blocklist-panel').forEach(p => {
			p.style.setProperty('background-color', `rgba(40, 43, 48, ${settings.panelOpacity})`, 'important');
		});
		if (toggleBtn) {
			toggleBtn.style.setProperty('width', `var(--toggle-size)`, 'important');
			toggleBtn.style.setProperty('height', `var(--toggle-size)`, 'important');
			toggleBtn.style.setProperty('opacity', `var(--toggle-opacity)`, 'important');
		}
	}

	function applyToggleBtnPosition() {
		if (!toggleBtn) return;

		toggleBtn.style.top = 'auto';
		toggleBtn.style.left = 'auto';
		toggleBtn.style.bottom = 'auto';
		toggleBtn.style.right = 'auto';
		toggleBtn.style.transform = '';

		const margin = '20px';

		switch (settings.toggleBtnCorner) {
			case 'top-left':
				toggleBtn.style.top = margin;
				toggleBtn.style.left = margin;
				break;
			case 'top-right':
				toggleBtn.style.top = margin;
				toggleBtn.style.right = margin;
				break;
			case 'bottom-left':
				toggleBtn.style.bottom = margin;
				toggleBtn.style.left = margin;
				break;
			case 'bottom-right':
			default:
				toggleBtn.style.bottom = margin;
				toggleBtn.style.right = margin;
				break;
		}
		console.log(SCRIPT_ID, "Applied toggle button corner:", settings.toggleBtnCorner);
	}

	style.textContent = `
:root {
    --md-sys-color-primary: #a0c9ff; --md-sys-color-on-primary: #00325a;
    --md-sys-color-primary-container: #004880; --md-sys-color-on-primary-container: #d1e4ff;
    --md-sys-color-secondary: #bdc7dc; --md-sys-color-on-secondary: #283141;
    --md-sys-color-secondary-container: #3e4758; --md-sys-color-on-secondary-container: #dae2f9;
    --md-sys-color-tertiary: #e0bddd; --md-sys-color-on-tertiary: #402843;
    --md-sys-color-tertiary-container: #583e5a; --md-sys-color-on-tertiary-container: #fdd9fa;
    --md-sys-color-error: #ffb4ab; --md-sys-color-on-error: #690005;
    --md-sys-color-error-container: #93000a; --md-sys-color-on-error-container: #ffdad6;
    --md-sys-color-background: #1a1c1e; --md-sys-color-on-background: #e3e2e6;
    --md-sys-color-surface: #1a1c1e; --md-sys-color-on-surface: #e3e2e6;
    --md-sys-color-surface-variant: #43474e; --md-sys-color-on-surface-variant: #c3c6cf;
    --md-sys-color-outline: #8d9199; --md-sys-color-shadow: #000000;
    --md-sys-color-inverse-surface: #e3e2e6; --md-sys-color-inverse-on-surface: #2f3033;
    --md-sys-color-surface-container-high: rgba(227, 226, 230, 0.16);
    --md-sys-color-success: #90ee90; --md-sys-color-success-container: rgba(144, 238, 144, 0.1);
    --md-sys-color-warning: #ffcc80;
    --panel-opacity: ${DEFAULT_SETTINGS.panelOpacity};
    --toggle-size: ${56 * DEFAULT_SETTINGS.toggleSizeScale}px;
    --toggle-opacity: ${DEFAULT_SETTINGS.toggleOpacity};
    --md-ref-typeface-plain: 'Roboto', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
    --md-sys-typescale-body-large-font-family: var(--md-ref-typeface-plain);
    --md-sys-typescale-body-large-font-size: 16px;
    --md-sys-typescale-label-large-font-size: 14px;
    --md-sys-typescale-label-medium-font-size: 12px;
    --md-sys-typescale-label-small-font-size: 11px;
    --md-sys-typescale-title-medium-font-size: 18px;
}

.scrollable-container {
    position: relative;
    overflow-y: auto;
    max-height: 70vh;
    padding: 20px;
    -webkit-mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
    mask-image: linear-gradient(to bottom, transparent 0%, black 20%, black 80%, transparent 100%);
    
    scrollbar-width: none;
    -ms-overflow-style: none;
}
.scrollable-container::-webkit-scrollbar {
    display: none;
}

.mobile-block-ui { z-index: 2147483646 !important; touch-action: manipulation !important; font-family: var(--md-sys-typescale-body-large-font-family); box-sizing: border-box; position: fixed !important; visibility: visible !important; color: var(--md-sys-color-on-surface); -webkit-tap-highlight-color: transparent !important; }

#mobile-block-panel, #mobile-settings-panel, #mobile-blocklist-panel {
    background-color: rgba(40, 43, 48, var(--panel-opacity)) !important; backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
    color: var(--md-sys-color-on-surface); border-radius: 20px !important;
    box-shadow: 0 12px 17px 2px rgba(0,0,0,0.14), 0 5px 22px 4px rgba(0,0,0,0.12), 0 7px 8px -4px rgba(0,0,0,0.20) !important;
    border: 1px solid rgba(255, 255, 255, 0.12); padding: 18px 20px; width: calc(100% - 40px); max-width: 380px;
    display: none;
    opacity: 0;
    backface-visibility: hidden; -webkit-backface-visibility: hidden; overflow: hidden;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease-out;
    will-change: transform, opacity;
    cursor: grab;
}

#mobile-block-panel { bottom: 20px; left: 50%; transform: translateX(-50%) translateY(100px) scale(0.95); z-index: 2147483645 !important; }
#mobile-settings-panel, #mobile-blocklist-panel { top: 50%; left: 50%; transform: translate(-50%, -50%) scale(0.9); z-index: 2147483647 !important; max-width: 340px; max-height: 90vh;overflow-y: auto;}

#mobile-block-panel.visible {
    opacity: 1;
    transform: translateX(-50%) translateY(0) scale(1);
}
#mobile-settings-panel.visible, #mobile-blocklist-panel.visible {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
}

/* Overrides for dragged panels: transform should only handle scale */
#mobile-block-panel[data-was-dragged="true"] {
    transform: scale(0.95); /* Closed state */
}
#mobile-block-panel[data-was-dragged="true"].visible {
    transform: scale(1); /* Open state */
}
#mobile-settings-panel[data-was-dragged="true"],
#mobile-blocklist-panel[data-was-dragged="true"] {
    transform: scale(0.9); /* Closed state */
}
#mobile-settings-panel[data-was-dragged="true"].visible,
#mobile-blocklist-panel[data-was-dragged="true"].visible {
    transform: scale(1); /* Open state */
}

.mb-panel-title { font-size: var(--md-sys-typescale-title-medium-font-size); font-weight: 500; color: var(--md-sys-color-on-surface); text-align: center; margin: 0 0 24px 0; }

.mb-slider { width: 100%; margin: 15px 0; -webkit-appearance: none; appearance: none; background: var(--md-sys-color-surface-variant); height: 5px; border-radius: 3px; outline: none; cursor: pointer; transition: background 0.3s ease; }
.mb-slider:hover { background: var(--md-sys-color-outline); }
.mb-slider::-webkit-slider-thumb { -webkit-appearance: none; appearance: none; width: 22px; height: 22px; background: var(--md-sys-color-primary); border-radius: 50%; cursor: pointer; border: none; box-shadow: 0 1px 3px rgba(0,0,0,0.4); transition: background 0.3s ease, box-shadow 0.3s ease; }
.mb-slider::-moz-range-thumb { width: 22px; height: 22px; background: var(--md-sys-color-primary); border-radius: 50%; cursor: pointer; border: none; box-shadow: 0 1px 3px rgba(0,0,0,0.4); transition: background 0.3s ease, box-shadow 0.3s ease; }
.mb-slider:active::-webkit-slider-thumb { box-shadow: 0 0 0 10px rgba(var(--md-sys-color-primary-rgb, 160, 201, 255), 0.25); }
.mb-slider:active::-moz-range-thumb { box-shadow: 0 0 0 10px rgba(var(--md-sys-color-primary-rgb, 160, 201, 255), 0.25); }

.selected-element {
    outline: 3px solid var(--md-sys-color-error) !important;
    outline-offset: 2px;
    box-shadow: 0 0 0 9999px rgba(0, 0, 0, 0.45) !important;
    background-color: rgba(255, 82, 82, 0.15) !important;
    z-index: 2147483644 !important;
    transition: background-color 0.1s ease, outline 0.1s ease, box-shadow 0.1s ease;
    pointer-events: none;
}

#mobile-block-toggleBtn {
    z-index: 2147483646 !important; background-color: var(--md-sys-color-primary-container) !important; color: var(--md-sys-color-on-primary-container) !important;
    opacity: var(--toggle-opacity) !important; width: var(--toggle-size) !important; height: var(--toggle-size) !important; border-radius: 18px !important; border: none !important; cursor: pointer !important;
    box-shadow: 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12), 0 3px 5px -1px rgba(0,0,0,0.20) !important;
    transition: background-color 0.3s ease, transform 0.2s ease, box-shadow 0.2s ease, opacity 0.3s ease, border 0.2s ease, top 0.3s ease, left 0.3s ease, bottom 0.3s ease, right 0.3s ease;
    display: flex !important; align-items: center !important; justify-content: center !important; overflow: hidden !important; backface-visibility: hidden; -webkit-backface-visibility: hidden; position: fixed !important; -webkit-tap-highlight-color: transparent !important;
}
#mobile-block-toggleBtn:active { transform: scale(0.95); box-shadow: 0 2px 4px -1px rgba(0,0,0,0.2), 0 4px 5px 0 rgba(0,0,0,0.14), 0 1px 10px 0 rgba(0,0,0,0.12) !important; }
#mobile-block-toggleBtn.selecting {
    background-color: var(--md-sys-color-primary) !important;
    color: var(--md-sys-color-on-primary) !important;
    box-shadow: 0 8px 10px 1px rgba(0,0,0,0.14), 0 3px 14px 2px rgba(0,0,0,0.12), 0 5px 5px -3px rgba(0,0,0,0.20) !important;
}
#mobile-block-toggleBtn .toggle-icon { width: 55%; height: 55%; display: block; margin: auto; background-color: currentColor; mask-size: contain; mask-repeat: no-repeat; mask-position: center; -webkit-mask-size: contain; -webkit-mask-repeat: no-repeat; -webkit-mask-position: center; }
#mobile-block-toggleBtn .toggle-icon-plus { mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>'); -webkit-mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>'); }
#mobile-block-toggleBtn.selecting .toggle-icon-plus { mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>'); -webkit-mask-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" height="24px" viewBox="0 0 24 24" width="24px" fill="currentColor"><path d="M0 0h24v24H0z" fill="none"/><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg>'); }
#mobile-block-toggleBtn .toggle-icon-adguard { background-image: url('${ADGUARD_LOGO_URL}'); background-size: contain; background-repeat: no-repeat; background-position: center; background-color: transparent !important; mask-image: none; -webkit-mask-image: none; width: 60%; height: 60%; }

.mb-btn { padding: 10px 24px; border: none; border-radius: 20px !important; font-size: var(--md-sys-typescale-label-large-font-size); font-weight: 500; cursor: pointer; transition: background-color 0.2s ease, transform 0.1s ease, box-shadow 0.2s ease; text-align: center; box-shadow: 0 1px 2px 0 rgba(0,0,0,0.3), 0 1px 3px 1px rgba(0,0,0,0.15); min-width: 64px; min-height: 40px; overflow: hidden; white-space: nowrap; text-overflow: ellipsis; opacity: 1 !important; -webkit-tap-highlight-color: transparent !important; line-height: 1.5; display: inline-flex; align-items: center; justify-content: center; }
.mb-btn:hover { box-shadow: 0 1px 2px 0 rgba(0,0,0,0.3), 0 2px 6px 2px rgba(0,0,0,0.15); }
.mb-btn:active { transform: scale(0.97); box-shadow: none; }
.mb-btn.primary { background-color: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); }
.mb-btn.primary:hover { background-color: #b0d3ff; } .mb-btn.primary:active { background-color: #c0daff; }
.mb-btn.secondary { background-color: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); }
.mb-btn.secondary:hover { background-color: #545d6e; } .mb-btn.secondary:active { background-color: #6a7385; }
.mb-btn.tertiary { background-color: var(--md-sys-color-tertiary-container); color: var(--md-sys-color-on-tertiary-container); }
.mb-btn.tertiary:hover { background-color: #6f5471; } .mb-btn.tertiary:active { background-color: #866a89; }
.mb-btn.error { background-color: var(--md-sys-color-error-container); color: var(--md-sys-color-on-error-container); }
.mb-btn.error:hover { background-color: #b12025; } .mb-btn.error:active { background-color: #c83c40; }
.mb-btn.surface { background-color: var(--md-sys-color-surface-variant); color: var(--md-sys-color-on-surface-variant); }
.mb-btn.surface:hover { background-color: #53575e; } .mb-btn.surface:active { background-color: #63676e; }
.mb-btn.outline { background-color: transparent; color: var(--md-sys-color-primary); border: 1px solid var(--md-sys-color-outline); box-shadow: none; }
.mb-btn.outline:hover { background-color: rgba(var(--md-sys-color-primary-rgb, 160, 201, 255), 0.08); }
.mb-btn.outline:active { background-color: rgba(var(--md-sys-color-primary-rgb, 160, 201, 255), 0.12); }

.button-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(90px, 1fr)); gap: 12px; margin-top: 24px; }
#blocker-info-wrapper { margin-bottom: 15px; padding: 10px 14px; background-color: var(--md-sys-color-surface-variant); border-radius: 12px; border: 1px solid var(--md-sys-color-outline); }
#blocker-info-label { display: block; font-size: var(--md-sys-typescale-label-medium-font-size); color: var(--md-sys-color-on-surface-variant); margin-bottom: 6px; font-weight: 500; }
#blocker-info { display: block; color: var(--md-sys-color-on-surface); font-size: var(--md-sys-typescale-label-large-font-size); line-height: 1.45; word-break: break-all; min-height: 1.45em; font-family: 'Consolas', 'Monaco', monospace; max-height: 6em; overflow-y: auto; }
#blocker-info:empty::after { content: '없음'; color: var(--md-sys-color-on-surface-variant); font-style: italic; }
label[for="blocker-slider"] { display: block; font-size: var(--md-sys-typescale-label-medium-font-size); color: var(--md-sys-color-on-surface-variant); margin-bottom: 5px; margin-top: 10px; }

.settings-item { margin-bottom: 20px; display: flex; flex-direction: column; gap: 10px; }
.settings-item label { display: flex; justify-content: space-between; align-items: center; font-size: var(--md-sys-typescale-label-large-font-size); color: var(--md-sys-color-on-surface-variant); }
.settings-item label .settings-label-text { flex-grow: 1; margin-right: 10px; }
.settings-value { color: var(--md-sys-color-on-surface); font-weight: 500; font-size: var(--md-sys-typescale-label-medium-font-size); padding-left: 10px; }
#settings-toggle-site, #settings-adguard-logo, #settings-temp-disable { min-width: 70px; padding: 8px 14px; font-size: var(--md-sys-typescale-label-medium-font-size); flex-shrink: 0; }
#settings-toggle-site.active, #settings-adguard-logo.active, #settings-temp-disable.active { background-color: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); }
#settings-toggle-site:not(.active), #settings-adguard-logo:not(.active), #settings-temp-disable:not(.active) { background-color: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); }
#settings-close, #settings-backup, #settings-restore { width: 100%; margin-top: 10px; }
#settings-restore-input { display: none; }

.corner-selector-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 8px; margin-top: 5px; }
.corner-btn { padding: 8px 12px; min-width: 60px; font-size: var(--md-sys-typescale-label-medium-font-size); }
.corner-btn.active { background-color: var(--md-sys-color-primary); color: var(--md-sys-color-on-primary); }
.corner-btn:not(.active) { background-color: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); }

#blocklist-container { max-height: calc(70vh - 150px); overflow-y: auto; margin: 20px 0; padding-right: 8px; display: flex; flex-direction: column; gap: 10px; }
.blocklist-item { display: flex; justify-content: space-between; align-items: center; padding: 12px 14px; background-color: rgba(var(--md-sys-color-surface-variant-rgb, 67, 71, 78), 0.5); border-radius: 12px; border: 1px solid transparent; transition: background-color 0.2s, border-color 0.2s, opacity 0.3s ease, transform 0.3s ease; }
.blocklist-item:hover { background-color: rgba(var(--md-sys-color-surface-variant-rgb, 67, 71, 78), 0.7); border-color: var(--md-sys-color-outline); }
.blocklist-item span { flex: 1; word-break: break-all; margin-right: 12px; font-size: var(--md-sys-typescale-label-medium-font-size); color: var(--md-sys-color-on-surface-variant); font-family: 'Consolas', 'Monaco', monospace; }
.blocklist-controls { display: flex; gap: 6px; flex-shrink: 0; }
.blocklist-btn { padding: 6px 10px; min-width: auto; min-height: 32px; font-size: var(--md-sys-typescale-label-small-font-size); border-radius: 16px !important; }
.blocklist-btn-delete { background-color: var(--md-sys-color-error-container); color: var(--md-sys-color-on-error-container); }
.blocklist-btn-copy { background-color: var(--md-sys-color-secondary-container); color: var(--md-sys-color-on-secondary-container); }
#blocklist-empty { text-align:center; color: var(--md-sys-color-on-surface-variant); padding: 20px 0; }

#mes-toast-container { position: fixed; bottom: 90px; left: 50%; transform: translateX(-50%); z-index: 2147483647 !important; display: flex; flex-direction: column-reverse; align-items: center; gap: 10px; pointer-events: none; width: max-content; max-width: 90%; }
.mes-toast { background-color: var(--md-sys-color-inverse-surface); color: var(--md-sys-color-inverse-on-surface); padding: 14px 20px; border-radius: 8px; box-shadow: 0 3px 5px -1px rgba(0,0,0,0.2), 0 6px 10px 0 rgba(0,0,0,0.14), 0 1px 18px 0 rgba(0,0,0,0.12); font-size: var(--md-sys-typescale-label-large-font-size); opacity: 0; transform: translateY(20px); transition: opacity 0.3s ease, transform 0.3s ease, background-color 0.3s ease; pointer-events: all; max-width: 100%; text-align: center; }
.mes-toast.show { opacity: 1; transform: translateY(0); }
.mes-toast.info { background-color: #333; color: white; }
.mes-toast.success { background-color: var(--md-sys-color-success-container); color: var(--md-sys-color-success); }
.mes-toast.error { background-color: var(--md-sys-color-error-container); color: var(--md-sys-color-on-error-container); }
.mes-toast.warning { background-color: #4d3a00; color: var(--md-sys-color-warning); }
    `;
	document.head.appendChild(style);

	let panel, settingsPanel, toggleBtn, listPanel, toastContainer;

	function createUIElements() {
		toastContainer = document.createElement('div');
		toastContainer.id = 'mes-toast-container';
		toastContainer.className = 'mobile-block-ui';
		document.body.appendChild(toastContainer);

		panel = document.createElement('div');
		panel.id = 'mobile-block-panel';
		panel.className = 'mobile-block-ui';
		panel.innerHTML = `
            <div id="blocker-info-wrapper">
                <span id="blocker-info-label">${STRINGS.selectedElementLabel}</span>
                <div id="blocker-info"></div>
            </div>
            <label for="blocker-slider" style="display: block; font-size: var(--md-sys-typescale-label-medium-font-size); color: var(--md-sys-color-on-surface-variant); margin-bottom: 5px;">${STRINGS.parentLevelLabel}</label>
            <input type="range" id="blocker-slider" class="mb-slider" min="0" max="10" value="0" aria-label="Parent Level Selector">
            <div class="button-grid">
                <button id="blocker-copy" class="mb-btn secondary">${STRINGS.copy}</button>
                <button id="blocker-preview" class="mb-btn secondary">${STRINGS.preview}</button>
                <button id="blocker-add-block" class="mb-btn primary">${STRINGS.saveRule}</button>
                <button id="blocker-list" class="mb-btn tertiary">${STRINGS.list}</button>
                <button id="blocker-settings" class="mb-btn tertiary">${STRINGS.settings}</button>
                <button id="blocker-cancel" class="mb-btn surface">${STRINGS.cancel}</button>
            </div>`;
		document.body.appendChild(panel);

		listPanel = document.createElement('div');
		listPanel.id = 'mobile-blocklist-panel';
		listPanel.className = 'mobile-block-ui';
		listPanel.innerHTML = `
            <h3 class="mb-panel-title">${STRINGS.listTitle}</h3>
            <div id="blocklist-container"></div>
            <button id="blocklist-close" class="mb-btn surface" style="width: 100%; margin-top: 15px;">${STRINGS.close}</button>`;
		document.body.appendChild(listPanel);

		settingsPanel = document.createElement('div');
		settingsPanel.id = 'mobile-settings-panel';
		settingsPanel.className = 'mobile-block-ui';
		settingsPanel.innerHTML = `
            <h3 class="mb-panel-title">${STRINGS.settingsTitle}</h3>
            <div class="scrollable-container" style="max-height: 65vh; overflow-y: auto;">
            <div class="settings-item">
                <label><span class="settings-label-text">${STRINGS.includeSiteNameLabel}</span>
                    <button id="settings-toggle-site" class="mb-btn ${settings.includeSiteName ? 'active' : ''}">${settings.includeSiteName ? STRINGS.on : STRINGS.off}</button>
                </label>
            </div>
            <div class="settings-item">
                <label><span class="settings-label-text">${STRINGS.useAdguardLogoLabel}</span>
                    <button id="settings-adguard-logo" class="mb-btn ${settings.showAdguardLogo ? 'active' : ''}">${settings.showAdguardLogo ? STRINGS.on : STRINGS.off}</button>
                </label>
            </div>
             <div class="settings-item">
                <label><span class="settings-label-text">${STRINGS.tempDisableLabel}</span>
                    <button id="settings-temp-disable" class="mb-btn ${settings.tempBlockingDisabled ? 'active error' : 'secondary'}">${settings.tempBlockingDisabled ? STRINGS.on : STRINGS.off}</button>
                </label>
            </div>
            <div class="settings-item">
                <label for="settings-panel-opacity">
                    <span class="settings-label-text">${STRINGS.panelOpacityLabel}</span>
                    <span id="opacity-value" class="settings-value">${settings.panelOpacity.toFixed(2)}</span>
                </label>
                <input id="settings-panel-opacity" type="range" class="mb-slider" min="0.1" max="1.0" step="0.05" value="${settings.panelOpacity}" aria-label="Panel Opacity">
            </div>
            <div class="settings-item">
                <label for="settings-toggle-size">
                    <span class="settings-label-text">${STRINGS.toggleSizeLabel}</span>
                    <span id="toggle-size-value" class="settings-value">${settings.toggleSizeScale.toFixed(1)}x</span>
                </label>
                <input id="settings-toggle-size" type="range" class="mb-slider" min="0.5" max="2.0" step="0.1" value="${settings.toggleSizeScale}" aria-label="Toggle Button Size">
            </div>
            <div class="settings-item">
                <label for="settings-toggle-opacity">
                    <span class="settings-label-text">${STRINGS.toggleOpacityLabel}</span>
                    <span id="toggle-opacity-value" class="settings-value">${settings.toggleOpacity.toFixed(2)}</span>
                </label>
                <input id="settings-toggle-opacity" type="range" class="mb-slider" min="0.1" max="1.0" step="0.05" value="${settings.toggleOpacity}" aria-label="Toggle Button Opacity">
            </div>
            <div class="settings-item">
                 <label><span class="settings-label-text">${STRINGS.togglePositionLabel}</span></label>
                 <div class="corner-selector-grid">
                     <button id="corner-tl" data-corner="top-left" class="mb-btn corner-btn">${STRINGS.posTopLeft}</button>
                     <button id="corner-tr" data-corner="top-right" class="mb-btn corner-btn">${STRINGS.posTopRight}</button>
                     <button id="corner-bl" data-corner="bottom-left" class="mb-btn corner-btn">${STRINGS.posBottomLeft}</button>
                     <button id="corner-br" data-corner="bottom-right" class="mb-btn corner-btn">${STRINGS.posBottomRight}</button>
                 </div>
            </div>
            <div class="button-grid" style="margin-top: 20px; grid-template-columns: 1fr 1fr;">
                 <button id="settings-backup" class="mb-btn outline">${STRINGS.backupLabel}</button>
                 <button id="settings-restore" class="mb-btn outline">${STRINGS.restoreLabel}</button>
                 <input type="file" id="settings-restore-input" accept=".json">
            </div>
            </div>
            <button id="settings-close" class="mb-btn surface" style="width: 100%; margin-top: 20px;">${STRINGS.close}</button>`;
		document.body.appendChild(settingsPanel);

		toggleBtn = document.createElement('button');
		toggleBtn.id = 'mobile-block-toggleBtn';
		toggleBtn.className = 'mobile-block-ui';
		toggleBtn.setAttribute('aria-label', 'Toggle Element Selector');
		document.body.appendChild(toggleBtn);

		updateCSSVariables();
		updateToggleIcon();
		applyToggleBtnPosition();

		initRefsAndEvents();
		applyBlocking();
	}

	function showToast(message, type = 'info', duration = 3000) {
		if (!toastContainer) {
			console.warn(SCRIPT_ID, "Toast container not ready for message:", message);
			return;
		}
		const toast = document.createElement('div');
		toast.className = `mes-toast ${type}`;
		toast.textContent = message;
		toastContainer.appendChild(toast);

		void toast.offsetWidth;

		requestAnimationFrame(() => {
			toast.classList.add('show');
		});

		setTimeout(() => {
			toast.classList.remove('show');
			toast.addEventListener('transitionend', () => {
				try {
					toast.remove();
				} catch (e) {}
			}, {
				once: true
			});
			setTimeout(() => {
				try {
					toast.remove();
				} catch (e) {}
			}, 500);
		}, duration);
	}

	let selecting = false;
	let selectedEl = null;
	let initialTouchedElement = null;
	let touchStartX = 0,
		touchStartY = 0,
		touchMoved = false;
	const moveThreshold = 15;
	let blockedSelectorsCache = [];

	async function loadBlockedSelectors() {
		let stored = '[]';
		try {
			stored = await GM_getValue(BLOCKED_SELECTORS_KEY, '[]');
			const parsed = JSON.parse(stored);
			blockedSelectorsCache = Array.isArray(parsed) ? parsed : [];
			console.log(SCRIPT_ID, `Loaded ${blockedSelectorsCache.length} rules from storage.`);
			return blockedSelectorsCache;
		} catch (e) {
			console.error(SCRIPT_ID, `Error parsing blocked selectors from key '${BLOCKED_SELECTORS_KEY}', resetting. Stored value:`, stored, e);
			try {
				await GM_setValue(BLOCKED_SELECTORS_KEY, '[]');
			} catch (resetError) {
				console.error(SCRIPT_ID, "Failed to reset storage after parse error", resetError);
			}
			blockedSelectorsCache = [];
			return [];
		}
	}

	async function saveBlockedSelectors(list) {
		const selectorsToSave = Array.isArray(list) ? list : [];
		try {
			await GM_setValue(BLOCKED_SELECTORS_KEY, JSON.stringify(selectorsToSave));
			blockedSelectorsCache = [...selectorsToSave];
			console.log(SCRIPT_ID, `Saved ${selectorsToSave.length} rules.`);
		} catch (e) {
			console.error(SCRIPT_ID, "Error saving blocked selectors to GM:", e);
			showToast(STRINGS.settingsSaveError, 'error');
		}
	}

	const originalDisplayMap = new Map();

	async function applyBlocking(showToastNotification = false) {
		if (settings.tempBlockingDisabled) {
			console.log(SCRIPT_ID, "Blocking temporarily disabled. Skipping application.");
			disableAllBlocking(false);
			return 0;
		}

		console.log(SCRIPT_ID, "Applying block rules...");
		if (blockedSelectorsCache.length === 0) {
			await loadBlockedSelectors();
		}

		let count = 0;
		let appliedCount = 0;
		const currentHostname = location.hostname;

		blockedSelectorsCache.forEach(rule => {
			if (typeof rule !== 'string' || !rule.includes('##')) {
				console.warn(SCRIPT_ID, "Skipping invalid block rule format:", rule);
				return;
			}

			const parts = rule.split('##');
			const domain = parts[0];
			const cssSelector = parts[1];

			if (!cssSelector) {
				console.warn(SCRIPT_ID, "Skipping rule with empty selector:", rule);
				return;
			}
			if (domain && domain !== '*' && currentHostname !== domain) {
				return;
			}

			try {
				const elements = document.querySelectorAll(cssSelector);
				elements.forEach(el => {
					const isHiddenByScript = el.style.display === 'none' && el.hasAttribute('data-mes-hidden');
					const isNaturallyHidden = window.getComputedStyle(el).display === 'none';

					if (!isHiddenByScript && !isNaturallyHidden) {
						if (!originalDisplayMap.has(el)) {
							originalDisplayMap.set(el, el.style.display || 'unset');
						}
						el.style.setProperty('display', 'none', 'important');
						el.setAttribute('data-mes-hidden', 'true');
						count++;
					} else if (isHiddenByScript) {
						if (!originalDisplayMap.has(el)) {
							originalDisplayMap.set(el, 'unset');
						}
					}
				});
				if (elements.length > 0) appliedCount++;

			} catch (e) {}
		});

		if (count > 0) console.log(SCRIPT_ID, `Applied ${appliedCount} rules, hid ${count} new elements.`);
		else console.log(SCRIPT_ID, `Applied ${appliedCount} rules, no new elements needed hiding.`);

		if (showToastNotification && appliedCount > 0 && !settings.tempBlockingDisabled) {
			showToast(STRINGS.blockingApplied(appliedCount), 'success', 2000);
		}
		return appliedCount;
	}

	function disableAllBlocking(showToastNotification = true) {
		console.log(SCRIPT_ID, "Disabling all blocking rules temporarily...");
		let restoredCount = 0;
		document.querySelectorAll('[data-mes-hidden="true"]').forEach(el => {
			const originalDisplay = originalDisplayMap.get(el);
			if (originalDisplay === 'unset') {
				el.style.removeProperty('display');
			} else if (originalDisplay !== undefined) {
				el.style.setProperty('display', originalDisplay, '');
			} else {
				el.style.removeProperty('display');
			}
			el.removeAttribute('data-mes-hidden');
			restoredCount++;
		});
		console.log(SCRIPT_ID, `Restored display for ${restoredCount} elements.`);
		if (showToastNotification) {
			showToast(STRINGS.tempBlockingOn, 'warning', 2500);
		}
	}

	async function enableAllBlocking(showToastNotification = true) {
		console.log(SCRIPT_ID, "Re-enabling blocking rules...");
		const appliedCount = await applyBlocking(false);
		if (showToastNotification && appliedCount > 0) {
			showToast(STRINGS.tempBlockingOff, 'success', 2000);
		} else if (showToastNotification) {
			showToast(STRINGS.tempBlockingOff, 'info', 1500);
		}
	}

	function updateToggleIcon() {
		if (!toggleBtn) return;
		if (settings.showAdguardLogo) {
			toggleBtn.innerHTML = `<span class="toggle-icon toggle-icon-adguard" aria-hidden="true"></span>`;
		} else {
			toggleBtn.innerHTML = `<span class="toggle-icon toggle-icon-plus" aria-hidden="true"></span>`;
		}
		toggleBtn.classList.toggle('selecting', selecting);
	}

	function generateSelector(el, maxDepth = 7, requireUnique = true) {
		if (!el || el.nodeType !== 1 || el.closest('.mobile-block-ui')) return '';

		if (el.id) {
			const id = el.id;
			const escapedId = CSS.escape(id);
			if (!/^\d+$/.test(id) && id.length > 2 && !id.startsWith('ember') && !id.startsWith('react') && !id.includes(':')) {
				try {
					if (document.querySelectorAll(`#${escapedId}`).length === 1) {
						return `#${escapedId}`;
					}
				} catch (e) {}
			}
		}

		const parts = [];
		let current = el;
		let depth = 0;

		while (current && current.tagName && depth < maxDepth) {
			const tagName = current.tagName.toLowerCase();
			if (tagName === 'body' || tagName === 'html') break;
			if (current.closest('.mobile-block-ui')) {
				current = current.parentElement;
				continue;
			}

			let part = tagName;
			let addedSpecificity = false;

			const stableClasses = Array.from(current.classList)
				.filter(c => c && c.length > 2 &&
					!/^[a-z]{1,2}$/i.test(c) &&
					!/\d/.test(c) &&
					!/active|select|focus|hover|disabled|open|closed|visible|hidden|js-|ui-/i.test(c) &&
					!/^[A-Z0-9]{4,}$/.test(c) &&
					!c.includes('--') && !c.includes('__') &&
					!['selected-element', 'mobile-block-ui'].some(uiClass => c.includes(uiClass)))
				.slice(0, 2);

			if (stableClasses.length > 0) {
				part += '.' + stableClasses.map(c => CSS.escape(c)).join('.');
				addedSpecificity = true;
			}

			if (!addedSpecificity || (current.parentElement && !current.parentElement.closest('.mobile-block-ui'))) {
				const siblings = current.parentElement ? Array.from(current.parentElement.children) : [];
				const sameTagSiblings = siblings.filter(sib => sib.tagName === current.tagName && !sib.closest('.mobile-block-ui'));

				if (sameTagSiblings.length > 1) {
					const index = sameTagSiblings.indexOf(current) + 1;
					if (index > 0) {
						part += `:nth-of-type(${index})`;
						addedSpecificity = true;
					}
				}
			}

			parts.unshift(part);

			if (requireUnique && parts.length > 0 && depth > 0) {
				const tempSelector = parts.join(' > ');
				try {
					if (document.querySelectorAll(tempSelector).length === 1) {
						console.log(SCRIPT_ID, `Unique selector found early: ${tempSelector}`);
						return tempSelector;
					}
				} catch (e) {}
			}

			current = current.parentElement;
			depth++;
		}

		let finalSelector = parts.join(' > ');

		if (requireUnique && finalSelector) {
			try {
				const matches = document.querySelectorAll(finalSelector);
				if (matches.length !== 1) {
					console.warn(SCRIPT_ID, `Generated selector "${finalSelector}" matches ${matches.length} elements. Trying parent recursively.`);
					if (el.parentElement && !el.parentElement.closest('.mobile-block-ui') && maxDepth > 0) {
						const parentSelector = generateSelector(el.parentElement, maxDepth - 1, false);
						if (parentSelector) {
							const combinedSelector = parentSelector + " > " + finalSelector;
							try {
								if (document.querySelectorAll(combinedSelector).length === 1) {
									console.log(SCRIPT_ID, `Using combined unique selector: ${combinedSelector}`);
									return combinedSelector;
								} else {
									console.warn(SCRIPT_ID, `Combined selector "${combinedSelector}" still not unique.`);
								}
							} catch (e) {}
						}
					}
					console.warn(SCRIPT_ID, `Could not guarantee uniqueness for: ${finalSelector}`);
					return finalSelector;
				}
			} catch (e) {
				console.error(SCRIPT_ID, `Error validating selector "${finalSelector}":`, e);
				return '';
			}
		}

		if (!finalSelector || finalSelector === 'body' || finalSelector === 'html') {
			return '';
		}

		return finalSelector;
	}

	function initRefsAndEvents() {
		const infoLabel = panel.querySelector('#blocker-info-label');
		const info = panel.querySelector('#blocker-info');
		const slider = panel.querySelector('#blocker-slider');
		const copyBtn = panel.querySelector('#blocker-copy');
		const previewBtn = panel.querySelector('#blocker-preview');
		const addBtn = panel.querySelector('#blocker-add-block');
		const listBtn = panel.querySelector('#blocker-list');
		const settingsBtn = panel.querySelector('#blocker-settings');
		const cancelBtn = panel.querySelector('#blocker-cancel');

		const listContainer = listPanel.querySelector('#blocklist-container');
		const listClose = listPanel.querySelector('#blocklist-close');

		const settingsClose = settingsPanel.querySelector('#settings-close');
		const toggleSiteBtn = settingsPanel.querySelector('#settings-toggle-site');
		const adguardLogoToggleBtn = settingsPanel.querySelector('#settings-adguard-logo');
		const tempDisableBtn = settingsPanel.querySelector('#settings-temp-disable');
		const panelOpacitySlider = settingsPanel.querySelector('#settings-panel-opacity');
		const panelOpacityValue = settingsPanel.querySelector('#opacity-value');
		const toggleSizeSlider = settingsPanel.querySelector('#settings-toggle-size');
		const toggleSizeValue = settingsPanel.querySelector('#toggle-size-value');
		const toggleOpacitySlider = settingsPanel.querySelector('#settings-toggle-opacity');
		const toggleOpacityValue = settingsPanel.querySelector('#toggle-opacity-value');
		const cornerButtons = settingsPanel.querySelectorAll('.corner-btn');
		const backupBtn = settingsPanel.querySelector('#settings-backup');
		const restoreBtn = settingsPanel.querySelector('#settings-restore');
		const restoreInput = settingsPanel.querySelector('#settings-restore-input');

		let isPreviewHidden = false;
		let previewedElement = null;

		function removeSelectionHighlight() {
			if (selectedEl) {
				selectedEl.classList.remove('selected-element');
			}
			selectedEl = null;
			if (slider) slider.value = 0;
			if (info) info.textContent = '';
		}

		function resetPreview() {
			if (isPreviewHidden && previewedElement) {
				try {
					const originalDisplay = previewedElement.dataset._original_display;
					if (originalDisplay === 'unset') {
						previewedElement.style.removeProperty('display');
					} else if (originalDisplay !== undefined) {
						previewedElement.style.setProperty('display', originalDisplay, '');
					}
					delete previewedElement.dataset._original_display;
					if (previewedElement === selectedEl) {
						previewedElement.classList.add('selected-element');
					}
				} catch (e) {
					console.warn(SCRIPT_ID, "Error resetting preview style:", e)
				}
			}
			if (previewBtn) {
				previewBtn.textContent = STRINGS.preview;
				previewBtn.classList.remove('tertiary');
				previewBtn.classList.add('secondary');
			}
			isPreviewHidden = false;
			previewedElement = null;
		}

		function updateInfo() {
			if (!info) return;
			const selectorText = selectedEl ? generateSelector(selectedEl, 7, false) : '';
			info.textContent = selectorText;
			infoLabel.style.display = 'block';
		}

		let activePanel = null;

		function setPanelVisibility(panelElement, visible) {
			if (!panelElement) return;

			if (visible) {
				[panel, settingsPanel, listPanel].forEach(p => {
					if (p && p !== panelElement && p.classList.contains('visible')) {
						p.classList.remove('visible');
						const transitionEndHandler = () => {
							if (!p.classList.contains('visible')) p.style.display = 'none';
							p.removeEventListener('transitionend', transitionEndHandler);
						};
						p.addEventListener('transitionend', transitionEndHandler);
						setTimeout(() => {
							if (!p.classList.contains('visible')) p.style.display = 'none';
							p.removeEventListener('transitionend', transitionEndHandler);
						}, 350);
					}
				});

				activePanel = panelElement;
				panelElement.style.display = 'block';
				requestAnimationFrame(() => {
					requestAnimationFrame(() => {
						panelElement.classList.add('visible');
					});
				});
			} else {
				if (activePanel === panelElement) activePanel = null;
				panelElement.classList.remove('visible');
				const transitionEndHandler = () => {
					if (!panelElement.classList.contains('visible')) panelElement.style.display = 'none';
					panelElement.removeEventListener('transitionend', transitionEndHandler);
				};
				panelElement.addEventListener('transitionend', transitionEndHandler);
				setTimeout(() => {
					if (!panelElement.classList.contains('visible')) panelElement.style.display = 'none';
					panelElement.removeEventListener('transitionend', transitionEndHandler);
				}, 350);
			}
		}

		async function addBlockRule(selector) {
			console.log('[addBlockRule] Attempting for selector:', selector);
			if (!selector) {
				return {
					success: false,
					message: STRINGS.cannotGenerateSelector
				};
			}

			let fullSelector = "##" + selector;
			if (settings.includeSiteName) {
				const hostname = location.hostname;
				if (!hostname) {
					console.error(SCRIPT_ID, "Could not get location.hostname");
					return {
						success: false,
						message: '호스트 이름을 가져올 수 없습니다.'
					};
				}
				fullSelector = hostname + fullSelector;
			}

			if (blockedSelectorsCache.includes(fullSelector)) {
				console.log(SCRIPT_ID, "Rule already exists:", fullSelector);
				return {
					success: false,
					message: STRINGS.ruleExists
				};
			}

			const updatedList = [...blockedSelectorsCache, fullSelector];
			await saveBlockedSelectors(updatedList);

			console.log(SCRIPT_ID, "Rule added:", fullSelector);
			return {
				success: true,
				rule: fullSelector
			};
		}

		async function showList() {
			console.log('[showList] Function called');
			try {
				const arr = await loadBlockedSelectors();
				console.log(`[showList] Rendering ${arr.length} rules.`);
				listContainer.innerHTML = '';

				if (arr.length === 0) {
					listContainer.innerHTML = `<p id="blocklist-empty">${STRINGS.noRules}</p>`;
				} else {
					arr.forEach((rule, index) => {
						const item = document.createElement('div');
						item.className = 'blocklist-item';

						const span = document.createElement('span');
						span.textContent = rule;
						span.title = rule;

						const controlsDiv = document.createElement('div');
						controlsDiv.className = 'blocklist-controls';

						const copyButton = document.createElement('button');
						copyButton.className = 'mb-btn blocklist-btn blocklist-btn-copy';
						copyButton.textContent = STRINGS.copy;
						copyButton.title = '규칙 복사';
						copyButton.addEventListener('click', () => {
							try {
								GM_setClipboard(rule);
								showToast(STRINGS.ruleCopied, 'success', 2000);
							} catch (copyError) {
								console.error(SCRIPT_ID, "Error copying rule to clipboard:", copyError);
								showToast(STRINGS.clipboardError, 'error');
							}
						});

						const deleteButton = document.createElement('button');
						deleteButton.className = 'mb-btn blocklist-btn blocklist-btn-delete';
						deleteButton.textContent = '삭제';
						deleteButton.title = '규칙 삭제';
						deleteButton.addEventListener('click', async () => {
							console.log('[showList] Delete button clicked for rule:', rule);
							try {
								const currentIndex = blockedSelectorsCache.indexOf(rule);
								if (currentIndex > -1) {
									blockedSelectorsCache.splice(currentIndex, 1);
									await saveBlockedSelectors(blockedSelectorsCache);

									item.style.opacity = '0';
									item.style.transform = 'translateX(20px) scale(0.95)';
									setTimeout(async () => {
										item.remove();
										if (listContainer.childElementCount === 0) {
											listContainer.innerHTML = `<p id="blocklist-empty">${STRINGS.noRules}</p>`;
										}
										await applyBlocking(false);
										showToast(STRINGS.ruleDeleted, 'info', 2000);
									}, 300);

								} else {
									console.warn("Rule not found in cache for deletion:", rule);
									showToast(STRINGS.ruleDeleteError, 'error');
									await showList();
								}
							} catch (deleteError) {
								console.error(SCRIPT_ID, "Error deleting rule:", deleteError);
								showToast(STRINGS.ruleDeleteError, 'error');
							}
						});

						controlsDiv.append(copyButton, deleteButton);
						item.append(span, controlsDiv);
						listContainer.append(item);
					});
				}
				console.log('[showList] Rendering list panel.');
				setPanelVisibility(listPanel, true);

			} catch (error) {
				console.error(SCRIPT_ID, "Error in showList:", error);
				showToast(STRINGS.listShowError, 'error');
				setPanelVisibility(listPanel, false);
			}
		}

		function applyGradientMask(container) {
			if (!container) return;
			const updateMask = () => {
				const {
					scrollTop,
					scrollHeight,
					clientHeight
				} = container;
				const isAtTop = scrollTop <= 0;
				const isAtBottom = scrollTop + clientHeight >= scrollHeight - 1;
				if (isAtTop && isAtBottom) {
					container.style.webkitMaskImage = 'none';
					container.style.maskImage = 'none';
				} else if (isAtTop) {
					container.style.webkitMaskImage = `linear-gradient(to bottom, black 0%, black 90%, transparent 100%)`;
					container.style.maskImage = container.style.webkitMaskImage;
				} else if (isAtBottom) {
					container.style.webkitMaskImage = `linear-gradient(to bottom, transparent 0%, black 10%, black 100%)`;
					container.style.maskImage = container.style.webkitMaskImage;
				} else {
					container.style.webkitMaskImage = `linear-gradient(to bottom, transparent 0%, black 10%, black 90%, transparent 100%)`;
					container.style.maskImage = container.style.webkitMaskImage;
				}
			};

			container.addEventListener('scroll', updateMask);
			requestAnimationFrame(updateMask);
		}

		function setBlockMode(enabled) {
			if (!toggleBtn || !panel) return;

			selecting = enabled;
			toggleBtn.classList.toggle('selecting', enabled);
			updateToggleIcon();

			if (enabled) {
				setPanelVisibility(panel, true);
				if (selectedEl) {
					selectedEl.classList.add('selected-element');
				}
				updateInfo();
			} else {
				setPanelVisibility(panel, false);
				if (activePanel === listPanel) setPanelVisibility(listPanel, false);
				if (activePanel === settingsPanel) setPanelVisibility(settingsPanel, false);

				removeSelectionHighlight();
				resetPreview();
				initialTouchedElement = null;
			}
			console.log(SCRIPT_ID, "Selection mode:", enabled ? "ON" : "OFF");
		}


		console.log(SCRIPT_ID, 'Attaching event listeners...');

		toggleBtn.addEventListener('click', () => {
			setBlockMode(!selecting);
		});

		copyBtn.addEventListener('click', () => {
			if (!selectedEl) {
				showToast(STRINGS.noElementSelected, 'warning');
				return;
			}
			const selector = generateSelector(selectedEl, 7, true);
			if (!selector) {
				showToast(STRINGS.cannotGenerateSelector, 'error');
				return;
			}

			let finalSelector = "##" + selector;
			if (settings.includeSiteName) {
				finalSelector = location.hostname + finalSelector;
			}
			try {
				GM_setClipboard(finalSelector);
				showToast(STRINGS.selectorCopied, 'success');
			} catch (err) {
				console.error(SCRIPT_ID, "Error copying to clipboard:", err);
				showToast(STRINGS.clipboardError, 'error');
				try {
					prompt(STRINGS.promptCopy, finalSelector);
				} catch (e) {}
			}
		});

		previewBtn.addEventListener('click', () => {
			if (!selectedEl) {
				showToast(STRINGS.noElementSelected, 'warning');
				return;
			}

			if (!isPreviewHidden) {
				if (window.getComputedStyle(selectedEl).display === 'none') {
					showToast(STRINGS.alreadyHidden, 'info');
					return;
				}
				const currentDisplay = selectedEl.style.display;
				selectedEl.dataset._original_display = currentDisplay === '' ? 'unset' : currentDisplay;
				selectedEl.style.setProperty('display', 'none', 'important');

				previewBtn.textContent = STRINGS.restorePreview;
				previewBtn.classList.remove('secondary');
				previewBtn.classList.add('tertiary');
				isPreviewHidden = true;
				previewedElement = selectedEl;
				selectedEl.classList.remove('selected-element');
				console.log(SCRIPT_ID, "Previewing hide for:", selectedEl);

			} else {
				if (previewedElement && previewedElement !== selectedEl) {
					showToast(STRINGS.previewDifferentElement, 'warning');
					return;
				}
				resetPreview();
				console.log(SCRIPT_ID, "Restored preview for:", previewedElement);
			}
		});

		addBtn.addEventListener('click', async () => {
			console.log('[addBtn] Clicked');
			if (!selectedEl) {
				showToast(STRINGS.noElementSelected, 'warning');
				return;
			}

			try {
				const selector = generateSelector(selectedEl, 7, true);
				console.log('[addBtn] Generated selector for saving:', selector);
				if (!selector) {
					showToast(STRINGS.cannotGenerateSelector, 'error');
					return;
				}

				const result = await addBlockRule(selector);
				console.log('[addBtn] addBlockRule result:', result);

				if (result.success) {
					showToast(STRINGS.ruleSavedReloading, 'success', 2000);
					try {
						const ruleSelector = result.rule.split('##')[1];
						document.querySelectorAll(ruleSelector).forEach(el => {
							if (!originalDisplayMap.has(el)) {
								originalDisplayMap.set(el, el.style.display || 'unset');
							}
							el.style.setProperty('display', 'none', 'important');
							el.setAttribute('data-mes-hidden', 'true');
						});
					} catch (applyError) {
						console.error(SCRIPT_ID, "Error applying rule immediately after save:", applyError);
						showToast(STRINGS.ruleSavedApplyFailed, 'warning', 3000);
					}
					setBlockMode(false);

				} else {
					showToast(result.message || STRINGS.ruleAddError, result.success ? 'success' : 'info');
				}
			} catch (error) {
				console.error(SCRIPT_ID, "Error during Save Rule click:", error);
				showToast(`${STRINGS.ruleAddError} ${error.message}`, 'error');
			}
		});

		listBtn.addEventListener('click', () => {
			console.log('[listBtn] Clicked');
			setPanelVisibility(panel, false);
			showList();
		});

		settingsBtn.addEventListener('click', () => {
			console.log('[settingsBtn] Clicked');
			setPanelVisibility(panel, false);
			setPanelVisibility(settingsPanel, true);
		});

		cancelBtn.addEventListener('click', () => {
			setBlockMode(false);
		});

		listClose.addEventListener('click', () => {
			console.log('[listClose] Clicked');
			setPanelVisibility(listPanel, false);
			if (selecting) {
				console.log('[listClose] Restoring main panel');
				setPanelVisibility(panel, true);
			}
		});

		settingsClose.addEventListener('click', () => {
			console.log('[settingsClose] Clicked');
			setPanelVisibility(settingsPanel, false);
			if (selecting) {
				console.log('[settingsClose] Restoring main panel');
				setPanelVisibility(panel, true);
			}
		});

		toggleSiteBtn.addEventListener('click', async () => {
			settings.includeSiteName = !settings.includeSiteName;
			toggleSiteBtn.textContent = settings.includeSiteName ? STRINGS.on : STRINGS.off;
			toggleSiteBtn.classList.toggle('active', settings.includeSiteName);
			await saveSettings();
			showToast(STRINGS.settingsSaved, 'info', 1500);
		});

		adguardLogoToggleBtn.addEventListener('click', async () => {
			settings.showAdguardLogo = !settings.showAdguardLogo;
			adguardLogoToggleBtn.textContent = settings.showAdguardLogo ? STRINGS.on : STRINGS.off;
			adguardLogoToggleBtn.classList.toggle('active', settings.showAdguardLogo);
			updateToggleIcon();
			await saveSettings();
			showToast(STRINGS.settingsSaved, 'info', 1500);
		});

		tempDisableBtn.addEventListener('click', async () => {
			settings.tempBlockingDisabled = !settings.tempBlockingDisabled;
			tempDisableBtn.textContent = settings.tempBlockingDisabled ? STRINGS.on : STRINGS.off;
			tempDisableBtn.classList.toggle('active', settings.tempBlockingDisabled);
			tempDisableBtn.classList.toggle('error', settings.tempBlockingDisabled);
			tempDisableBtn.classList.toggle('secondary', !settings.tempBlockingDisabled);

			if (settings.tempBlockingDisabled) {
				disableAllBlocking();
			} else {
				await enableAllBlocking();
			}
			await saveSettings();
		});

		const updateCornerButtons = (activeCorner) => {
			cornerButtons.forEach(btn => {
				btn.classList.toggle('active', btn.dataset.corner === activeCorner);
			});
		};

		cornerButtons.forEach(button => {
			button.addEventListener('click', async () => {
				const selectedCorner = button.dataset.corner;
				if (settings.toggleBtnCorner !== selectedCorner) {
					settings.toggleBtnCorner = selectedCorner;
					updateCornerButtons(selectedCorner);
					applyToggleBtnPosition();
					await saveSettings();
					showToast(STRINGS.settingsSaved, 'info', 1500);
				}
			});
		});

		updateCornerButtons(settings.toggleBtnCorner);


		let saveTimeout;
		const debounceSaveSettings = () => {
			clearTimeout(saveTimeout);
			saveTimeout = setTimeout(async () => {
				await saveSettings();
				console.log(SCRIPT_ID, "Settings saved via debounce");
			}, 500);
		};

		panelOpacitySlider.addEventListener('input', e => {
			const newValue = parseFloat(e.target.value);
			settings.panelOpacity = newValue;
			panelOpacityValue.textContent = newValue.toFixed(2);
			document.documentElement.style.setProperty('--panel-opacity', newValue);
			document.querySelectorAll('#mobile-block-panel, #mobile-settings-panel, #mobile-blocklist-panel').forEach(p => {
				p.style.setProperty('background-color', `rgba(40, 43, 48, ${newValue})`, 'important');
			});
			debounceSaveSettings();
		});

		toggleSizeSlider.addEventListener('input', e => {
			const newValue = parseFloat(e.target.value);
			settings.toggleSizeScale = newValue;
			toggleSizeValue.textContent = newValue.toFixed(1) + 'x';
			document.documentElement.style.setProperty('--toggle-size', `${56 * newValue}px`);
			if (toggleBtn) {
				toggleBtn.style.setProperty('width', `var(--toggle-size)`, 'important');
				toggleBtn.style.setProperty('height', `var(--toggle-size)`, 'important');
			}
			debounceSaveSettings();
		});

		toggleOpacitySlider.addEventListener('input', e => {
			const newValue = parseFloat(e.target.value);
			settings.toggleOpacity = newValue;
			toggleOpacityValue.textContent = newValue.toFixed(2);
			document.documentElement.style.setProperty('--toggle-opacity', newValue);
			if (toggleBtn) {
				toggleBtn.style.setProperty('opacity', newValue, 'important');
			}
			debounceSaveSettings();
		});

		backupBtn.addEventListener('click', async () => {
			try {
				const rules = await loadBlockedSelectors();
				if (rules.length === 0) {
					showToast('ℹ️ 백업할 규칙이 없습니다.', 'info');
					return;
				}
				const jsonString = JSON.stringify(rules, null, 2);
				const blob = new Blob([jsonString], {
					type: 'application/json'
				});
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
				a.href = url;
				a.download = `mobile_element_selector_backup_${timestamp}.json`;
				document.body.appendChild(a);
				a.click();
				document.body.removeChild(a);
				URL.revokeObjectURL(url);
				showToast(STRINGS.backupStarting, 'success');
			} catch (err) {
				console.error(SCRIPT_ID, "Backup failed:", err);
				showToast(STRINGS.backupError, 'error');
			}
		});

		restoreBtn.addEventListener('click', () => {
			restoreInput.click();
		});

		restoreInput.addEventListener('change', async (event) => {
			const file = event.target.files[0];
			if (!file) return;

			const reader = new FileReader();
			reader.onload = async (e) => {
				try {
					const content = e.target.result;
					const parsedRules = JSON.parse(content);

					if (!Array.isArray(parsedRules) || !parsedRules.every(item => typeof item === 'string')) {
						throw new Error("Invalid file content - expected an array of strings.");
					}
					if (!parsedRules.every(item => item.includes('##') || parsedRules.length === 0)) {
						console.warn(SCRIPT_ID, "Restored rules contain items without '##'. Proceeding anyway.");
					}

					await saveBlockedSelectors(parsedRules);
					await applyBlocking(true);
					showToast(STRINGS.restoreSuccess, 'success', 2500);

					if (listPanel.classList.contains('visible')) {
						await showList();
					}
					if (settingsPanel.classList.contains('visible')) {
						tempDisableBtn.classList.toggle('active', settings.tempBlockingDisabled);
						tempDisableBtn.classList.toggle('error', settings.tempBlockingDisabled);
						tempDisableBtn.classList.toggle('secondary', !settings.tempBlockingDisabled);
						tempDisableBtn.textContent = settings.tempBlockingDisabled ? STRINGS.on : STRINGS.off;
					}

				} catch (err) {
					console.error(SCRIPT_ID, "Restore failed:", err);
					if (err instanceof SyntaxError || err.message.includes("Invalid file content")) {
						showToast(STRINGS.restoreErrorInvalidFile, 'error');
					} else {
						showToast(STRINGS.restoreErrorGeneral, 'error');
					}
				} finally {
					restoreInput.value = '';
				}
			};
			reader.onerror = (e) => {
				console.error(SCRIPT_ID, "File reading error:", e);
				showToast(STRINGS.restoreErrorGeneral, 'error');
				restoreInput.value = '';
			};
			reader.readAsText(file);
		});

		document.addEventListener('touchstart', e => {
			if (!selecting) return;

			if (e.target.closest('.mobile-block-ui')) {
				initialTouchedElement = null;
				return;
			}

			const touch = e.touches[0];
			touchStartX = touch.clientX;
			touchStartY = touch.clientY;
			touchMoved = false;

			const potentialTarget = document.elementFromPoint(touchStartX, touchStartY);
			if (potentialTarget && !potentialTarget.closest('.mobile-block-ui') && potentialTarget.tagName !== 'BODY' && potentialTarget.tagName !== 'HTML') {
				initialTouchedElement = potentialTarget;
			} else {
				initialTouchedElement = null;
			}
		}, {
			passive: true
		});

		document.addEventListener('touchmove', e => {
			if (!selecting || touchMoved || !e.touches[0]) return;

			if (e.target.closest('.mobile-block-ui')) return;


			const touch = e.touches[0];
			const dx = touch.clientX - touchStartX;
			const dy = touch.clientY - touchStartY;
			if (Math.sqrt(dx * dx + dy * dy) > moveThreshold) {
				touchMoved = true;
				if (selectedEl) {
					selectedEl.classList.remove('selected-element');
				}
				initialTouchedElement = null;
			}
		}, {
			passive: true
		});

		document.addEventListener('touchend', e => {
			if (!selecting) return;

			const touchEndTarget = e.target;

			if (touchEndTarget.closest('.mobile-block-ui .mb-btn') || touchEndTarget === toggleBtn || toggleBtn.contains(touchEndTarget)) {
				touchMoved = false;
				return;
			}
			if (touchEndTarget.closest('.mobile-block-ui')) {
				touchMoved = false;
				return;
			}


			if (!touchMoved) {
				try {
					e.preventDefault();
					e.stopImmediatePropagation();
				} catch (err) {
					console.warn(SCRIPT_ID, "Could not preventDefault/stopImmediatePropagation on touchend:", err);
				}
			} else {
				touchMoved = false;
				return;
			}

			const touch = e.changedTouches[0];
			if (!touch) return;

			let targetEl = initialTouchedElement;
			if (!targetEl || targetEl.closest('.mobile-block-ui')) {
				targetEl = document.elementFromPoint(touch.clientX, touch.clientY);
			}
			while (targetEl && (targetEl.nodeType !== 1 || targetEl.closest('.mobile-block-ui'))) {
				targetEl = targetEl.parentElement;
			}

			if (targetEl && targetEl.tagName !== 'BODY' && targetEl.tagName !== 'HTML') {
				removeSelectionHighlight();
				resetPreview();
				selectedEl = targetEl;
				initialTouchedElement = selectedEl;
				selectedEl.classList.add('selected-element');
				if (slider) slider.value = 0;
				updateInfo();
			} else {
				removeSelectionHighlight();
				resetPreview();
				updateInfo();
				initialTouchedElement = null;
			}
		}, {
			capture: true,
			passive: false
		});

		slider.addEventListener('input', (e) => {
			if (!initialTouchedElement) {
				if (selectedEl) {
					initialTouchedElement = selectedEl;
				} else {
					return;
				}
			}
			resetPreview();
			const level = parseInt(e.target.value, 10);
			let current = initialTouchedElement;
			for (let i = 0; i < level && current.parentElement; i++) {
				if (['body', 'html'].includes(current.parentElement.tagName.toLowerCase()) || current.parentElement.closest('.mobile-block-ui')) {
					break;
				}
				current = current.parentElement;
			}
			if (selectedEl !== current) {
				if (selectedEl) {
					selectedEl.classList.remove('selected-element');
				}
				selectedEl = current;
				selectedEl.classList.add('selected-element');
				updateInfo();
			}
		});

		function makePanelDraggable(el) {
			if (!el) return;
			let startX, startY, elementStartX, elementStartY;
			let dragging = false;
			let movedSinceStart = false;
			const dragThreshold = 5;

			el.addEventListener('touchstart', (e) => {
				const isInsideScrollable = e.target.closest('.scrollable-container');
				if (isInsideScrollable) {
					dragging = false;
					return;
				}

				const ignore = e.target.closest('button, input, select, textarea, .blocklist-item, .mb-slider, #blocker-info, #blocklist-container');
				if (ignore && el.contains(ignore)) return;

				if (e.touches.length > 1) return;
				dragging = true;
				movedSinceStart = false;

				const touch = e.touches[0];
				startX = touch.clientX;
				startY = touch.clientY;

				const rect = el.getBoundingClientRect();

				el.style.transition = 'none';
				el.style.transform = 'none';
				el.style.left = `${rect.left}px`;
				el.style.top = `${rect.top}px`;
				el.style.right = 'auto';
				el.style.bottom = 'auto';

				elementStartX = rect.left;
				elementStartY = rect.top;
				el.style.cursor = 'grabbing';
			}, {
				passive: true
			});

			el.addEventListener('touchmove', (e) => {
				if (!dragging || e.touches.length > 1) return;
				const touch = e.touches[0];
				const dx = touch.clientX - startX;
				const dy = touch.clientY - startY;

				if (!movedSinceStart && Math.sqrt(dx * dx + dy * dy) > dragThreshold) {
					movedSinceStart = true;
				}
				if (movedSinceStart) {
					e.preventDefault();
					const newX = Math.max(0, Math.min(elementStartX + dx, window.innerWidth - el.offsetWidth));
					const newY = Math.max(0, Math.min(elementStartY + dy, window.innerHeight - el.offsetHeight));
					el.style.left = `${newX}px`;
					el.style.top = `${newY}px`;
				}
			}, {
				passive: false
			});

			el.addEventListener('touchend', () => {
				if (dragging && movedSinceStart) {
					el.dataset.wasDragged = 'true';
				}
				dragging = false;
				movedSinceStart = false;
				el.style.cursor = 'grab';
			});

			el.addEventListener('touchcancel', () => {
				dragging = false;
				movedSinceStart = false;
				el.style.cursor = 'grab';
			});
		}

		makePanelDraggable(panel);
		makePanelDraggable(settingsPanel);
		makePanelDraggable(listPanel);

		const settingsScrollable = settingsPanel.querySelector('.scrollable-container');
		if (settingsScrollable) applyGradientMask(settingsScrollable);

		console.log(SCRIPT_ID, 'Initialization complete.');
	}

	async function run() {
		await loadSettings();
		if (document.readyState === 'loading') {
			document.addEventListener('DOMContentLoaded', createUIElements);
		} else {
			createUIElements();
		}
	}

	run().catch(error => {
		console.error(SCRIPT_ID, "Unhandled error during script initialization:", error);
	});

})();
