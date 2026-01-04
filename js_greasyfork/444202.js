// ==UserScript==
// @name         노벨피아 자동 출석체크
// @version      1.2.2
// @namespace    https://greasyfork.org/users/815641
// @description  실망이에오
// @match        https://novelpia.com/viewer/*
// @run-at       document-idle
// @grant        GM.getValue
// @grant        GM.setValue
// @downloadURL https://update.greasyfork.org/scripts/444202/%EB%85%B8%EB%B2%A8%ED%94%BC%EC%95%84%20%EC%9E%90%EB%8F%99%20%EC%B6%9C%EC%84%9D%EC%B2%B4%ED%81%AC.user.js
// @updateURL https://update.greasyfork.org/scripts/444202/%EB%85%B8%EB%B2%A8%ED%94%BC%EC%95%84%20%EC%9E%90%EB%8F%99%20%EC%B6%9C%EC%84%9D%EC%B2%B4%ED%81%AC.meta.js
// ==/UserScript==

// (async () => {
//   const date = new Date().toLocaleString('en-US', {timeZone: 'Asia/Seoul'}).split('/');
//   const nowMonth = parseInt(date[0]);
//   const nowDate = parseInt(date[1]);

//   // const savedDate = localStorage.getItem('last_attendance') ?? '0/0';
//   const savedDate = await GM.getValue('last_attendance', '0/0');
//   const lastAttendance = savedDate.split('/');

//   if (nowMonth === Number(lastAttendance[0]) && nowDate === Number(lastAttendance[1])) {
//     return;
//   }

//   toastr.options = {
//     closeButton: true,
//     progressBar: true,
//     timeOut: 2000,
//   };

//   const getCsrf = text => {
//     const csrf = text.match(/csrf *?: *?("|')(.*?)("|'),?/);
//     if (csrf) {
//       return csrf[2];
//     }
//     return null;
//   };

//   let csrf = '';

//   await fetch('https://novelpia.com/event/attendance_new', {
//     referrer: 'https://novelpia.com/',
//   })
//     .then(response => response.text())
//     .then(text => {
//       csrf = getCsrf(text);
//     });

//   if (!csrf) {
//     return toastr.error('CSRF 가져오기 실패!', '오류');
//   }

//   const attendanceURL = 'https://novelpia.com/proc/mileage_attendance_new';
//   const referrer = 'https://novelpia.com/event/attendance_new';
//   const headers = {
//     'content-type': 'application/x-www-form-urlencoded; charset=UTF-8',
//     'x-requested-with': 'XMLHttpRequest',
//   };

//   const getCoin = () => {
//     fetch(attendanceURL, {
//       headers,
//       referrer,
//       body: `csrf=${csrf}&cmd=add_coin`,
//       method: 'POST',
//     })
//       .then(res => {
//         if (res.ok) {
//           return res.json();
//         }
//         return Promise.reject(res);
//       })
//       .then(res => {
//         if (res.code === 200) {
//           toastr.success('실버코인이 지급되었습니다.', '10일 연속 출석체크 완료!');
//         } else {
//           toastr.info(res.msg, '코인');
//         }
//       })
//       .catch(() => {
//         toastr.error('코인 받기 실패!', '오류');
//       });
//   };

//   fetch(attendanceURL, {
//     headers,
//     referrer,
//     body: `csrf=${csrf}&cmd=attendance_check`,
//     method: 'POST',
//   })
//     .then(res => {
//       if (res.ok) {
//         return res.json();
//       }
//       return Promise.reject(res);
//     })
//     .then(res => {
//       if (res.code === 200) {
//         toastr.success('출석 성공!', '출석');
//         if (res.data.attendance_check === 10) {
//           getCoin();
//         }
//       } else {
//         if (res.msg === '새로운회차 소설감상이 필요합니다.') {
//           toastr.info(res.msg, '출석');
//           return;
//         }
//         if (res.msg === '잘못된 접근입니다.') {
//           toastr.error('일단 수동으로 출석하세요', '오류');
//         } else {
//           toastr.info(res.msg, '출석');
//         }
//       }
//       // localStorage.setItem('last_attendance', `${nowMonth}/${nowDate}`);
//       GM.setValue('last_attendance', `${nowMonth}/${nowDate}`);
//     })
//     .catch(() => {
//       toastr.error('출석 실패!', '오류');
//     });
// })();

(() => {
  toastr.options = {
    closeButton: true,
    progressBar: true,
    timeOut: 5000,
  };
  toastr.error("자동출석 스크립트 제거 ㄱㄱㄱ", "노피아가 자동출석 적용했으니");
})();
