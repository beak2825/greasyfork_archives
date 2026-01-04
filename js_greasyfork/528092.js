// ==UserScript==
// @name         Auto Address Modification for 1688 Orders (Multiple Factories - Single Save)
// @namespace    http://tampermonkey.net/
// @version      1.1
// @description  여러 공장 주소 자동 수정 + 두 모달 저장 자동화, 중복 실행 방지
// @include      *://order.1688.com/order/*
// @grant        none
// @run-at       document-idle
// @downloadURL https://update.greasyfork.org/scripts/528092/Auto%20Address%20Modification%20for%201688%20Orders%20%28Multiple%20Factories%20-%20Single%20Save%29.user.js
// @updateURL https://update.greasyfork.org/scripts/528092/Auto%20Address%20Modification%20for%201688%20Orders%20%28Multiple%20Factories%20-%20Single%20Save%29.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
     * 여러 공장 설정
     */
    const factoryConfigs = [
        {
            factoryName: "湖州越己服饰有限公司",
            label: "CHA",
            skyNumber: 1
        },
        {
            factoryName: "湖州宥宝服饰有限公司",
            label: "CHA",
            skyNumber: 2
        },
        {
            factoryName: "广州争渡贸易有限公司",
            label: "CHA",
            skyNumber: 3
        },
        {
            factoryName: "珠海恩格服饰有限公司",
            label: "CHA",
            skyNumber: 4
        },
        {
            factoryName: "深圳市富莱蔓科技有限公司",
            label: "CHA",
            skyNumber: 5
        },
        {
            factoryName: "佛山开旺服饰有限公司",
            label: "CHA",
            skyNumber: 7
        },
        {
            factoryName: "佛山市禅城区乖乖童制衣厂",
            label: "CHA",
            skyNumber: 9
        },
        {
            factoryName: "威尼丝(佛山)服饰有限公司",
            label: "CHA",
            skyNumber: 21
        },
        {
            factoryName: "珠海抱抱服饰有限公司",
            label: "CHA",
            skyNumber: 26
        },
        {
            factoryName: "湖州点兮服饰有限公司",
            label: "NO-CHA",
            skyNumber: 8
        },
        {
            factoryName: "杭州蓝灵服饰有限公司实力供应商",
            label: "NO-CHA",
            skyNumber: 22
        },
        {
            factoryName: "诸暨市小火焰针织有限公司",
            label: "NO-CHA",
            skyNumber: 23
        },
        {
            factoryName: "湖州织里图兰卡服饰有限公司",
            label: "NO-CHA",
            skyNumber: 24
        },
        {
            factoryName: "深圳市瑞美雅礼品有限公司",
            label: "NO-CHA",
            skyNumber: 25
        },
        {
            factoryName: "湖州末小蒙服饰有限公司",
            label: "CHA",
            skyNumber: 41
        },
        {
            factoryName: "湖州织里琪炫制衣厂",
            label: "CHA",
            skyNumber: 42
        },
        {
            factoryName: "湖州织里阿蒂米斯童装商行",
            label: "CHA",
            skyNumber: 43
        },
        {
            factoryName: "吴兴织里一帛制衣厂",
            label: "CHA",
            skyNumber: 45
        },
        {
            factoryName: "东莞市鑫泰园服装有限公司",
            label: "CHA",
            skyNumber: 46
        },
        {
            factoryName: "吴兴织里董尚童装商行",
            label: "CHA",
            skyNumber: 47
        },
        {
            factoryName: "深圳市宝安区池苏米童装商行",
            label: "CHA",
            skyNumber: 48
        },
        {
            factoryName: "湖州眯眯眼服饰有限公司",
            label: "CHA",
            skyNumber: 49
        },
        {
            factoryName: "湖州一麦服饰有限公司",
            label: "CHA",
            skyNumber: 50
        },
        {
            factoryName: "湖州奶酪与喵服饰有限公司",
            label: "CHA",
            skyNumber: 51
        },
        {
            factoryName: "湖州趣趣么么服饰有限公司",
            label: "CHA",
            skyNumber: 66
        },
        {
            factoryName: "湖州童酷服饰有限公司",
            label: "CHA",
            skyNumber: 61
        },
        {
            factoryName: "湖州织里宝多服饰有限公司",
            label: "CHA",
            skyNumber: 75
        },
        {
            factoryName: "湖州织里邦诚制衣厂",
            label: "CHA",
            skyNumber: 48
        },
        {
            factoryName: "湖州佳叶服饰有限公司",
            label: "CHA",
            skyNumber: 76
        },
        {
            factoryName: "湖州天供服饰有限公司",
            label: "NO-CHA",
            skyNumber: 44
        },
        {
            factoryName: "吴兴织里米蒂制衣厂（个体工商户）",
            label: "NO-CHA",
            skyNumber: 44
        },
        {
            factoryName: "吴兴织里奕成制衣厂",
            label: "NO-CHA",
            skyNumber: 45
        },
        {
            factoryName: "吴兴织里董尚童装商行",
            label: "NO-CHA",
            skyNumber: 47
        },
        {
            factoryName: "湖州织里酷君服饰有限公司",
            label: "NO-CHA",
            skyNumber: 52
        },
        {
            factoryName: "湖州织里咕米可童装商行",
            label: "NO-CHA",
            skyNumber: 62
        },
        {
            factoryName: "上海曙一网络科技有限公司",
            label: "NO-CHA",
            skyNumber: 63
        },
        {
            factoryName: "佛山市禅城区甜心爸爸童装店",
            label: "NO-CHA",
            skyNumber: 63
        },
        {
            factoryName: "温州嘉信旺服饰有限公司",
            label: "NO-CHA",
            skyNumber: 63
        },
        {
            factoryName: "吴兴织里沈雪会制衣厂",
            label: "NO-CHA",
            skyNumber: 64
        },
        {
            factoryName: "湖州穗哲电子商务有限公司",
            label: "NO-CHA",
            skyNumber: 65
        },
        {
            factoryName: "湖州沈家电子商务有限公司",
            label: "NO-CHA",
            skyNumber: 67
        },
        {
            factoryName: "佛山市涵曦服饰有限公司",
            label: "NO-CHA",
            skyNumber: 68
        },
        {
            factoryName: "湖州织里鹿小鹿制衣厂",
            label: "NO-CHA",
            skyNumber: 69
        },
        {
            factoryName: "湖州艾菲服饰有限公司",
            label: "NO-CHA",
            skyNumber: 69
        },
        {
            factoryName: "湖州贝格曼服饰有限公司",
            label: "NO-CHA",
            skyNumber: 70
        },
        {
            factoryName: "湖州风之谷服饰有限公司",
            label: "NO-CHA",
            skyNumber: 71
        },
        {
            factoryName: "湖州密雪微奇服饰有限公司",
            label: "NO-CHA",
            skyNumber: 72
        },
        {
            factoryName: "湖州织里蒋歌服饰有限公司",
            label: "NO-CHA",
            skyNumber: 73
        },
        {
            factoryName: "湖州谢金毛服饰有限公司",
            label: "NO-CHA",
            skyNumber: 73
        },
        {
            factoryName: "湖州吾里卜一服饰有限公司",
            label: "NO-CHA",
            skyNumber: 74
        },
        {
            factoryName: "佛山市禅城区懒洋洋的穿搭童装店",
            label: "NO-CHA",
            skyNumber: 74
        },
        {
            factoryName: "东莞市棉柔服饰有限公司",
            label: "NO-CHA",
            skyNumber: 77
        },
        {
            factoryName: "湖州曼涵服饰有限公司",
            label: "NO-CHA",
            skyNumber: 78
        },
        {
            factoryName: "苍南县金昆服装厂",
            label: "NO-CHA",
            skyNumber: 78
        },
        {
            factoryName: "湖州织里赫赫有铭制衣厂",
            label: "NO-CHA",
            skyNumber: 79
        },
        {
            factoryName: "锡山区东港弘邦制衣厂",
            label: "NO-CHA",
            skyNumber: 80
        },
        {
            factoryName: "湖州维木服饰有限公司",
            label: "NO-CHA",
            skyNumber: 90
        },
        {
            factoryName: "义乌市南蕉服饰有限公司",
            label: "NO-CHA",
            skyNumber: 91
        },
    ];

    let currentFactoryConfig = null;           // 현재 감지된 공장 정보
    let hasSecondModalOpened = false;          // 2번째 모달이 열렸는지 여부
    let hasSecondModalHandled = false;         // 2번째 모달에서 주소 수정 진행됐는지 여부
    let hasFirstModalSaveClicked = false;      // 1번째 모달 저장 클릭 중복 방지

    //=========================================================
    //    [1] 스크립트 시작
    //=========================================================
    window.addEventListener('load', () => {
        console.log("✅ [TM Script] 1688 주문 페이지 감지됨, 로직 시작...");
        clickAddressAction(selectFactoryAddress);
    });

    //=========================================================
    //    [2] 첫 번째 모달(주소 선택) 열기
    //=========================================================
    function clickAddressAction(callback) {
        const addressButton = document.querySelector('.address-action');
        if (addressButton) {
            console.log("🚀 주소 변경 버튼 클릭!");
            addressButton.click();
            // 2초 후 주소 선택 기능 실행
            setTimeout(() => {
                console.log("⏳ 주소 선택 모달에 진입했는지 체크...");
                callback();
            }, 2000);
        } else {
            console.log("❌ 주소 변경 버튼을 찾지 못함, 1초 후 재시도");
            setTimeout(() => clickAddressAction(callback), 1000);
        }
    }

    /**
     * 현재 페이지 공장 이름 → factoryConfigs 중 해당 주소 찾기 → “编辑” 클릭
     */
    function selectFactoryAddress() {
        const factoryName = getFactoryName();
        if (!factoryName) {
            console.log("❌ [ERROR] 공장 이름을 찾지 못함 - 종료");
            return;
        }
        console.log("🏭 현재 공장 이름 감지:", factoryName);

        currentFactoryConfig = factoryConfigs.find(cfg => cfg.factoryName === factoryName);
        if (!currentFactoryConfig) {
            console.log(`❌ [ERROR] 등록되지 않은 공장: ${factoryName} - 자동 처리 불가`);
            return;
        }
        console.log("✅ [INFO] 매칭된 factoryConfig:", currentFactoryConfig);

        const { label } = currentFactoryConfig;
        const addressItems = document.querySelectorAll('.address-item');

        for (const item of addressItems) {
            const addressNameElement = item.querySelector('.address-name');
            if (addressNameElement) {
                const addressName = addressNameElement.textContent.trim();
                if (addressName.includes(label)) {
                    console.log(`✅ '${label}' 주소 감지됨: ${addressName}`);
                    // "编辑" 버튼
                    const editBtn = item.querySelector('.address-action button span');
                    if (editBtn && editBtn.textContent.includes("编辑")) {
                        console.log("🚀 [CLICK] 编辑 버튼");
                        editBtn.click();
                        observeSecondModal();
                        return;
                    }
                }
            }
        }
        console.log(`❌ '${label}' 주소를 찾지 못함 - 종료`);
    }

    /**
     * 공장 이름 추출
     */
    function getFactoryName() {
        const factoryElement = document.querySelector('.shop-title .shop-link');
        return factoryElement ? factoryElement.textContent.trim() : null;
    }

    //=========================================================
    // [3] 두 번째 모달(편집 모달) 감지 & 수정
    //=========================================================

    function observeSecondModal() {
        // 이미 감지했거나 처리 중이면 중단
        if (hasSecondModalOpened) return;
        hasSecondModalOpened = true;

        console.log("🔍 두 번째 모달 감시 시작...");

        const observer = new MutationObserver((mutations, obs) => {
            const secondModal = document.querySelector('.receive-address-form-modal');
            if (secondModal) {
                console.log("✅ [INFO] 두 번째 모달 감지됨! 주소 수정 실행");
                obs.disconnect();
                // 충분히 렌더링 될 때까지 1초 후 실행
                setTimeout(modifyAddressInSecondModal, 1000);
            }
        });

        observer.observe(document.body, { childList: true, subtree: true });

        // 5초 후 재확인 (두 번째 모달 못 찾았으면 포기/경고)
        setTimeout(() => {
            if (!hasSecondModalHandled) {
                const secondModal = document.querySelector('.receive-address-form-modal');
                if (secondModal) {
                    console.log("✅ [INFO] 5초 후에야 두 번째 모달 발견. 수정 진행");
                    modifyAddressInSecondModal();
                } else {
                    console.log("❌ [경고] 두 번째 모달을 여전히 찾지 못함. (자동 수정 포기)");
                }
            }
        }, 5000);
    }

    /**
     * 두 번째 모달 내부 주소 수정
     */
    function modifyAddressInSecondModal() {
        if (hasSecondModalHandled) return;  // 이미 실행했다면 중단
        hasSecondModalHandled = true;

        if (!currentFactoryConfig) {
            console.log("❌ [ERROR] currentFactoryConfig 없음. 종료");
            return;
        }

        const nameInput = document.querySelector('#fullName');
        const addressTextarea = document.querySelector('#address');
        if (!nameInput || !addressTextarea) {
            console.log("❌ [ERROR] 편집 모달에서 입력 필드를 찾지 못함");
            return;
        }

        const originalName = nameInput.value.trim();
        const originalAddress = addressTextarea.value.trim();
        console.log("🔍 [BEFORE] 이름:", originalName);
        console.log("🔍 [BEFORE] 주소:", originalAddress);

        const { skyNumber, label } = currentFactoryConfig;
        const today = getTodayDate(); // "MMDD"
        // 정규식 대체
        const newSkyCode = `SKY-${skyNumber}-${label}`;

        // 패턴이 있을 경우 대체. 없으면 뒤에 붙이는 식으로도 가능 (원하시면 추가)
        const updatedName = originalName.replace(/SKY-\d+-(CHA|NO-CHA)/, newSkyCode);
        const updatedAddress = originalAddress.replace(
            /SKY-\d+-(CHA|NO-CHA)\s+DATE:\d{4}/,
            `${newSkyCode} DATE:${today}`
        );

        function setReactValue(domElement, newValue) {
            const desc = Object.getOwnPropertyDescriptor(domElement.__proto__, 'value');
            desc.set.call(domElement, newValue);
            domElement.dispatchEvent(new Event('input', { bubbles: true }));
            domElement.dispatchEvent(new Event('change', { bubbles: true }));
            domElement.dispatchEvent(new Event('blur', { bubbles: true }));
        }

        // 1) 이름 변경
        setReactValue(nameInput, updatedName);
        console.log("🔄 [MODIFY] 이름 변경:", updatedName);

        // 2) 주소 변경(1초 후)
        setTimeout(() => {
            setReactValue(addressTextarea, updatedAddress);
            console.log("🔄 [MODIFY] 주소 변경:", updatedAddress);

            // 3) 1초 후 최종 저장
            setTimeout(() => {
                console.log("🔍 최종 변경사항 확인:");
                console.log("   이름:", nameInput.value);
                console.log("   주소:", addressTextarea.value);

                if (nameInput.value === originalName && addressTextarea.value === originalAddress) {
                    console.log("❌ [ERROR] 값이 변경되지 않았으므로 저장 취소");
                    return;
                }
                clickSecondModalSave();
            }, 1000);
        }, 1000);
    }

    /**
     * 두 번째 모달 저장 버튼 → 닫힘 감시 → 첫 번째 모달 저장
     */
    function clickSecondModalSave() {
        const saveButton = document.querySelector(
            '.receive-address-form-modal .ant-modal-footer button.ant-btn-primary'
        );
        if (!saveButton) {
            console.log("❌ [ERROR] 두 번째 모달 저장 버튼을 찾지 못함");
            return;
        }
        console.log("✅ [CLICK] 두 번째 모달 '저장' 버튼 클릭...");
        saveButton.click();
        observeSecondModalClose();
    }

    /**
     * 두 번째 모달이 닫히면 → 첫 번째 모달 저장
     */
    function observeSecondModalClose() {
        const closeObserver = new MutationObserver(() => {
            const secondModal = document.querySelector('.receive-address-form-modal');
            if (!secondModal) {
                console.log("✅ [INFO] 두 번째 모달이 닫힘 감지 → 첫 번째 모달 저장 진행");
                closeObserver.disconnect();
                setTimeout(clickFirstModalSave, 500);
            }
        });

        closeObserver.observe(document.body, { childList: true, subtree: true });

        // 5초 후에도 안 닫혔으면 직접 확인
        setTimeout(() => {
            const secondModal = document.querySelector('.receive-address-form-modal');
            if (!secondModal) {
                console.log("✅ [INFO] 두 번째 모달 이미 닫힘 → 첫 번째 모달 저장 진행");
                closeObserver.disconnect();
                clickFirstModalSave();
            }
        }, 5000);
    }

    //=========================================================
    // [4] 첫 번째 모달(주소 선택) 저장 버튼
    //=========================================================
    function clickFirstModalSave() {
        // 중복 실행 방지
        if (hasFirstModalSaveClicked) {
            console.log("⚠️ [INFO] 첫 번째 모달 저장은 이미 시도됨. 중복 실행 방지.");
            return;
        }
        hasFirstModalSaveClicked = true;

        // 첫 번째 모달의 footer 안에 있는 '확정'(确 定) 버튼
        // 실제 DOM 구조에 맞게 수정 필요
        const firstModalSaveBtn = document.querySelector(
            '.ant-modal-footer .address-button-group .ant-btn-primary'
        );

        if (!firstModalSaveBtn) {
            console.log("❌ [ERROR] 첫 번째 모달 저장 버튼을 찾지 못함");
            return;
        }
        console.log("✅ [CLICK] 첫 번째 모달 '저장' 버튼");
        firstModalSaveBtn.click();
    }

    //=========================================================
    // [유틸] 오늘 날짜 "MMDD"
    //=========================================================
    function getTodayDate() {
        const now = new Date();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        return `${month}${day}`;
    }

})();
