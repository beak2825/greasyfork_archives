// ==UserScript==
// @name         고려대학교 블랙보드 트윅
// @namespace    https://kulms.korea.ac.kr/
// @version      0.4
// @description  고려대학교 블랙보드의 녹화강의 출석현황을 보거나 영상을 다운로드하거나 블랙보드의 성적을 확인 합니다.
// @author       Meda
// @match        https://kulms.korea.ac.kr/webapps/blackboard/*
// @match        https://kucom.korea.ac.kr/em/*
// @match        https://kulms.korea.ac.kr/ultra/stream/telemetry/student/high-performance/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=ac.kr
// @grant        GM_xmlhttpRequest
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/451425/%EA%B3%A0%EB%A0%A4%EB%8C%80%ED%95%99%EA%B5%90%20%EB%B8%94%EB%9E%99%EB%B3%B4%EB%93%9C%20%ED%8A%B8%EC%9C%85.user.js
// @updateURL https://update.greasyfork.org/scripts/451425/%EA%B3%A0%EB%A0%A4%EB%8C%80%ED%95%99%EA%B5%90%20%EB%B8%94%EB%9E%99%EB%B3%B4%EB%93%9C%20%ED%8A%B8%EC%9C%85.meta.js
// ==/UserScript==


function gradeCheckFunc() {
    var currentUrl = window.location.href;
    if(currentUrl.includes('course_id=')){
        var urlPoint = currentUrl.indexOf('course_id=');
        var courseId = currentUrl.substring(urlPoint+10, urlPoint+19);

        document.querySelector("#courseMenuPalette_contents").insertAdjacentHTML('afterbegin', `<li id="paletteItem:" class="clearfix ">
                                     <a href="/ultra/stream/telemetry/student/high-performance/`+courseId+`">
                                     <span title="내가 잘 하고 있습니까?">내가 잘 하고 있습니까?</span></a></li>`);
    }
}

if (window.location.href.startsWith('https://kulms.korea.ac.kr/webapps/blackboard/')) {
    gradeCheckFunc();
}


function attendanceCheckFunc() {
    var currentUrl = window.location.href;
    if(currentUrl.includes('course_id=')){
        var urlPoint = currentUrl.indexOf('course_id=');
        var courseId = currentUrl.substring(urlPoint+10, urlPoint+19);

        document.querySelector("#courseMenuPalette_contents").insertAdjacentHTML('afterbegin', `<li id="paletteItem:" class="clearfix ">
                                     <a href="/webapps/blackboard/execute/blti/launchPlacement?blti_placement_id=_136_1&course_id=`+courseId+`&mode=view" target="_self">
                                     <span title="녹강 출결 확인">녹강 출석 확인</span></a></li>`);
    }
}

if (window.location.href.startsWith('https://kulms.korea.ac.kr/webapps/blackboard/')) {
    attendanceCheckFunc();
}


function viewMygradeFunc(courseId) {
    // .full.activity-grade 요소를 찾을 때까지 0.1초마다 검색
    var grade = -1; // 찾은 "grade" 값을 저장할 변수

    var gradesArray = []; // grade 값을 저장할 배열 생성
    var i, item;
    var interval = setInterval(function() {
        var element = document.querySelector('.full.activity-grade');

        if (element) {
            clearInterval(interval); // 검색 간격 멈추기
            fetch('https://kulms.korea.ac.kr/learn/api/v1/courses/'+courseId+'/telemetry/reports/activityVsGrade')
                .then(response => response.json())
                .then(parsedData => {

                for (var i = 0; i < parsedData.data.length; i++) {
                    var item = parsedData.data[i];
                    if (item.membership) {
                        // membership이 존재하는 경우
                        grade = parseFloat(item.grade); // 나의 grade 값을 추가
                        gradesArray.push(parseFloat(item.grade)); // grade 값을 배열에 추가
                    }else if (!item.grade) {
                        // grade가 존재하는않는 경우
                        grade = 0.0;
                    }else{
                        gradesArray.push(parseFloat(item.grade)); // grade 값을 배열에 추가
                    }
                }

                gradesArray.sort(function(a, b) {
                    return b - a; // 내림차순으로 정렬
                });

                var index = gradesArray.indexOf(grade)+1;
                var itemCount = gradesArray.length;

                // .full.activity-grade 요소 선택
                var parentElement = document.querySelector('.full.activity-grade');

                var newHeading = document.createElement('h2');
                newHeading.style.fontWeight = 'bold';

                var gradeText = document.createElement('div');
                var rankText = document.createElement('div');

                if (grade == -1) {
                    gradeText.textContent = '나의 성적: --%';
                    rankText.textContent = '나의 석차: ' + itemCount + '명 중 --등  (상위: --%)';
                } else {
                    gradeText.textContent = '나의 성적: ' + (grade * 100).toFixed(3) + '%';
                    rankText.textContent = '나의 석차: ' + itemCount + '명 중 ' + index + '등  (상위: ' + (index / itemCount * 100).toFixed(2) + '%)';
                }
                newHeading.appendChild(gradeText);
                newHeading.appendChild(rankText);

                parentElement.insertBefore(newHeading, parentElement.firstChild);

            })
                .catch(error => {
                // 오류 처리
                console.error('오류 발생:', error);
            });
        }
    }, 100);

    // 10초 후에 검색 종료
    setTimeout(function() {
        clearInterval(interval); // 검색 간격 멈추기
    }, 10000);
}

if (window.location.href.startsWith('https://kulms.korea.ac.kr/ultra/stream/telemetry/student/high-performance/')) {
    var fullURL = window.location.href;
    var lastNineCharacters = fullURL.slice(-9);
    viewMygradeFunc(lastNineCharacters);
}






function mediaDownloadFunc() {
    function downloadFile(url, filename, btn) {
        btn.style.pointerEvents = 'none'; // 클릭 이벤트 막기
        GM_xmlhttpRequest({
            method: "GET",
            url: url,
            headers: {
                "referer": "https://kucom.korea.ac.kr/",
            },
            responseType: "blob",
            onprogress: function (progress) {
                if (progress.lengthComputable) {
                    const percentComplete = (progress.loaded / progress.total) * 100;
                    btn.textContent = `${filename} 다운로드 중 (${percentComplete.toFixed(2)}%)`;
                } else {
                    btn.textContent = `${filename} 다운로드 중`;
                }
            },
            onload: function(response) {
                var blob = response.response;
                var link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = filename;
                link.click();
                btn.textContent = filename + ' 다운로드 완료';
            }
        });
    }

    const mediaExtensions = ['mp4', 'webm', 'ogg', 'ogv', 'avi', 'wmv', 'mkv', 'mov', 'flv', 'mp3', 'wav', 'ogg', 'm4a', 'aac', 'flac', 'opus', 'wma'];
    function waitForPlayTimeTextArea() {
        const playTimeTextArea = document.querySelector('.vc-pctrl-on-playing');
        if (playTimeTextArea) {
            let mediaElement = null;
            const audioElement = document.querySelector('#vc-sdplay-audio audio');
            const videoElement = document.querySelector('#video-play-video1 video');
            if (audioElement?.src?.includes('https') &&
                mediaExtensions.some(ext => audioElement.src.endsWith(`.${ext}`))
               ) {
                mediaElement = audioElement;
            } else if (videoElement?.src?.includes('https') &&
                       !videoElement?.src?.includes('intro.mp4') &&
                       !videoElement?.src?.includes('preloader.mp4') &&
                       mediaExtensions.some(ext => videoElement.src.endsWith(`.${ext}`))
                      ) {
                mediaElement = videoElement;
            }
            if (mediaElement) {
                const mediaSource = mediaElement.src;
                const downloadBtn = document.createElement('span');
                downloadBtn.classList.add('download', 'btn');
                downloadBtn.textContent = mediaElement.tagName === 'AUDIO' ? '오디오 다운로드' : '비디오 다운로드';
                downloadBtn.style.display = 'inline-block';
                downloadBtn.style.fontSize = '12px';
                downloadBtn.style.color = '#b1b1b1';
                downloadBtn.style.cursor = 'pointer';
                playTimeTextArea.insertAdjacentElement('afterend', downloadBtn);
                downloadBtn.addEventListener('mouseover', function() {
                    downloadBtn.style.color = '#ffffff';
                });

                downloadBtn.addEventListener('mouseout', function() {
                    downloadBtn.style.color = '#b1b1b1';
                });
                downloadBtn.addEventListener('click', function() {
                    const mediaSourceExtension = mediaSource.substr(mediaSource.lastIndexOf('.'));
                    const illegalCharsRegex = /[<>:"/\\|?*\x00-\x1F]/g; // Windows 파일 시스템에서 사용 불가능한 문자들 + null 문자
                    const cleanedFilename = content_title.replace(illegalCharsRegex, '').substring(0, 230);
                    const combinedFilename = cleanedFilename + mediaSourceExtension;
                    downloadFile(mediaSource, combinedFilename, downloadBtn);
                });
            } else {
                // audioElement나 videoElement가 없거나 src에 https가 포함되어 있지 않은 경우 100ms 후에 다시 시도합니다.
                setTimeout(waitForPlayTimeTextArea, 100);
            }
        } else {
            // .vc-pctrl-on-playing 요소가 존재하지 않는 경우 100ms 후에 다시 시도합니다.
            setTimeout(waitForPlayTimeTextArea, 100);
        }
    }
    waitForPlayTimeTextArea();
}

if (window.location.href.startsWith('https://kucom.korea.ac.kr/em/')) {
    mediaDownloadFunc();
}