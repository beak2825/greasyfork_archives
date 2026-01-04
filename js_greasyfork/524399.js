// ==UserScript==
// @name         숲 멀티뷰 시청자 제거기
// @namespace    http://tampermonkey.net/
// @version      1.2
// @description  숲 생방송 시청자 목록을 가져오고 멀티뷰를 제거합니다.
// @author       asdi
// @match        https://play.sooplive.co.kr/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/524399/%EC%88%B2%20%EB%A9%80%ED%8B%B0%EB%B7%B0%20%EC%8B%9C%EC%B2%AD%EC%9E%90%20%EC%A0%9C%EA%B1%B0%EA%B8%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/524399/%EC%88%B2%20%EB%A9%80%ED%8B%B0%EB%B7%B0%20%EC%8B%9C%EC%B2%AD%EC%9E%90%20%EC%A0%9C%EA%B1%B0%EA%B8%B0.meta.js
// ==/UserScript==

(function () {
  "use strict";

  // 팝업창 생성
  const popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "50%";
  popup.style.left = "0";
  popup.style.transform = "translateY(-50%)";
  popup.style.zIndex = "1000";
  popup.style.width = "350px";
  popup.style.padding = "15px";
  popup.style.backgroundColor = "#f8f9fa";
  popup.style.border = "1px solid #ccc";
  popup.style.borderRadius = "8px";
  popup.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
  popup.style.fontSize = "14px";
  popup.style.fontFamily = "Arial, sans-serif";
  popup.style.color = "#333";

  popup.innerHTML = `
<div id="buttonContainer" style="display: flex; justify-content: space-between; margin-bottom: 10px;">
    <button id="getNickName" style="padding: 8px 12px; background-color: #007BFF; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1; margin-right: 5px;">시청자 목록 가져오기</button>
    <button id="totalViewerCount" style="padding: 8px 12px; background-color: #28a745; color: white; border: none; border-radius: 4px; cursor: pointer; flex: 1; margin-right: 5px;">멀티뷰 중복 제거</button>
    <button id="resetButton" style="padding: 8px 12px; background-color: #ffc107; color: #212529; border: none; border-radius: 4px; cursor: pointer; flex: 1; margin-right: 5px;">초기화</button>
    <button id="closePopup" style="padding: 8px 12px; background-color: #dc3545; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 12px;">닫기</button>
</div>
<div id="nicknameSection">
    <table id="nicknameResultsTable" style="width: 100%; margin-top: 10px; border-collapse: collapse;">
        <thead>
            <tr style="background-color: #e9ecef; text-align: center; font-size: 14px;">
                <th>닉네임</th>
                <th>시청자 수</th>
                <th>로그인</th>
                <th>비로그인</th>
                <th>비율</th>
                <th>중복</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
</div>
<hr style="margin: 15px 0; border-top: 1px solid #ddd;">
<div id="totalViewerSection">
    <table id="totalViewerResultsTable" style="width: 100%; margin-top: 10px; border-collapse: collapse;">
        <thead>
            <tr style="background-color: #e9ecef; text-align: center; font-size: 14px;">
                <th>닉네임</th>
                <th>로그인</th>
                <th>비로그인</th>
                <th>합</th>
                <th>멀티뷰</th>
            </tr>
        </thead>
        <tbody>
        </tbody>
    </table>
    <div id="totalViewerResults" style="margin-top: 10px; padding: 10px; background-color: #d1e7dd; border-radius: 4px; font-size: 12px; white-space: pre-wrap;">결과가 여기에 표시됩니다.</div>
</div>
`;

  document.body.appendChild(popup);

  // 닫기 버튼 핸들러
  document.getElementById("closePopup").addEventListener("click", () => {
    document.body.removeChild(popup); // 팝업창 삭제
  });

  // userIdList에서 괄호 부분을 무시하고 중복 없는 아이디 리스트를 구하는 함수
  const getUniqueUserIdList = (userIdList) => {
    const uniqueUserIds = new Set();
    userIdList.forEach((userId) => {
      const baseUserId = userId.replace(/\(\d+\)$/, "");
      uniqueUserIds.add(baseUserId);
    });
    return [...uniqueUserIds];
  };

  const countDuplicateUsers = (userIdList) => {
    const userCountMap = new Map();

    userIdList.forEach((userId) => {
      const baseUserId = userId.replace(/\(\d+\)$/, ""); // 괄호 숫자 제거
      userCountMap.set(baseUserId, (userCountMap.get(baseUserId) || 0) + 1);
    });

    // 중복 2개 이상인 사용자만 필터링
    const duplicateUsers = [...userCountMap].filter(([_, count]) => count >= 2);

    return duplicateUsers.length;
  };

  // 닉네임 가져오기 버튼 핸들러
  document.getElementById("getNickName").addEventListener("click", async () => {
    const nicknameElement = document.querySelector("a#infoNickName");
    const nicknameResultsTable = document.getElementById(
      "nicknameResultsTable"
    );

    if (nicknameElement) {
      const nickname = nicknameElement.textContent.trim();

      try {
        liveView.Chat.chatUserListLayer.reconnect();
        liveView.playerController.sendChUser();

        const viewerText = document.getElementById("nAllViewer").textContent;
        const viewerNumber = parseInt(viewerText.replace(/,/g, ""));
        console.log("시청자:", viewerNumber);

        // 3초 대기
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const userList = liveView.Chat.chatUserListLayer;
        // const userIdList = [
        //   ...Object.keys(userList.userListSeparatedByGrade.fan).slice(1),
        //   ...Object.keys(userList.userListSeparatedByGrade.manager).slice(1),
        //   ...Object.keys(userList.userListSeparatedByGrade.normal).slice(1),
        //   ...Object.keys(userList.userListSeparatedByGrade.subscription).slice(
        //     1
        //   ),
        //   ...Object.keys(userList.userListSeparatedByGrade.supporter).slice(1),
        //   ...Object.keys(userList.userListSeparatedByGrade.vip).slice(1),
        // ];

        const userIdList = [
          ...userList.userListSeparatedByGrade.fan
            .slice(1)
            .map((user) => user.id),
          ...userList.userListSeparatedByGrade.manager
            .slice(1)
            .map((user) => user.id),
          ...userList.userListSeparatedByGrade.normal
            .slice(1)
            .map((user) => user.id),
          ...userList.userListSeparatedByGrade.subscription
            .slice(1)
            .map((user) => user.id),
          ...userList.userListSeparatedByGrade.supporter
            .slice(1)
            .map((user) => user.id),
          ...userList.userListSeparatedByGrade.vip
            .slice(1)
            .map((user) => user.id),
        ];

        const subscriptionKeysSet = new Set(
          Object.keys(userList.userSubscriptionMonth)
        );
        const loggedInCount = subscriptionKeysSet.size - 1; // 스트리머 -1
        console.log("로그인: ", loggedInCount);
        console.log("채팅창인원: ", userIdList.length);
        const nonLoggedInCount =
          viewerNumber - userIdList.length > 0
            ? viewerNumber - userIdList.length
            : 0;

        console.log("비로그인: ", nonLoggedInCount); // 19금방에서 시청자수보다 채팅창인원이 더많은경우 있음.
        const uniqueUserIdList = getUniqueUserIdList(userIdList);
        console.log("중복뺀 채팅창인원:", uniqueUserIdList.length);
        const loginRatio = (
          (loggedInCount / (nonLoggedInCount + loggedInCount)) *
          100
        ).toFixed(2);
        const duplicateViewCount = userIdList.length - loggedInCount;
        console.log("중복:", duplicateViewCount);
        console.log("중복중인 인원:", countDuplicateUsers(userIdList));

        // 테이블에 결과 표시
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${nickname}</td>
          <td>${viewerNumber.toLocaleString()}</td>
          <td>${loggedInCount.toLocaleString()}</td>
          <td>${nonLoggedInCount.toLocaleString()}</td>
          <td>${loginRatio}%</td>
          <td>${duplicateViewCount.toLocaleString()}</td>
        `;
        nicknameResultsTable.querySelector("tbody").appendChild(row);

        // ID Map에 저장
        const storedUserMap =
          JSON.parse(localStorage.getItem("userIdMap")) || [];
        const refinedUserMap = new Map(storedUserMap);

        function refineUserId(userId) {
          return userId.replace(/\(\d+\)$/, ""); // "(숫자)" 부분 제거
        }

        userIdList.forEach((userId) => {
          const refinedId = refineUserId(userId);

          if (!refinedUserMap.has(refinedId)) {
            refinedUserMap.set(refinedId, userId);
          } else {
            const existingUserId = refinedUserMap.get(refinedId);
            const existingPriority = existingUserId.match(/\((\d+)\)$/);
            const currentPriority = userId.match(/\((\d+)\)$/);

            if (
              !existingPriority ||
              (currentPriority &&
                parseInt(currentPriority[1]) < parseInt(existingPriority[1]))
            ) {
              refinedUserMap.set(refinedId, userId);
            }
          }
        });

        // 로컬스토리지에 저장
        localStorage.setItem("userIdMap", JSON.stringify([...refinedUserMap]));
        localStorage.setItem(
          "userIdList_" + nickname,
          JSON.stringify(userIdList)
        );
        localStorage.setItem(
          "uniqueUserIdList_" + nickname,
          JSON.stringify(uniqueUserIdList)
        );
        localStorage.setItem("nonLoggedInCount_" + nickname, nonLoggedInCount);
      } catch (error) {
        console.error("Error:", error);
        nicknameResultsTable.querySelector(
          "tbody"
        ).innerHTML = `<tr><td colspan="6" style="text-align: center; padding: 10px; color: red;">Error: ${error.message}</td></tr>`;
      }
    }
  });

  // 로컬스토리지에서 시청자 목록 불러오기
  window.addEventListener("load", () => {
    const nicknameResultsTable = document.getElementById(
      "nicknameResultsTable"
    );
    const storedNicknames = Object.keys(localStorage).filter((key) =>
      key.startsWith("userIdList_")
    );

    storedNicknames.forEach((key) => {
      const nickname = key.replace("userIdList_", "");
      const userIdList = JSON.parse(localStorage.getItem(key));
      const uniqueUserIdList = JSON.parse(
        localStorage.getItem("uniqueUserIdList_" + nickname)
      );
      const nonLoggedInCount =
        parseInt(localStorage.getItem("nonLoggedInCount_" + nickname)) || 0;
      const viewerNumber = userIdList.length + nonLoggedInCount;
      const loggedInCount = uniqueUserIdList.length;
      const loginRatio = (
        (loggedInCount / (nonLoggedInCount + loggedInCount)) *
        100
      ).toFixed(2);
      const duplicateViewCount = userIdList.length - loggedInCount;

      // 테이블에 표시
      const row = document.createElement("tr");
      row.innerHTML = `
        <td>${nickname}</td>
        <td>${viewerNumber.toLocaleString()}</td>
        <td>${loggedInCount.toLocaleString()}</td>
        <td>${nonLoggedInCount.toLocaleString()}</td>
        <td>${loginRatio}%</td>
        <td>${duplicateViewCount.toLocaleString()}</td>
      `;
      nicknameResultsTable.querySelector("tbody").appendChild(row);
    });
  });

  // 총 시청자 수 구하기 버튼 핸들러
  document.getElementById("totalViewerCount").addEventListener("click", () => {
    const totalViewerResults = document.getElementById("totalViewerResults");
    const totalViewerResultsTable = document.getElementById(
      "totalViewerResultsTable"
    );

    const nicknameKeys = Object.keys(localStorage).filter((key) =>
      key.startsWith("userIdList_")
    );

    if (nicknameKeys.length > 0) {
      const uniqueViewerLists = [];
      const storedUserMap = JSON.parse(localStorage.getItem("userIdMap"));
      const refinedUserMap = new Map(storedUserMap || []);
      const refinedViewerCounts = {}; // 정제된 아이디 기준 카운트
      const nicknames = [];
      let totalViewerNumber = 0;
      let totalLiveNumber = 0;
      let totalNonLoggedInCount = 0;

      nicknameKeys.forEach((key) => {
        const nickname = key.replace("userIdList_", "");
        const userIdList = JSON.parse(localStorage.getItem(key));
        const uniqueUserIdList = JSON.parse(
          localStorage.getItem("uniqueUserIdList_" + nickname)
        );
        const nonLoggedInCount =
          parseInt(localStorage.getItem("nonLoggedInCount_" + nickname)) || 0;
        totalNonLoggedInCount += nonLoggedInCount;
        let liveViewerCount = 0;

        uniqueViewerLists.push(new Set(uniqueUserIdList));
        nicknames.push(nickname);
        totalViewerNumber += uniqueUserIdList.length;

        userIdList.forEach((id) => {
          const refinedId = id.replace(/\(\d+\)$/, "");
          if (refinedUserMap.get(refinedId) === id) {
            liveViewerCount += 1; // liveViewerCount 증가
          }
        });
        // 테이블에 결과 표시
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${nickname}</td>
          <td>${liveViewerCount.toLocaleString()}</td>
          <td>${nonLoggedInCount.toLocaleString()}</td>
          <td>${(liveViewerCount + nonLoggedInCount).toLocaleString()}</td>
          <td>${(
            uniqueUserIdList.length - liveViewerCount
          ).toLocaleString()}</td>
        `;
        totalViewerResultsTable.querySelector("tbody").appendChild(row);

        totalLiveNumber += liveViewerCount;
      });

      const unionSet = new Set();
      uniqueViewerLists.forEach((set) =>
        set.forEach((viewer) => unionSet.add(viewer))
      );

      const multiViewExcludedCount = unionSet.size;

      const idCounts = {};
      uniqueViewerLists.forEach((set) => {
        set.forEach((viewer) => {
          idCounts[viewer] = (idCounts[viewer] || 0) + 1;
        });
      });

      const multiSetUsers = Object.keys(idCounts).filter(
        (viewer) => idCounts[viewer] > 1
      );
      const multiSetCount = multiSetUsers.length;

      const nicknameList = nicknames.join(", ");

      const now = new Date();
      const formattedDate = `${now.getFullYear()}년 ${
        now.getMonth() + 1
      }월 ${now.getDate()}일 ${
        ["일", "월", "화", "수", "목", "금", "토"][now.getDay()]
      } ${now.getHours()}:${now.getMinutes().toString().padStart(2, "0")}`;

      totalViewerResults.textContent = `집계 시각 : ${formattedDate}
      ${nicknameList} 의 멀티뷰 제외 로그인 시청자 수 : ${multiViewExcludedCount.toLocaleString()}명
      ( 멀티뷰 포함 : ${totalViewerNumber.toLocaleString()}, 멀티뷰로 증가한 시청자수 : ${(
        totalViewerNumber - multiViewExcludedCount
      ).toLocaleString()}, 멀티뷰 중인 시청자 수 : ${multiSetCount.toLocaleString()} )`;
    } else {
      totalViewerResults.textContent = "저장된 시청자 목록이 없습니다.";
    }
  });

  // 초기화 버튼 핸들러
  document.getElementById("resetButton").addEventListener("click", () => {
    localStorage.clear();
    document
      .getElementById("nicknameResultsTable")
      .querySelector("tbody").innerHTML = "";
    document
      .getElementById("totalViewerResultsTable")
      .querySelector("tbody").innerHTML = "";
    document.getElementById("totalViewerResults").textContent =
      "결과가 여기에 표시됩니다.";
  });
})();
