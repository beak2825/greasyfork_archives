// ==UserScript==
// @name        [루시퍼홍] 아실 학군&단지 함께 표시(군포초 포함)
// @namespace   Violentmonkey Scripts
// @match       https://asil.kr/asil/*
// @grant       none
// @version     0.24
// @author      루시퍼홍
// @editor      루시퍼홍
// @require     https://code.jquery.com/jquery-1.12.4.min.js
// @description 2024. 6. 26. 오후 1ㅎ4:30:18
// @license
// @downloadURL https://update.greasyfork.org/scripts/498943/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%ED%95%99%EA%B5%B0%EB%8B%A8%EC%A7%80%20%ED%95%A8%EA%BB%98%20%ED%91%9C%EC%8B%9C%28%EA%B5%B0%ED%8F%AC%EC%B4%88%20%ED%8F%AC%ED%95%A8%29.user.js
// @updateURL https://update.greasyfork.org/scripts/498943/%5B%EB%A3%A8%EC%8B%9C%ED%8D%BC%ED%99%8D%5D%20%EC%95%84%EC%8B%A4%20%ED%95%99%EA%B5%B0%EB%8B%A8%EC%A7%80%20%ED%95%A8%EA%BB%98%20%ED%91%9C%EC%8B%9C%28%EA%B5%B0%ED%8F%AC%EC%B4%88%20%ED%8F%AC%ED%95%A8%29.meta.js
// ==/UserScript==
let leaveSchoolMarkerBtn = `<div class="filter_item" id="leaveSchoolMarkerWrap"><a href="#" class="filter_btn" id="leaveSchoolMarkerBtn"><i></i>학군 남기기</a></div>`;
let hideSchoolMarkerBtn = `<div class="filter_item" id="hideSchoolMarkerWrap"><a href="#" class="filter_btn" id="hideSchoolMarkerBtn"><i></i>학군 지우기</a></div>`;
let showSchoolListBtn = `<div class="filter_item" id="showSchoolListWrap"><a href="#" class="filter_btn" id="showSchoolListBtn"><i></i>학군창 표시</a></div>`;
let testBtn = `<div class="filter_item" id="testWrap"><a href="#" class="filter_btn" id="testBtn"><i></i>초교</a></div>`;


jQuery('#filter > div.filter_scroll > div').append(leaveSchoolMarkerBtn);
jQuery('#filter > div.filter_scroll > div').append(hideSchoolMarkerBtn);
jQuery('#filter > div.filter_scroll > div').append(showSchoolListBtn);
jQuery('#filter > div.filter_scroll > div').append(testBtn);

// base64 이미지 문자열
const middleBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAuCAYAAABap1twAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsIAAA7CARUoSoAAAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADZmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ2NzA1RjI4NTgzRDExRUFCNEI4RUExQUFGNDZGQTdEIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ2NzA1RjI3NTgzRDExRUFCNEI4RUExQUFGNDZGQTdEIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzRBQjUxRjAzODU4RUExMUFEODdGN0E5NUZGNDQyNDYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDhBMUUzRUI1M0Q4RTkxMTgwNUVEQjI5QjhDMTBFODEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7PdWOmAAAB+0lEQVRYR+2YTUsCQRjH19QOUnQxFikCu0WQktSlY4Ggd79A36Sv0ccoRfsEQh3y5MGwDimEhzKskDSb/zLPMtuLO+zsunuYHzzOM8Pq/naedV/G0CgS460fxFrF6y+eG+WhmXpsbn3wrmeWeKsKDtRxsNW1p3dz7znLu57xQ5Dkfv3WVeauu5EflVjquVKevyhAcnFW4rE18ge5xn3CMCpT3pXGzxLP/a1WMTvJFHpp3pXGzxK7VqOe7g8y+y8FlrpuS/g1g0Bqp/X1zs1mfnTKUqnt/RSUpmq2z1kjNesLFTzpvuZzjYMUi2U+5MpCBI9al7tMKj3oHD+wLs2cVImlNnIBBxlnkWSXmTdrhHPYPNseDy8whjsMLjGICQ/kGJ+x+JdABHONUsYwBti5GCRIQXJzBf0ssbCjwSf7gARmCjnFz5mbKweCOgchIYp5kgNBCtLsoRXlSFAK+xzETb1mtqu8Gyqlp51y73alhtz+u4vPclGAXZas6lKJgyq1CrYgZjCqgjEtqIBDMKpYglbC2yhhOUWxtA60oCpaUBUtqIoWVEULqqIFVdGCqpDgrNhfrfA8dLiL9e6Mh8IEi6QQWGcJa2bx6utYlYAghEgSbRQE7VUJCEKGJEkuTEFRcgpBkhQDYHyR0HoNSVpBgoBycWzR0KoXD8P4BtCNlqjo8eG0AAAAAElFTkSuQmCC';
const eleBase64Image = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACgAAAAuCAYAAABap1twAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsEAAA7BAbiRa+0AAAAZdEVYdFNvZnR3YXJlAEFkb2JlIEltYWdlUmVhZHlxyWU8AAADZmlUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS4zLWMwMTEgNjYuMTQ1NjYxLCAyMDEyLzAyLzA2LTE0OjU2OjI3ICAgICAgICAiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtbG5zOnhtcD0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLyIgeG1wTU06T3JpZ2luYWxEb2N1bWVudElEPSJ4bXAuZGlkOjQ4QTFFM0VCNTNEOEU5MTE4MDVFREIyOUI4QzEwRTgxIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOkQ2NzA1RjI4NTgzRDExRUFCNEI4RUExQUFGNDZGQTdEIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOkQ2NzA1RjI3NTgzRDExRUFCNEI4RUExQUFGNDZGQTdEIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgKFdpbmRvd3MpIj4gPHhtcE1NOkRlcml2ZWRGcm9tIHN0UmVmOmluc3RhbmNlSUQ9InhtcC5paWQ6NzRBQjUxRjAzODU4RUExMUFEODdGN0E5NUZGNDQyNDYiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6NDhBMUUzRUI1M0Q4RTkxMTgwNUVEQjI5QjhDMTBFODEiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7PdWOmAAACBklEQVRYR+2YTUsCQRjH19RLdBRCisBOQSSLfoRu1VVPUUY3obdj0bG7IdGli3T10KHXLxB0KPAYBdEhT3uwwApJs/kv88hYqcPOru5hfvA4zwzq/vZ5dn0ZQ6NIgI9uEChmlr55bmzd7w2/3Ex88qljhvioCk607WRzU7sfo/FKjE8d44Ygyf15r4PExtOYWZ1jqeNOOX6hAMkFWYtr9so/pAoLIcNIN/hUGjdb3PW9ipmzejRZjvCpNG62uGc38jPbVjTxmmRpz+cSblUQSB00H1+/HTerqyyVer6bgtLkzOwRG6SqLl3qLuAkgyzC7CZ5t1c6kL1eNq3H2QeW1lnghmny6EhfKrhyFZtOFY4jTO6ZTalyUsXxtIKLJ5XJ2tsp1vANg4ohUD2qINa7VtATwVThMmoYFg4uBglSkFzfWiwcyPpiD5BApZBT/K5cVzng1TUICVHMkRzwUpCqh1GUI0EpWtcgvtT3zew5nw6UzdLhfLk0coG8dbuLv+X8APtYsrtLLfaq1Sq0BFFBvwoGtKACbYJ+xRa0Ez76CdvJj61tQwuqogVV0YKqaEFVtKAqWlAVLagKCTbX7nbSPB843MX+74wfhSEWYSGwzzKoyuKvb9uuBAQhRJIY/SDY2pWAIGRIkuQGKShKNiBIkmIArPcT2q8hSTtIEFAurvUb2vXiYRg/g7WbJaWkBdMAAAAASUVORK5CYII=';

// 변경할 CSS 클래스 이름
const middelClassName = '.pin_schl.mi';
const eleClassName = '.pin_schl.el';


// 기존 클래스 이름과 새로운 클래스 이름
const oldClass = '.pin_schl.mi';
const newClass = '.pin_schl.el';

// 함수 호출하여 CSS 클래스 복제
cloneCSSClass(oldClass, newClass);


// JavaScript로 CSS 규칙 변경
function updateBackgroundImage(base64Image, className) {
    // 모든 스타일 시트를 순회
    for (let i = 0; i < document.styleSheets.length; i++) {
        const sheet = document.styleSheets[i];

        // 각 스타일 시트의 규칙을 순회
        for (let j = 0; j < sheet.cssRules.length; j++) {
            const rule = sheet.cssRules[j];

            // 해당 클래스 이름을 가진 규칙을 찾음
            if (rule.selectorText === className) {
                // background 속성을 base64 이미지로 변경
                rule.style.background = `url(${base64Image}) no-repeat 0 0`;
                rule.style.backgroundSize = '40px 46px';
                return;
            }
        }
    }
}

// 함수 호출로 CSS 업데이트 실행
updateBackgroundImage(middleBase64Image, middelClassName);
updateBackgroundImage(eleBase64Image, eleClassName);


  jQuery(document).on('click', (e) => {

     if(e.target.id === 'leaveSchoolMarkerBtn'){

        // 마커 배열을 반복하여 'pin_schl' 클래스가 포함된 마커를 제거하는 함수
        function removeMarkersWithPinSchl(markerArray) {
            // 필터를 사용하여 'pin_schl' 클래스가 포함된 마커만 제외한 새로운 배열 생성
            const filteredMarkers = markerArray.filter(marker => {
                // icon 속성의 content를 DOM으로 변환하여 클래스 포함 여부 확인
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = marker.icon.content;
                const hasPinSchlClass = tempDiv.querySelector('.pin_schl') !== null;

                // 'pin_schl' 클래스가 포함된 마커가 아닌 경우에만 true 반환
                return !hasPinSchlClass;
            });

            // 원래 마커 배열을 필터링된 배열로 업데이트
            return filteredMarkers;
        }


        // 함수 호출
        markerArray = removeMarkersWithPinSchl(markerArray);

        // 결과 출력 (필요한 경우)
        //console.log(markerArray);


     }else if(e.target.id === 'showSchoolListBtn'){

       $('#subtitle4').text('학군 리스트');
       $('#sub4').attr('src', '/asil/sub/school_list.jsp?area=' + AREA);
       $('#sub4_div').addClass('open').show();


     }else if(e.target.id === 'hideSchoolMarkerBtn'){

      // 특정 경로의 요소를 선택
      const targetElement = document.querySelector("#map > div:nth-child(1) > div > div:nth-child(1) > div:nth-child(3) > div:nth-child(2) ");

      // 요소가 존재하는지 확인
      if (targetElement) {
          // 하위 요소들 중에서 "pin_schl" 클래스를 포함한 요소가 있는지 확인
          const pinSchlElements = targetElement.querySelectorAll('.pin_schl');

          // "pin_schl" 클래스가 포함된 요소가 있으면 화면에서 안보이게 처리
          if (pinSchlElements.length > 0) {
              pinSchlElements.forEach(element => {
                  element.style.display = 'none';
              });
          }
      }



    }else if(e.target.id === 'testBtn'){


        var data = [
    {
        "latitude": 37.317573,
        "longitude": 126.921045,
        "markerId": "J100007298",
        "schoolName": "송안초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 16,
        "studentCountPerClassroom": 24
    },
    {
        "latitude": 37.327188,
        "longitude": 126.911067,
        "markerId": "J100001395",
        "schoolName": "둔대초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 7,
        "studentCountPerClassroom": 13
    },
    {
        "latitude": 37.32933,
        "longitude": 126.914957,
        "markerId": "S100002137",
        "schoolName": "대야초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 10,
        "studentCountPerClassroom": 15
    },
    {
        "latitude": 37.329308,
        "longitude": 126.915195,
        "markerId": "J100005627",
        "schoolName": "군포대야초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 10,
        "studentCountPerClassroom": 17
    },
    {
        "latitude": 37.316245,
        "longitude": 126.950136,
        "markerId": "J100001408",
        "schoolName": "의왕부곡초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 11,
        "studentCountPerClassroom": 18
    },
    {
        "latitude": 37.322786,
        "longitude": 126.940966,
        "markerId": "J100006431",
        "schoolName": "부곡중앙초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 14,
        "studentCountPerClassroom": 22
    },
    {
        "latitude": 37.338593,
        "longitude": 126.932906,
        "markerId": "J100005846",
        "schoolName": "군포신기초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 14,
        "studentCountPerClassroom": 23
    },
    {
        "latitude": 37.342198,
        "longitude": 126.940834,
        "markerId": "J100001406",
        "schoolName": "용호초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 10,
        "studentCountPerClassroom": 20
    },
    {
        "latitude": 37.354846,
        "longitude": 126.921449,
        "markerId": "J100001392",
        "schoolName": "능내초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 12,
        "studentCountPerClassroom": 21
    },
    {
        "latitude": 37.360405,
        "longitude": 126.918072,
        "markerId": "J100001400",
        "schoolName": "수리초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 10,
        "studentCountPerClassroom": 17
    },
    {
        "latitude": 37.364554,
        "longitude": 126.920179,
        "markerId": "J100001389",
        "schoolName": "궁내초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 13,
        "studentCountPerClassroom": 24
    },
    {
        "latitude": 37.348614,
        "longitude": 126.923953,
        "markerId": "J100001394",
        "schoolName": "도장초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 7,
        "studentCountPerClassroom": 12
    },
    {
        "latitude": 37.347711,
        "longitude": 126.925923,
        "markerId": "J100001403",
        "schoolName": "오금초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 10,
        "studentCountPerClassroom": 19
    },
    {
        "latitude": 37.345783,
        "longitude": 126.939598,
        "markerId": "J100004852",
        "schoolName": "당동초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 14,
        "studentCountPerClassroom": 21
    },
    {
        "latitude": 37.353677,
        "longitude": 126.928504,
        "markerId": "J100001413",
        "schoolName": "흥진초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 13,
        "studentCountPerClassroom": 22
    },
    {
        "latitude": 37.356455,
        "longitude": 126.926578,
        "markerId": "J100001401",
        "schoolName": "신흥초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 12,
        "studentCountPerClassroom": 19
    },
    {
        "latitude": 37.353274,
        "longitude": 126.934558,
        "markerId": "J100001388",
        "schoolName": "군포화산초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 11,
        "studentCountPerClassroom": 16
    },
    {
        "latitude": 37.343789,
        "longitude": 126.94537,
        "markerId": "J100001386",
        "schoolName": "군포옥천초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 12,
        "studentCountPerClassroom": 19
    },
    {
        "latitude": 37.348276,
        "longitude": 126.942434,
        "markerId": "J100001387",
        "schoolName": "군포초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 15,
        "studentCountPerClassroom": 22
    },
    {
        "latitude": 37.34646,
        "longitude": 126.954753,
        "markerId": "J100004853",
        "schoolName": "당정초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 14,
        "studentCountPerClassroom": 22
    },
    {
        "latitude": 37.359322,
        "longitude": 126.94067,
        "markerId": "J100001385",
        "schoolName": "군포양정초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 14,
        "studentCountPerClassroom": 21
    },
    {
        "latitude": 37.361254,
        "longitude": 126.924221,
        "markerId": "J100001396",
        "schoolName": "둔전초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 15,
        "studentCountPerClassroom": 22
    },
    {
        "latitude": 37.36592,
        "longitude": 126.930575,
        "markerId": "J100001384",
        "schoolName": "광정초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 12,
        "studentCountPerClassroom": 19
    },
    {
        "latitude": 37.365916,
        "longitude": 126.935747,
        "markerId": "J100006456",
        "schoolName": "한얼초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 10,
        "studentCountPerClassroom": 17
    },
    {
        "latitude": 37.372029,
        "longitude": 126.926343,
        "markerId": "J100001410",
        "schoolName": "태을초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 11,
        "studentCountPerClassroom": 20
    },
    {
        "latitude": 37.368479,
        "longitude": 126.934342,
        "markerId": "J100001399",
        "schoolName": "산본초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 13,
        "studentCountPerClassroom": 23
    },
    {
        "latitude": 37.37417,
        "longitude": 126.933821,
        "markerId": "J100001382",
        "schoolName": "곡란초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 10,
        "studentCountPerClassroom": 20
    },
    {
        "latitude": 37.366774,
        "longitude": 126.940873,
        "markerId": "J100001390",
        "schoolName": "금정초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 13,
        "studentCountPerClassroom": 21
    },
    {
        "latitude": 37.321384,
        "longitude": 126.958229,
        "markerId": "J100001407",
        "schoolName": "의왕덕성초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 15,
        "studentCountPerClassroom": 23
    },
    {
        "latitude": 37.354593,
        "longitude": 126.972432,
        "markerId": "J100001404",
        "schoolName": "오전초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 7,
        "studentCountPerClassroom": 15
    },
    {
        "latitude": 37.358367,
        "longitude": 126.973316,
        "markerId": "J100005628",
        "schoolName": "모락초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 11,
        "studentCountPerClassroom": 20
    },
    {
        "latitude": 37.345429,
        "longitude": 126.980548,
        "markerId": "J100001405",
        "schoolName": "왕곡초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 11,
        "studentCountPerClassroom": 19
    },
    {
        "latitude": 37.348571,
        "longitude": 126.975297,
        "markerId": "J100001381",
        "schoolName": "고천초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 12,
        "studentCountPerClassroom": 19
    },
    {
        "latitude": 37.366246,
        "longitude": 126.963094,
        "markerId": "J100003085",
        "schoolName": "호성초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 15,
        "studentCountPerClassroom": 23
    },
    {
        "latitude": 37.363523,
        "longitude": 126.968207,
        "markerId": "J100001409",
        "schoolName": "의왕초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 15,
        "studentCountPerClassroom": 23
    },
    {
        "latitude": 37.370657,
        "longitude": 127.006809,
        "markerId": "J100007277",
        "schoolName": "백운호수초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 13,
        "studentCountPerClassroom": 21
    },
    {
        "latitude": 37.389947,
        "longitude": 126.915239,
        "markerId": "J100003065",
        "schoolName": "신안초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 14,
        "studentCountPerClassroom": 23
    },
    {
        "latitude": 37.391976,
        "longitude": 126.904631,
        "markerId": "J100003074",
        "schoolName": "안양양지초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 9,
        "studentCountPerClassroom": 18
    },
    {
        "latitude": 37.376053,
        "longitude": 126.938219,
        "markerId": "J100001383",
        "schoolName": "관모초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 7,
        "studentCountPerClassroom": 13
    },
    {
        "latitude": 37.380193,
        "longitude": 126.934449,
        "markerId": "J100003051",
        "schoolName": "명학초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 11,
        "studentCountPerClassroom": 18
    },
    {
        "latitude": 37.37539,
        "longitude": 126.952888,
        "markerId": "J100003086",
        "schoolName": "호원초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 17,
        "studentCountPerClassroom": 24
    },
    {
        "latitude": 37.383981,
        "longitude": 126.950381,
        "markerId": "J100003084",
        "schoolName": "호계초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 13,
        "studentCountPerClassroom": 21
    },
    {
        "latitude": 37.387208,
        "longitude": 126.953902,
        "markerId": "J100003056",
        "schoolName": "범계초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 16,
        "studentCountPerClassroom": 24
    },
    {
        "latitude": 37.394479,
        "longitude": 126.927607,
        "markerId": "J100003076",
        "schoolName": "안양초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 13,
        "studentCountPerClassroom": 22
    },
    {
        "latitude": 37.391453,
        "longitude": 126.936224,
        "markerId": "J100003047",
        "schoolName": "덕천초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 16,
        "studentCountPerClassroom": 23
    },
    {
        "latitude": 37.394307,
        "longitude": 126.950116,
        "markerId": "J100003046",
        "schoolName": "달안초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 7,
        "studentCountPerClassroom": 13
    },
    {
        "latitude": 37.375782,
        "longitude": 126.962141,
        "markerId": "J100003068",
        "schoolName": "안양덕현초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 18,
        "studentCountPerClassroom": 25
    },
    {
        "latitude": 37.381374,
        "longitude": 126.957085,
        "markerId": "J100003073",
        "schoolName": "안양신기초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 21,
        "studentCountPerClassroom": 23
    },
    {
        "latitude": 37.376607,
        "longitude": 126.972293,
        "markerId": "J100001380",
        "schoolName": "갈뫼초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 13,
        "studentCountPerClassroom": 23
    },
    {
        "latitude": 37.37976,
        "longitude": 126.969235,
        "markerId": "J100003067",
        "schoolName": "안양남초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 14,
        "studentCountPerClassroom": 23
    },
    {
        "latitude": 37.388158,
        "longitude": 126.960649,
        "markerId": "J100003083",
        "schoolName": "평촌초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 17,
        "studentCountPerClassroom": 25
    },
    {
        "latitude": 37.389515,
        "longitude": 126.964587,
        "markerId": "J100003049",
        "schoolName": "동안초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 14,
        "studentCountPerClassroom": 21
    },
    {
        "latitude": 37.386513,
        "longitude": 126.966188,
        "markerId": "J100003045",
        "schoolName": "귀인초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 17,
        "studentCountPerClassroom": 25
    },
    {
        "latitude": 37.386276,
        "longitude": 126.970022,
        "markerId": "J100003053",
        "schoolName": "민백초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 15,
        "studentCountPerClassroom": 24
    },
    {
        "latitude": 37.385906,
        "longitude": 126.974747,
        "markerId": "J100001397",
        "schoolName": "백운초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 14,
        "studentCountPerClassroom": 21
    },
    {
        "latitude": 37.390483,
        "longitude": 126.975504,
        "markerId": "J100005043",
        "schoolName": "나눔초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 10,
        "studentCountPerClassroom": 20
    },
    {
        "latitude": 37.3886,
        "longitude": 126.981923,
        "markerId": "J100001391",
        "schoolName": "내손초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 8,
        "studentCountPerClassroom": 13
    },
    {
        "latitude": 37.389277,
        "longitude": 126.979945,
        "markerId": "J100005771",
        "schoolName": "내동초등학교",
        "organizationType": "공립",
        "studentCountPerTeacher": 15,
        "studentCountPerClassroom": 24
    },
    {
        "latitude": 37.393678,
        "longitude": 126.980662,
        "markerId": "J100003055",
        "schoolName": "벌말초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 14,
        "studentCountPerClassroom": 23
    },
    {
        "latitude": 37.392108,
        "longitude": 126.997299,
        "markerId": "J100001393",
        "schoolName": "덕장초등학교",
        "organizationType": "혁신",
        "studentCountPerTeacher": 12,
        "studentCountPerClassroom": 22
    }
];

        data.forEach(function(school) {
            var _marker = new naver.maps.Marker({
                map: map,
                position: new naver.maps.LatLng(school.latitude, school.longitude),
                icon: {
                    content: [
                        '<div class="pin_schl el ' + school.markerId + '" ><span class=t1>' + school.studentCountPerClassroom + '명</span><span class=t2>' + school.schoolName.replace("등학교", "") + '</span></div>'
                    ].join(''),
                    size: new naver.maps.Size(38, 58),
                    anchor: new naver.maps.Point(0, 0),
                },
                yAnchor: 1
            });
            //markerArray.push(_marker);
        });

    }
  });



// 함수: 특정 클래스 이름의 스타일을 복제하여 새로운 클래스 이름으로 정의하는 함수
function cloneCSSClass(oldClass, newClass) {
    // 모든 스타일 시트 가져오기
    const styleSheets = document.styleSheets;

    // 새로운 스타일 시트를 만들기 위한 변수
    let newStyles = '';

    // 각 스타일 시트를 순회
    for (let i = 0; i < styleSheets.length; i++) {
        const sheet = styleSheets[i];
        // 스타일 시트의 규칙(규칙이 없을 수도 있음)
        try {
            const rules = sheet.cssRules || sheet.rules;
            // 각 규칙을 순회
            for (let j = 0; j < rules.length; j++) {
                const rule = rules[j];
                // oldClass에 해당하는 규칙 찾기
                if (rule.selectorText && rule.selectorText.includes(oldClass)) {
                    // 규칙의 CSS 텍스트를 가져와서 newClass로 변환
                    const cssText = rule.cssText.replace(new RegExp(oldClass, 'g'), newClass);
                    newStyles += cssText + ' ';
                }
            }
        } catch (e) {
            // CORS 정책으로 인해 외부 스타일 시트에 접근할 수 없을 수 있음
            console.warn(`Cannot access stylesheet: ${sheet.href}`, e);
        }
    }

    // 새로운 스타일 시트를 문서에 추가
    if (newStyles) {
        const styleSheet = document.createElement('style');
        styleSheet.type = 'text/css';
        styleSheet.innerHTML = newStyles;
        document.head.appendChild(styleSheet);
        console.log(`New CSS class ${newClass} has been defined with the styles:`);
        console.log(newStyles);
    } else {
        console.log(`No styles found for the class ${oldClass}`);
    }
}




