// ==UserScript==
// @name        [루시퍼홍] 아실 여러단지비교 편하게 써보자
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/app/investor*
// @grant       none
// @version     1.20
// @description 2024. 7. 31. 오후 10:00:03
// @downloadURL https://update.greasyfork.org/scripts/502081/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%97%AC%EB%9F%AC%EB%8B%A8%EC%A7%80%EB%B9%84%EA%B5%90%20%ED%8E%B8%ED%95%98%EA%B2%8C%20%EC%8D%A8%EB%B3%B4%EC%9E%90.user.js
// @updateURL https://update.greasyfork.org/scripts/502081/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%EC%97%AC%EB%9F%AC%EB%8B%A8%EC%A7%80%EB%B9%84%EA%B5%90%20%ED%8E%B8%ED%95%98%EA%B2%8C%20%EC%8D%A8%EB%B3%B4%EC%9E%90.meta.js
// ==/UserScript==
(function() {
    'use strict';

    const currentVersion = GM_info.script.version;
    const scriptName = GM_info.script.name;
    console.log(scriptName + ' ' + "currentVersion: " + currentVersion);
    const updateUrl = GM_info.script.updateURL;
    const cafeUrl = 'https://cafe.naver.com/wecando7/11113482';
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

    // Function to generate a unique ID for each pick element
    function generateUniqueId() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }

    // 필터 기능을 위한 함수
    function filterOptions() {
        var input = document.getElementById("filterInput").value.toUpperCase();
        var div = document.getElementById("optionsDiv");
        var options = div.getElementsByTagName("div");

        for (var i = 0; i < options.length; i++) {
            var txtValue = options[i].textContent || options[i].innerText;
            if (txtValue.toUpperCase().indexOf(input) > -1) {
                options[i].style.display = "";
            } else {
                options[i].style.display = "none";
            }
        }
    }

    // Function to save area values and display them
    function saveAndDisplayAreaValues() {
        var area_si = $('#area_si_0').val();
        var area_gu = $('#area_gu_0').val();
        var area_si_text = $('#area_si_0 option:selected').text();
        var area_gu_text = $('#area_gu_0 option:selected').text();

        if (area_si && area_gu) {
            var areas = JSON.parse(localStorage.getItem('savedAreas')) || [];
            var areaObj = { si: area_si, gu: area_gu, si_text: area_si_text, gu_text: area_gu_text };

            // Check if the area already exists in local storage and remove it if found
            areas = areas.filter(area => !(area.si === area_si && area.gu === area_gu));

            // Ensure only 20 items are stored, remove the oldest if limit is reached
            if (areas.length >= 20) {
                areas.shift();
            }

            // Add the new area to the end of the list
            areas.push(areaObj);

            // Save the updated list to local storage
            localStorage.setItem('savedAreas', JSON.stringify(areas));

            // Render the saved areas
            renderSavedAreas();
        } else {
            alert('Please select both 시 and 구 values.');
        }
    }

    // Function to apply colors to font elements
    function applyColors() {
        var colors = ['#FF3838', '#3246F8', '#403E43', '#1BB70E', '#EF0FE2', '#AAA9AA', '#D78003', '#13EF4C', '#8E5EFB', '#F6F423'];
        var colorIndex = 0;

        $('#search_lst .pick').each(function() {
            var $this = $(this);
            if ($this.css('opacity') == 1) {
                $this.find('font').attr('color', colors[colorIndex % colors.length]);
                colorIndex++;
            } else if ($this.css('opacity') == 0.5) {
                $this.find('font').attr('color', '#F5F5F5');
            }
        });
    }

    // Function to render saved areas
    function renderSavedAreas() {
        var areas = JSON.parse(localStorage.getItem('savedAreas')) || [];
        var savedAreaContainer = $('#saved_area_container');
        savedAreaContainer.empty(); // Clear previous entries

        var table = $('<table style="width: 100%; border-collapse: collapse;"></table>');
        var row, cell, areaElement, deleteButton;

        var columns = 2;
        var totalAreas = areas.length;
        var rows = Math.ceil(totalAreas / columns);

        for (var i = 0; i < rows; i++) {
            row = $('<tr></tr>');
            for (var j = 0; j < columns; j++) {
                cell = $('<td style="padding: 3px; text-align: center; width: 50%; height: 15px; position: relative; border: 0px;"></td>');
                if (areas.length > 0) {
                    var area = areas.shift();
                    areaElement = $('<div class="saved-area" style="white-space: nowrap; overflow: hidden; text-overflow: ellipsis; height: 15px; line-height: 15px; font-size: 13px; display: inline-block;"></div>')
                        .text(`${area.si_text} ${area.gu_text}`)
                        .data('si', area.si)
                        .data('gu', area.gu)
                        .click(function () {
                            $('#area_si_0').val($(this).data('si')).change();
                            setTimeout(() => { // Add a slight delay to ensure the change event for area_si_0 is processed
                                $('#area_gu_0').val($(this).data('gu')).change();
                            }, 300);
                        });

                    deleteButton = $('<span style="color: red; cursor: pointer; position: absolute; right: 5px; top: 0; font-size: 13px;">x</span>')
                        .data('si', area.si)
                        .data('gu', area.gu)
                        .click(function (e) {
                            e.stopPropagation(); // Prevent triggering the parent click event
                            var si = $(this).data('si');
                            var gu = $(this).data('gu');
                            var storedAreas = JSON.parse(localStorage.getItem('savedAreas')) || [];
                            storedAreas = storedAreas.filter(a => !(a.si === si && a.gu === gu));
                            localStorage.setItem('savedAreas', JSON.stringify(storedAreas));
                            renderSavedAreas();
                        });

                    cell.append(areaElement).append(deleteButton);
                }
                row.append(cell);
            }
            table.append(row);
        }

        savedAreaContainer.append(table);
    }

    // `area_apt_0` 요소를 클릭할 때 실행될 함수
document.getElementById('area_apt_0').addEventListener('mousedown', function(event) {
    event.preventDefault();
    event.stopPropagation();

    var existingDiv = document.getElementById('optionsDivContainer');
    if (existingDiv) {
        existingDiv.remove();
        return;
    }

    var optionsDivContainer = document.createElement('div');
    optionsDivContainer.id = 'optionsDivContainer';
    optionsDivContainer.style.position = 'absolute';
    optionsDivContainer.style.zIndex = '1000';
    optionsDivContainer.style.backgroundColor = '#fff';
    optionsDivContainer.style.border = '1px solid #ccc';
    optionsDivContainer.style.width = '70%';
    optionsDivContainer.style.maxHeight = '600px';
    optionsDivContainer.style.overflowY = 'scroll';

    var filterInput = document.createElement('input');
    filterInput.type = 'text';
    filterInput.id = 'filterInput';
    filterInput.placeholder = '검색...';
    filterInput.style.width = '100%';
    filterInput.style.boxSizing = 'border-box';
    filterInput.addEventListener('keyup', filterOptions); // 검색 필터링 함수 연결

    optionsDivContainer.appendChild(filterInput);

    var optionsDiv = document.createElement('div');
    optionsDiv.id = 'optionsDiv';
    var select = document.getElementById('area_apt_0');
    for (var i = 0; i < select.options.length; i++) {
        var optionDiv = document.createElement('div');
        optionDiv.textContent = select.options[i].textContent;
        optionDiv.setAttribute('data-value', select.options[i].value);
        optionDiv.style.cursor = 'pointer';
        optionDiv.style.padding = '2px 5px';

        if (select.options[i].selected) {
            optionDiv.style.backgroundColor = '#b3d4fc';
        }

        optionDiv.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent the click from bubbling up
            var value = this.getAttribute('data-value');
            select.value = value;

            var allOptions = optionsDiv.getElementsByTagName('div');
            for (var j = 0; j < allOptions.length; j++) {
                allOptions[j].style.backgroundColor = '';
            }
            this.style.backgroundColor = '#b3d4fc';

            var event = new Event('change', {
                'bubbles': true,
                'cancelable': true
            });
            select.dispatchEvent(event);

            optionsDivContainer.remove();
        });
        optionsDiv.appendChild(optionDiv);
    }

    optionsDivContainer.appendChild(optionsDiv);
    document.body.appendChild(optionsDivContainer);

    var rect = select.getBoundingClientRect();
    optionsDivContainer.style.top = rect.bottom + 'px';
    optionsDivContainer.style.left = rect.left + 'px';

    filterInput.focus();
});
// Helper function to decompose Hangul into Jamo
// 초성 테이블
const chosung = ["ㄱ", "ㄲ", "ㄴ", "ㄷ", "ㄸ", "ㄹ", "ㅁ", "ㅂ", "ㅃ", "ㅅ", "ㅆ", "ㅇ", "ㅈ", "ㅉ", "ㅊ", "ㅋ", "ㅌ", "ㅍ", "ㅎ"];
const hangulBase = 44032;
const chosungBase = 588;

// 한글 초성을 추출하는 함수
function getChosung(text) {
    let result = '';
    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i) - hangulBase;
        if (charCode >= 0 && charCode <= 11171) { // 한글 범위 내인지 체크
            result += chosung[Math.floor(charCode / chosungBase)];
        } else {
            result += text.charAt(i); // 한글이 아닌 경우 그대로 추가
        }
    }
    return result;
}

// 필터 기능을 위한 함수
function filterOptions() {
    var input = document.getElementById("filterInput").value.toUpperCase();
    var div = document.getElementById("optionsDiv");
    var options = div.getElementsByTagName("div");

    for (var i = 0; i < options.length; i++) {
        var txtValue = options[i].textContent || options[i].innerText;
        var chosungValue = getChosung(txtValue).toUpperCase();

        // 초성 또는 전체 텍스트가 입력값과 일치하는지 확인
        if (txtValue.toUpperCase().indexOf(input) > -1 || chosungValue.indexOf(input) > -1) {
            options[i].style.display = "";
        } else {
            options[i].style.display = "none";
        }
    }
}

// 클릭 시 외부를 클릭하면 div 제거
document.addEventListener('click', function(event) {
    var optionsDivContainer = document.getElementById('optionsDivContainer');
    if (optionsDivContainer && !optionsDivContainer.contains(event.target) && event.target.id !== 'area_apt_0') {
        optionsDivContainer.remove();
    }
});


    window.addPriceObj = function() {
        var idx = multiData.length;

        //console.log("Current multiData length: " + idx);

        if (idx >= 10) {
            alert('최대 10개까지 등록할 수 있습니다. 선택해제된 아파트가 있다면 대상에서 제외됩니다');
            return;
        }

        if (p_area == '' || p_area.length < 5) {
            alert('시구군을 선택하세요.');
            return;
        }

        var name = "";
        if (p_apt != '') {
            name = p_aptName;
        } else {
            name = p_areaName;
        }

        if (p_m2 != '') {
            name += "(" + p_m2Name + ")";
        }

        var obj = {
            "area": p_area,
            "building": p_building,
            "apt": p_apt,
            "m2": p_m2,
            "name": name,
            "id": generateUniqueId() // Generate unique ID for each object
        };

        // Check if the object is already in the list
        var objIndex = multiData.findIndex(item => item.area === obj.area && item.building === obj.building && item.apt === obj.apt && item.m2 === obj.m2);

        if (objIndex !== -1) {
            alert('이미 등록된 단지입니다.');
            return;
        }

        // Add the object if it does not exist
        multiData.push(obj);

        var tooltip = '';
        if (name.indexOf('평') > 0 && p_m2.length > 0) {
            tooltip = p_m2 + '㎡';
        }

        var index = multiData.length - 1; // Get the current index

        // Initialize the button HTML
        var buttonHtml = '';

        // Check if 'apt' has a value, and if so, create the button HTML
        if (p_apt != '') {
            var aptUrl = 'https://asil.kr/?' + p_apt;
            buttonHtml = ' <a href="' + aptUrl + '" target="_blank" style="vertical-align: middle;"><span class="link">🔎</span></a>';
        }

        // Append the new HTML with the dynamic button
        $("#search_lst").append('<span class="pick" data-idx="' + index + '" data-id="' + obj.id + '" data-obj=\'' + JSON.stringify(obj) + '\'><font color="' + multiColor[index] + '">■</font> <span title="' + tooltip + '" style="vertical-align: middle;">' + name + '</span>' + buttonHtml + ' <a href="javascript:delPriceObj(\'' + obj.id + '\')"><span class="del">선택해제</span></a></span>');

        setDataMulti();

        // Apply colors to font elements
        applyColors();

        saveAndDisplayAreaValues();
    }

    // Function to delete price object
    window.delPriceObj = function(id) {
        // Remove item from multiData
        var objIndex = multiData.findIndex(item => item.id === id);
        if (objIndex !== -1) {
            multiData.splice(objIndex, 1);
        }
        setDataMulti();

        // Remove the span element
        $('#search_lst .pick[data-id="' + id + '"]').remove();

        // Update data-idx attributes of remaining items
        $('#search_lst .pick').each(function(i) {
            $(this).attr('data-idx', i);
            $(this).find('a').attr('href', 'javascript:delPriceObj(\'' + $(this).data('id') + '\')');
        });

        applyColors();
    }

    // Function to deactivate all spans
    function deactivateAllSpans() {
        $('#search_lst .pick').each(function() {
            var $this = $(this);
            $this.css('opacity', '0.5');  // Dim the span to indicate it is inactive
        });

        // Clear multiData after deactivating all spans
        multiData = [];
        setDataMulti();
    }

    // Function to process active span elements
    function processActiveSpans() {
        multiData = [];

        $('#search_lst .pick').each(function() {
            var $this = $(this);
            if ($this.css('opacity') == 1) {
                var dataObj = $this.attr('data-obj');
                // Ensure data-obj is valid JSON before parsing
                if (dataObj) {
                    var obj = JSON.parse(dataObj);

                    // Check if the object is already in the multiData list
                    var objIndex = multiData.findIndex(item => item.area === obj.area && item.building === obj.building && item.apt === obj.apt && item.m2 === obj.m2);

                    if (objIndex === -1) {
                        // Add item to multiData
                        multiData.push(obj);
                    }

                    applyColors();
                }
            }
        });

        setDataMulti();
    }

    // Function to update chart data
    function setDataMulti() {
        if (document.getElementById("chart0") != null) {
            document.getElementById("chart0").showAdditionalPreloader();
        }

        p_deal = '';
        p_deal = $(':radio[name="chkp_deal"]:checked').val();

        var _price = $(':radio[name="radioPrice"]:checked').val(); //최고가,최저가,평균가
        var _day = false; //$(':radio[name="radioDay"]:checked').val(); //월단위,10일단위

        var param = "";
        for (var i = 0; i < multiData.length; i++) {
            param += "&area" + i + "=" + multiData[i].area + "&building" + i + "=" + multiData[i].building + "&apt" + i + "=" + multiData[i].apt + "&m2" + i + "=" + multiData[i].m2;
        }
        execJs("/app/data/data_price_multi_js.jsp?ch=0&t=" + new Date().getTime() + "&cnt=" + multiData.length + param + "&deal=" + p_deal + "&price=" + _price + "&day=" + _day + "&mode=count&sY=" + p_sY + "&sM=" + p_sM +"&eY=" + p_eY + "&eM=" + p_eM);
    }

    // Initialize chart and slider on document ready
    $(document).ready(function() {


        // 강남구가 선택되었는지 확인하고 강제로 구 리스트 새로고침
        const area_si = $('#area_si_0').val();  // 'area_si_0'의 값 가져오기
        const area_gu = $('#area_gu_0').val();  // 'area_gu_0'의 값 가져오기

        if (area_si && area_gu) {
            // 강제로 구의 단지 리스트를 불러오도록 'change' 이벤트 트리거
            //$('#area_si_0').trigger('change');
            $('#area_gu_0').trigger('change');
        }

        chartVars0 = "rMateOnLoadCallFunction=chartReadyHandler0";
        rMateChartH5.create("chart0", "chartHolder0", chartVars0, "100%", "100%");

        var slider = document.getElementById('slider_year');
        if (!slider.noUiSlider) {
            noUiSlider.create(slider, {
                start:[timestamp(2006, 0), timestamp(2024, 6)],
                step: 24 * 3600000, connect: true, range:{'min': timestamp(2006, 0), 'max': timestamp(2024, 6)}
            });
            slider.noUiSlider.on('update', function(values, handle) {
                var date = new Date(+values[handle]);
                if (handle === 0) {
                    c_sY = date.getFullYear();
                    c_sM = date.getMonth()+1;
                    document.querySelector("#date_start").innerHTML = (c_sY+'').substring(2,4)+'년 '+c_sM+'월';
                } else {
                    c_eY = date.getFullYear();
                    c_eM = date.getMonth()+1;
                    document.querySelector("#date_end").innerHTML = (c_eY+'').substring(2,4)+'년 '+c_eM+'월';
                }
            });
            slider.noUiSlider.on('change', function(values) {
                p_sY = c_sY;
                p_sM = c_sM;
                p_eY = c_eY;
                p_eM = c_eM;
                setDataMulti();
            });
        }

        $('#p_min_m2').keyup(function () {
            if(p_apt != '') {
                $('#p_min_m2').val('');
                $('#p_max_m2').val('');
            } else {
                p_setSize();
            }
        });

        $('#p_max_m2').keyup(function () {
            if(p_apt != '') {
                $('#p_min_m2').val('');
                $('#p_max_m2').val('');
            } else {
                p_setSize();
            }
        });

        // Add the 모두 선택 해제 button above the 조회 button
        $('a.del[href="javascript:removeAllPriceObj()"]').before('<a class="del" id="deselect_all_btn" href="javascript:void(0)" style="width:100%; margin-left:0; color:#fff; background:#999;">모두 선택 해제</a>');

        // Add the 조회 button before the 전체삭제 button
        $('a.del[href="javascript:removeAllPriceObj()"]').before('<a class="del" id="search_btn" href="javascript:void(0)" style="width:100%; margin-left:0; color:#fff; background:#999;">조회</a>');

        // Attach event handler for 모두 선택 해제 button
        $('#deselect_all_btn').click(function() {
            deactivateAllSpans();
        });

        // Attach event handler for 조회 button
        $('#search_btn').click(function() {
            processActiveSpans();
        });

        // Attach event handler for 저장된 지역 보기
        var toggleButton = $('<button id="toggle_saved_area_button" class="search-btn" style="width: calc(100% - 32px); color:#fff; background:#1BB70E; margin-bottom: 3px;margin-left: 16px; font-size:13px;font-weight:700">최근 검색 지역 보기</button>');
        var savedAreaContainer = $('<div id="saved_area_container" style="display: none; border: 0px solid #ccc; padding: 10px; margin-bottom: 10px;"></div>');

        // Append the button and container to the DOM
        var selWrap = $('.sel_wrap');
        if (selWrap.length) {
            selWrap.before(toggleButton);
            selWrap.before(savedAreaContainer);

            // Attach click event to toggle button
            toggleButton.click(function() {
                savedAreaContainer.toggle();
                if (savedAreaContainer.is(':visible')) {
                    $(this).text('최근 검색 지역 닫기');
                } else {
                    $(this).text('최근 검색 지역 보기');
                }
            });

            // Render the saved areas
            renderSavedAreas();
        } else {
            console.error("#sel_wrap not found");
        }

        // Apply colors and attach click handlers on document ready
        applyColors();

        // Attach click event to .pick elements
        $(document).on('click', '#search_lst .pick span', function() {
            var parentSpan = $(this).parent();
            var dataObj = parentSpan.attr('data-obj');

            // Ensure data-obj is valid JSON before parsing
            if (dataObj) {
                var obj = JSON.parse(dataObj);

                // Check if the object is already in the multiData list
                var objIndex = multiData.findIndex(item => item.area === obj.area && item.building === obj.building && item.apt === obj.apt && item.m2 === obj.m2);

                if (objIndex !== -1) {
                    // Remove item from multiData
                    multiData.splice(objIndex, 1);
                    parentSpan.css('opacity', '0.5');  // Dim the span to indicate it is inactive
                } else {
                    // Add item to multiData
                    if (multiData.length >= 10) {
                        alert('최대 10개까지 조회할 수 있습니다.');
                        return;  // Stop further execution
                    }
                    multiData.push(obj);
                    parentSpan.css('opacity', '1');  // Restore the span to full opacity
                }

                applyColors();
            }
        });
    });
 // Initial sizes and colors
    let initialPanelWidth = 390;
    let minPanelWidth = 390;
    let panelStep = 100;
    let currentPanelWidth = initialPanelWidth;
    let originalMapWidth = window.parent.jQuery('#contents > div.map_wrap').width(); // Store initial map width
    let minimumMapWidth = 100; // Set minimum map width

    // Calculate the maximum allowed panel size based on the initial map size
    let maxPanelWidth = originalMapWidth + initialPanelWidth - minimumMapWidth;
    window.parent.jQuery('#sub2_div').css('width', '390px')
    window.parent.jQuery('#contents > div.map_wrap').css('width', `calc(100% - 780px)`);

    //mapPanel.css('width', `calc(100% - 390px)`);
    // Function to update panel size
    function resizePanel(newWidth) {

        currentPanelWidth = Math.max(minPanelWidth, Math.min(newWidth, maxPanelWidth)); // Ensure the width stays within the min and max bounds

        // Update the width of the .detail_wrap.open element
        window.parent.jQuery('#sub2_div').css('width', currentPanelWidth); // Updated to target the specific element

        // Calculate new map panel width based on the initial map width
        let mapPanel = window.parent.jQuery('#contents > div.map_wrap');
        let newMapWidth = `calc(100% - ${currentPanelWidth + 390}px)`; // Dynamically set the width and reduce further by 390px


        mapPanel.css('width', newMapWidth);
        //console.log(`Map width set to: ${newMapWidth}`);

        // Adjust the width of the span elements
        document.querySelectorAll("#search_lst .pick").forEach(item => {
            item.style.width = "100%";
            item.style.display = "block";
            item.style.boxSizing = "border-box";
            item.style.clear = "both"; // Ensures each item is displayed on a new line
        });
    }


    // Event handler for the left button to decrease the panel size
    function decreasePanelWidth() {
        resizePanel(currentPanelWidth - panelStep);
    }

    // Event handler for the right button to increase the panel size
    function increasePanelWidth() {
        resizePanel(currentPanelWidth + panelStep);
    }

    // Add left and right buttons next to the subtitle
// Add left and right buttons below the #slider_year_wrap
// Add left and right buttons below the #slider_year_wrap
let sliderYearWrap = document.querySelector('.slider_year_wrap');
if (sliderYearWrap) {
    // Check if the buttons are already added and remove them if they exist
    let existingWrapper = document.querySelector('#sizeControlWrapper');
    if (existingWrapper) {
        existingWrapper.remove();
    }

    // Create new button wrapper
    let buttonWrapper = document.createElement('div');
    buttonWrapper.id = 'sizeControlWrapper';
    buttonWrapper.style.display = 'inline-flex';
    buttonWrapper.style.alignItems = 'center'; // Align items vertically centered
    buttonWrapper.style.marginTop = '10px'; // Add space above the buttons

    // Shared button styles
    const buttonStyle = {
        padding: '5px 10px',
        margin: '0 5px',
        fontSize: '13px',
        fontFamily: '"Arial", sans-serif', // Using Arial, but you can change it to another font like 'Roboto' or 'Open Sans'
        backgroundColor: '#007BFF', // Light blue background for the buttons
        color: 'white', // White text color
        border: '1px solid #007BFF',
        borderRadius: '5px', // Rounded corners
        cursor: 'pointer',
        transition: 'background-color 0.2s ease',
    };

    let decreaseButton = document.createElement('button');
    decreaseButton.textContent = '⬅️ Size';
    Object.assign(decreaseButton.style, buttonStyle);
    decreaseButton.onmouseover = () => decreaseButton.style.backgroundColor = '#0056b3'; // Darker blue on hover
    decreaseButton.onmouseout = () => decreaseButton.style.backgroundColor = '#007BFF';
    decreaseButton.onclick = decreasePanelWidth;

    let increaseButton = document.createElement('button');
    increaseButton.textContent = 'Size ➡️';
    Object.assign(increaseButton.style, buttonStyle);
    increaseButton.onmouseover = () => increaseButton.style.backgroundColor = '#0056b3';
    increaseButton.onmouseout = () => increaseButton.style.backgroundColor = '#007BFF';
    increaseButton.onclick = increasePanelWidth;

    // Create the new button that opens the URL
    let openUrlButton = document.createElement('button');
    openUrlButton.textContent = '크게 보기';
    Object.assign(openUrlButton.style, buttonStyle);
    openUrlButton.onmouseover = () => openUrlButton.style.backgroundColor = '#0056b3';
    openUrlButton.onmouseout = () => openUrlButton.style.backgroundColor = '#007BFF';
    openUrlButton.onclick = function() {
        window.open('https://asil.kr/app/investor.jsp?os=pc&area=11680', '_blank');
    };

    // Append the buttons to the wrapper
    buttonWrapper.appendChild(decreaseButton);
    buttonWrapper.appendChild(increaseButton);
    buttonWrapper.appendChild(openUrlButton);

    // Append the button wrapper below the #slider_year_wrap element
    sliderYearWrap.appendChild(buttonWrapper);
} else {
    console.error('#slider_year_wrap not found.');
}



   function handleDisplayChange() {
    const sub2Div = window.parent.jQuery('#sub2_div');
    const mapPanel = window.parent.jQuery('#contents > div.map_wrap');
    let previousDisplayStyle = sub2Div.css('display'); // Store the initial display state

    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            if (mutation.attributeName === 'style') {
                const currentDisplayStyle = sub2Div.css('display');
                // Check if the previous state was not 'block' and the new state is 'block'
                if (previousDisplayStyle !== 'block' && currentDisplayStyle === 'block') {
                    // sub2_div가 나타나면 지도의 크기를 `calc(100% - 780px)`으로 조정
                    mapPanel.css('width', `calc(100% - 780px)`);
                    //console.log('Map width set to: calc(100% - 780px) because sub2_div is now visible');
                } else if (currentDisplayStyle === 'none') {
                    // sub2_div가 숨겨졌을 때, 지도의 크기를 원래대로 되돌림
                    mapPanel.css('width', '');
                    //console.log('Map width set to: calc(100% - 390px) because sub2_div is now hidden');
                }
                // Update the previousDisplayStyle to the current state
                previousDisplayStyle = currentDisplayStyle;
            }
        });
    });

    observer.observe(sub2Div[0], { attributes: true, attributeFilter: ['style'] });
}

// Call the function to start monitoring when the document is ready
$(document).ready(function() {
    handleDisplayChange();
});



    // Adjust the width of the span elements when the document is ready
    $(document).ready(function() {
        document.querySelectorAll("#search_lst .pick").forEach(item => {
            item.style.width = "100%";
            item.style.display = "block";
            item.style.boxSizing = "border-box";
            item.style.clear = "both"; // 추가: 항목이 강제로 한 줄에 하나씩만 나타나도록 보장
        });
      handleDisplayChange();
    });
})();
