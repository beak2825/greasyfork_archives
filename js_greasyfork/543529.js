// ==UserScript==
// @name         치지직 필터
// @name:en      Chzzk Filter
// @namespace    Certify4113.greasyfork.org
// @version      2.0.3
// @description  치지직에서 원하는 태그, 채널을 필터링할 수 있습니다. 카테고리는 기본적으로 모두 필터링되어 있고, 설정을 통해 허용할 카테고리를 추가할 수 있습니다.
// @description:en Chzzk Content Blocker allows you to filter tags and channels on Chzzk. Categories are filtered by default, but you can add categories to allow them through the settings.
// @author       Certify4113
// @match        *://*.chzzk.naver.com/*
// @grant        none
// @run-at       document-start
// @require      https://cdn.jsdelivr.net/npm/xhook@1.6.2/dist/xhook.min.js
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/543529/%EC%B9%98%EC%A7%80%EC%A7%81%20%ED%95%84%ED%84%B0.user.js
// @updateURL https://update.greasyfork.org/scripts/543529/%EC%B9%98%EC%A7%80%EC%A7%81%20%ED%95%84%ED%84%B0.meta.js
// ==/UserScript==

(function () {
  var isMasterEnabled = localStorage.getItem("masterEnabled") !== "false";
  var isTagBlockingEnabled =
    localStorage.getItem("tagBlockingEnabled") !== "false" && isMasterEnabled;
  var isChannelBlockingEnabled =
    localStorage.getItem("channelBlockingEnabled") !== "false" &&
    isMasterEnabled;
  var isCategoryBlockingEnabled =
    localStorage.getItem("categoryBlockingEnabled") !== "false" &&
    isMasterEnabled;

  var blockedTags = [];
  var blockedChannels = [];
  var allowedCategories = [];

  const savedTags = localStorage.getItem("tags");
  if (savedTags) {
    const split = savedTags
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    blockedTags = blockedTags.concat(split);
  }

  const savedChannels = localStorage.getItem("channels");
  if (savedChannels) {
    const split = savedChannels
      .split("\n")
      .map((t) => {
        const res = t.trim();
        return res
          .replace("https://chzzk.naver.com/live/", "")
          .replace("http://chzzk.naver.com/live/", "")
          .replace("https://chzzk.naver.com/", "")
          .replace("http://chzzk.naver.com/", "");
      })
      .filter((t) => t.length == 32);
    blockedChannels = blockedChannels.concat(split);
  }

  const savedCategories = localStorage.getItem("categories");
  if (savedCategories) {
    const split = savedCategories
      .split("\n")
      .map((t) => t.trim())
      .filter((t) => t.length > 0);
    allowedCategories = allowedCategories.concat(split);
  }

  // #########################################################
  // 필터 로직 유틸리티 함수
  // #########################################################
  const isBlockedChannel = (channelId) => {
    if (!isChannelBlockingEnabled) return false;
    return blockedChannels.includes(channelId);
  };

  const isBlockedTag = (tags, liveCategoryValue) => {
    if (!isTagBlockingEnabled) return false;

    if (tags && Array.isArray(tags)) {
      for (const tag of blockedTags) {
        if (tags.includes(tag)) return true;
      }
    }

    if (liveCategoryValue && blockedTags.includes(liveCategoryValue))
      return true;

    return false;
  };

  const isBlockedContent = (content) => {
    if (isBlockedChannel(content.channel?.channelId)) return true;
    if (isBlockedTag(content.tags || [], content.liveCategoryValue))
      return true;
    return false;
  };

  // #########################################################
  // 필터 로직
  // #########################################################
  xhook.after(function (request, response) {
    const url = request.url;

    // 메인 페이지 필터링
    if (
      url.includes(
        "api.chzzk.naver.com/service/v1/topics/HOME/sub-topics/HOME/main"
      )
    ) {
      try {
        const origin = JSON.parse(response.text);

        if (origin.content && origin.content.slots) {
          origin.content.slots = origin.content.slots.filter((slot) => {
            if (!isCategoryBlockingEnabled) return true;
            if (!slot.slotTitle) return true;

            const isAllowed = allowedCategories.includes(slot.slotTitle);
            if (!isAllowed) {
              return false;
            }

            // 허용된 슬롯의 slotContents 내부 필터링
            if (slot.slotContents && Array.isArray(slot.slotContents)) {
              slot.slotContents = slot.slotContents.filter((content) => {
                // 1. 태그 필터 검사
                if (isTagBlockingEnabled) {
                  // liveCategoryValue 검사
                  if (
                    content.liveCategoryValue &&
                    blockedTags.includes(content.liveCategoryValue)
                  ) {
                    return false;
                  }

                  // tags 배열 검사
                  if (content.tags && Array.isArray(content.tags)) {
                    for (const tag of content.tags) {
                      if (blockedTags.includes(tag)) {
                        return false;
                      }
                    }
                  }
                }

                // 2. 채널 필터 검사
                if (
                  isChannelBlockingEnabled &&
                  content.channel &&
                  content.channel.channelId
                ) {
                  if (blockedChannels.includes(content.channel.channelId)) {
                    return false;
                  }
                }

                // 3. 기존 isBlockedContent 로직 적용
                if (isBlockedContent(content)) {
                  return false;
                }

                return true;
              });
            }

            return true;
          });
        }

        response.text = JSON.stringify(origin);
      } catch (error) {
        console.error(error);
      }
    }

    // 전체 방송-라이브 페이지 필터링
    else if (url.includes("api.chzzk.naver.com/service/v1/lives")) {
      try {
        const origin = JSON.parse(response.text);

        if (
          origin.content &&
          origin.content.data &&
          Array.isArray(origin.content.data)
        ) {
          origin.content.data = origin.content.data.filter((content) => {
            // 1. 태그 필터 검사
            if (isTagBlockingEnabled) {
              // liveCategoryValue 검사
              if (
                content.liveCategoryValue &&
                blockedTags.includes(content.liveCategoryValue)
              ) {
                return false;
              }

              // tags 배열 검사
              if (content.tags && Array.isArray(content.tags)) {
                for (const tag of content.tags) {
                  if (blockedTags.includes(tag)) {
                    return false;
                  }
                }
              }
            }

            // 2. 채널 필터 검사
            if (
              isChannelBlockingEnabled &&
              content.channel &&
              content.channel.channelId
            ) {
              if (blockedChannels.includes(content.channel.channelId)) {
                return false;
              }
            }

            return true;
          });
        }

        response.text = JSON.stringify(origin);
      } catch (error) {
        console.error(error);
      }
    }

    // 전체 방송-동영상 페이지 필터링
    else if (url.includes("api.chzzk.naver.com/service/v1/home/videos")) {
      try {
        const origin = JSON.parse(response.text);

        if (
          origin.content &&
          origin.content.data &&
          Array.isArray(origin.content.data)
        ) {
          origin.content.data = origin.content.data.filter((content) => {
            // 1. 태그 필터 검사
            if (isTagBlockingEnabled) {
              // videoCategoryValue 검사
              if (
                content.videoCategoryValue &&
                blockedTags.includes(content.videoCategoryValue)
              ) {
                return false;
              }

              // tags 배열 검사
              if (content.tags && Array.isArray(content.tags)) {
                for (const tag of content.tags) {
                  if (blockedTags.includes(tag)) {
                    return false;
                  }
                }
              }
            }

            // 2. 채널 필터 검사
            if (
              isChannelBlockingEnabled &&
              content.channel &&
              content.channel.channelId
            ) {
              if (blockedChannels.includes(content.channel.channelId)) {
                return false;
              }
            }

            return true;
          });
        }

        response.text = JSON.stringify(origin);
      } catch (error) {
        console.error(error);
      }
    }

    // 인기 클립 페이지 필터링
    else if (
      url.includes("api.chzzk.naver.com/service/v1/home/recommended/clips")
    ) {
      try {
        const origin = JSON.parse(response.text);

        if (
          origin.content &&
          origin.content.data &&
          Array.isArray(origin.content.data)
        ) {
          origin.content.data = origin.content.data.filter((content) => {
            // 채널 필터 검사 (ownerChannelId 기반)
            if (isChannelBlockingEnabled && content.ownerChannelId) {
              if (blockedChannels.includes(content.ownerChannelId)) {
                return false;
              }
            }

            return true;
          });
        }

        response.text = JSON.stringify(origin);
      } catch (error) {
        console.error(error);
      }
    }

    // 카테고리 릿스트 페이지 필터링
    else if (url.includes("api.chzzk.naver.com/service/v1/categories/live")) {
      try {
        const origin = JSON.parse(response.text);

        if (
          origin.content &&
          origin.content.data &&
          Array.isArray(origin.content.data)
        ) {
          origin.content.data = origin.content.data.filter((content) => {
            // 태그 필터 검사 (categoryValue 기반)
            if (isTagBlockingEnabled && content.categoryValue) {
              if (blockedTags.includes(content.categoryValue)) {
                return false;
              }
            }

            return true;
          });
        }

        response.text = JSON.stringify(origin);
      } catch (error) {
        console.error(error);
      }
    }

    // 카테고리별 라이브 페이지 필터링
    else if (
      url.includes("api.chzzk.naver.com/service/v2/categories/") &&
      url.includes("/lives")
    ) {
      try {
        const origin = JSON.parse(response.text);

        if (
          origin.content &&
          origin.content.data &&
          Array.isArray(origin.content.data)
        ) {
          origin.content.data = origin.content.data.filter((content) => {
            // 1. 태그 필터 검사
            if (isTagBlockingEnabled) {
              // liveCategoryValue 검사
              if (
                content.liveCategoryValue &&
                blockedTags.includes(content.liveCategoryValue)
              ) {
                return false;
              }

              // tags 배열 검사
              if (content.tags && Array.isArray(content.tags)) {
                for (const tag of content.tags) {
                  if (blockedTags.includes(tag)) {
                    return false;
                  }
                }
              }
            }

            // 2. 채널 필터 검사
            if (
              isChannelBlockingEnabled &&
              content.channel &&
              content.channel.channelId
            ) {
              if (blockedChannels.includes(content.channel.channelId)) {
                return false;
              }
            }

            return true;
          });
        }

        response.text = JSON.stringify(origin);
      } catch (error) {
        console.error(error);
      }
    }

    // 카테고리별 동영상 페이지 필터링
    else if (
      url.includes("api.chzzk.naver.com/service/v2/categories/") &&
      url.includes("/videos")
    ) {
      try {
        const origin = JSON.parse(response.text);

        if (
          origin.content &&
          origin.content.data &&
          Array.isArray(origin.content.data)
        ) {
          origin.content.data = origin.content.data.filter((content) => {
            // 1. 태그 필터 검사
            if (isTagBlockingEnabled) {
              // videoCategoryValue 검사
              if (
                content.videoCategoryValue &&
                blockedTags.includes(content.videoCategoryValue)
              ) {
                return false;
              }

              // tags 배열 검사
              if (content.tags && Array.isArray(content.tags)) {
                for (const tag of content.tags) {
                  if (blockedTags.includes(tag)) {
                    return false;
                  }
                }
              }
            }

            // 2. 채널 필터 검사
            if (
              isChannelBlockingEnabled &&
              content.channel &&
              content.channel.channelId
            ) {
              if (blockedChannels.includes(content.channel.channelId)) {
                return false;
              }
            }

            return true;
          });
        }

        response.text = JSON.stringify(origin);
      } catch (error) {
        console.error(error);
      }
    }

    // 카테고리별 클립 페이지 필터링
    else if (
      url.includes("api.chzzk.naver.com/service/v2/categories/") &&
      url.includes("/clips")
    ) {
      try {
        const origin = JSON.parse(response.text);

        if (
          origin.content &&
          origin.content.data &&
          Array.isArray(origin.content.data)
        ) {
          origin.content.data = origin.content.data.filter((content) => {
            // 채널 필터 검사 (ownerChannelId 기반)
            if (isChannelBlockingEnabled && content.ownerChannelId) {
              if (blockedChannels.includes(content.ownerChannelId)) {
                return false;
              }
            }

            return true;
          });
        }

        response.text = JSON.stringify(origin);
      } catch (error) {
        console.error(error);
      }
    }
  });

  // #########################################################
  // 설정 에디터 UI 생성 및 동작
  // #########################################################
  const COLORS = {
    chzzkGreen: "rgb(0, 230, 147)",

    background: {
      primary: "#141517",
      secondary: "#1e2022",
      hover: "hsla(0, 0%, 100%, 0.05)",
      overlay: "rgba(0, 0, 0, 0.8)",
    },

    text: {
      primary: "#ffffff",
      secondary: "#cccccc",
      muted: "#888888",
    },

    border: {
      primary: "#444444",
      secondary: "#666666",
    },

    shadow: {
      light: "rgba(0, 0, 0, 0.18)",
      medium: "rgba(0, 0, 0, 0.3)",
      dark: "rgba(0, 0, 0, 0.5)",
      overlay: "rgba(0, 0, 0, 0.8)",
    },
  };

  // 물음표 아이콘과 툴팁 생성 함수
  const createQuestionIcon = (description) => {
    const questionIcon = document.createElement("div");
    questionIcon.innerHTML = `<svg width="16" height="16" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        fill-rule="evenodd"
        clip-rule="evenodd"
        d="M0.877075 7.49972C0.877075 3.84204 3.84222 0.876892 7.49991 0.876892C11.1576 0.876892 14.1227 3.84204 14.1227 7.49972C14.1227 11.1574 11.1576 14.1226 7.49991 14.1226C3.84222 14.1226 0.877075 11.1574 0.877075 7.49972ZM7.49991 1.82689C4.36689 1.82689 1.82708 4.36671 1.82708 7.49972C1.82708 10.6327 4.36689 13.1726 7.49991 13.1726C10.6329 13.1726 13.1727 10.6327 13.1727 7.49972C13.1727 4.36671 10.6329 1.82689 7.49991 1.82689ZM8.24993 10.5C8.24993 10.9142 7.91414 11.25 7.49993 11.25C7.08571 11.25 6.74993 10.9142 6.74993 10.5C6.74993 10.0858 7.08571 9.75 7.49993 9.75C7.91414 9.75 8.24993 10.0858 8.24993 10.5ZM6.05003 6.25C6.05003 5.57211 6.63511 4.925 7.50003 4.925C8.36496 4.925 8.95003 5.57211 8.95003 6.25C8.95003 6.74118 8.68002 6.99212 8.21447 7.27494C8.16251 7.30651 8.10258 7.34131 8.03847 7.37854L8.03841 7.37858C7.85521 7.48497 7.63788 7.61119 7.47449 7.73849C7.23214 7.92732 6.95003 8.23198 6.95003 8.7C6.95004 9.00376 7.19628 9.25 7.50004 9.25C7.8024 9.25 8.04778 9.00601 8.05002 8.70417L8.05056 8.7033C8.05924 8.6896 8.08493 8.65735 8.15058 8.6062C8.25207 8.52712 8.36508 8.46163 8.51567 8.37436L8.51571 8.37433C8.59422 8.32883 8.68296 8.27741 8.78559 8.21506C9.32004 7.89038 10.05 7.35382 10.05 6.25C10.05 4.92789 8.93511 3.825 7.50003 3.825C6.06496 3.825 4.95003 4.92789 4.95003 6.25C4.95003 6.55376 5.19628 6.8 5.50003 6.8C5.80379 6.8 6.05003 6.55376 6.05003 6.25Z"
        fill="#cccccc"
      />
    </svg>`;
    questionIcon.style.width = "16px";
    questionIcon.style.height = "16px";
    questionIcon.style.display = "flex";
    questionIcon.style.alignItems = "center";
    questionIcon.style.justifyContent = "center";
    questionIcon.style.cursor = "help";
    questionIcon.style.display = "flex";
    questionIcon.style.transform = "translateY(1.5px)";
    questionIcon.className = "question-icon";

    // 툴팁 생성
    const tooltip = document.createElement("div");
    tooltip.textContent = description;
    tooltip.style.position = "absolute";
    tooltip.style.backgroundColor = COLORS.background.secondary;
    tooltip.style.color = COLORS.text.primary;
    tooltip.style.padding = "8px 12px";
    tooltip.style.borderRadius = "6px";
    tooltip.style.fontSize = "12px";
    tooltip.style.maxWidth = "250px";
    tooltip.style.whiteSpace = "normal";
    tooltip.style.lineHeight = "1.4";
    tooltip.style.boxShadow = `0 2px 8px ${COLORS.shadow.medium}`;
    tooltip.style.zIndex = "100001";
    tooltip.style.pointerEvents = "none";
    tooltip.style.opacity = "0";
    tooltip.style.transition = "opacity 0.2s";
    tooltip.style.border = `1px solid ${COLORS.border.primary}`;

    // 물음표 아이콘에 툴팁 이벤트 추가
    questionIcon.onmouseenter = (e) => {
      const rect = questionIcon.getBoundingClientRect();
      tooltip.style.left = rect.left + "px";
      tooltip.style.top = rect.bottom + 5 + "px";
      tooltip.style.opacity = "1";
      document.body.appendChild(tooltip);
    };

    questionIcon.onmouseleave = () => {
      tooltip.style.opacity = "0";
      setTimeout(() => {
        if (tooltip.parentNode) {
          tooltip.parentNode.removeChild(tooltip);
        }
      }, 200);
    };

    return questionIcon;
  };

  const editor = (() => {
    let editorEl = null;
    let backdropEl = null;
    let isOpen = false;

    // 에디터 생성 함수
    const createEditor = () => {
      // 배경 생성
      backdropEl = document.createElement("div");
      backdropEl.style.position = "fixed";
      backdropEl.style.top = "0";
      backdropEl.style.left = "0";
      backdropEl.style.width = "100%";
      backdropEl.style.height = "100%";
      backdropEl.style.backgroundColor = COLORS.shadow.medium;
      backdropEl.style.zIndex = "99998";
      backdropEl.style.display = "none";

      // 에디터 컨테이너 생성
      editorEl = document.createElement("div");
      editorEl.style.position = "fixed";
      editorEl.style.top = "50%";
      editorEl.style.left = "50%";
      editorEl.style.transform = "translate(-50%, -50%)";
      editorEl.style.width = "600px";
      editorEl.style.maxWidth = "90%";
      editorEl.style.maxHeight = "90vh";

      if (window.innerWidth <= 768) {
        editorEl.style.width = "95%";
        editorEl.style.maxWidth = "95%";
        editorEl.style.maxHeight = "95vh";
        editorEl.style.padding = "15px";
      }
      editorEl.style.backgroundColor = COLORS.background.primary;
      editorEl.style.borderRadius = "8px";
      editorEl.style.padding = "20px";
      editorEl.style.zIndex = "99999";
      editorEl.style.display = "none";
      editorEl.style.boxShadow = `0 4px 20px ${COLORS.shadow.dark}`;
      editorEl.style.color = COLORS.text.primary;
      editorEl.style.fontFamily =
        "-apple-system,BlinkMacSystemFont,Malgun Gothic,맑은 고딕,Helvetica,Arial,sans-serif";
      editorEl.style.overflowY = "auto";
      editorEl.style.overflowX = "hidden";
      editorEl.id = "chzzk-blocker-editor";

      editorEl.style.scrollbarWidth = "thin";
      editorEl.style.scrollbarColor = `${COLORS.border.secondary} ${COLORS.background.primary}`;

      const scrollbarStyle = document.createElement("style");
      scrollbarStyle.textContent = `
        #chzzk-blocker-editor::-webkit-scrollbar {
          width: 8px;
        }
        #chzzk-blocker-editor::-webkit-scrollbar-track {
          background: ${COLORS.background.primary};
          border-radius: 4px;
        }
        #chzzk-blocker-editor::-webkit-scrollbar-thumb {
          background: ${COLORS.border.secondary};
          border-radius: 4px;
        }
        #chzzk-blocker-editor::-webkit-scrollbar-thumb:hover {
          background: ${COLORS.border.primary};
        }
      `;
      document.head.appendChild(scrollbarStyle);

      const header = document.createElement("div");
      header.style.display = "flex";
      header.style.justifyContent = "space-between";
      header.style.marginBottom = "20px";

      const title = document.createElement("h2");
      title.innerHTML = `<span style="color: ${COLORS.chzzkGreen};">치지직</span> 필터 설정`;
      title.style.margin = "0";
      title.style.fontSize = "18px";

      const closeBtn = document.createElement("button");
      closeBtn.innerHTML = "✕";
      closeBtn.style.background = "none";
      closeBtn.style.border = "none";
      closeBtn.style.cursor = "pointer";
      closeBtn.style.fontSize = "20px";
      closeBtn.style.color = "inherit";
      closeBtn.style.padding = "0";
      closeBtn.style.margin = "0";
      closeBtn.style.lineHeight = "1";
      closeBtn.style.display = "flex";
      closeBtn.style.alignItems = "center";
      closeBtn.style.justifyContent = "center";
      closeBtn.onclick = close;

      header.appendChild(title);
      header.appendChild(closeBtn);
      editorEl.appendChild(header);

      // 마스터 토글
      const masterToggleSection = document.createElement("div");
      masterToggleSection.style.marginBottom = "20px";
      masterToggleSection.style.padding = "15px";
      masterToggleSection.style.backgroundColor = COLORS.background.secondary;
      masterToggleSection.style.borderRadius = "8px";
      masterToggleSection.style.border = `1px solid ${COLORS.border.primary}`;

      const masterHeader = document.createElement("div");
      masterHeader.style.display = "flex";
      masterHeader.style.justifyContent = "space-between";
      masterHeader.style.alignItems = "center";
      masterHeader.style.marginBottom = "15px";

      const masterLabelContainer = document.createElement("div");
      masterLabelContainer.style.display = "flex";
      masterLabelContainer.style.alignItems = "center";
      masterLabelContainer.style.gap = "4px";
      masterLabelContainer.style.minWidth = "0";

      const masterLabel = document.createElement("label");
      masterLabel.textContent = "전체 필터 기능";
      masterLabel.style.fontWeight = "bold";
      masterLabel.style.fontSize = "16px";
      masterLabel.style.color = COLORS.text.primary;
      masterLabel.style.margin = "0";
      masterLabel.style.whiteSpace = "nowrap";
      masterLabel.style.flexShrink = "0";

      // 마스터 섹션용 물음표 아이콘 생성
      const masterQuestionIcon = createQuestionIcon(
        "이 토글을 끄면 모든 필터 기능이 비활성화됩니다."
      );

      masterLabelContainer.appendChild(masterLabel);
      masterLabelContainer.appendChild(masterQuestionIcon);

      // 마스터 토글 스위치
      const masterToggle = document.createElement("div");
      masterToggle.style.position = "relative";
      masterToggle.style.width = "50px";
      masterToggle.style.height = "25px";
      masterToggle.style.backgroundColor = isMasterEnabled
        ? COLORS.chzzkGreen
        : COLORS.border.secondary;
      masterToggle.style.borderRadius = "12.5px";
      masterToggle.style.cursor = "pointer";
      masterToggle.style.transition = "background-color 0.2s";

      const masterToggleButton = document.createElement("div");
      masterToggleButton.style.position = "absolute";
      masterToggleButton.style.top = "2.5px";
      masterToggleButton.style.left = isMasterEnabled ? "27px" : "2.5px";
      masterToggleButton.style.width = "20px";
      masterToggleButton.style.height = "20px";
      masterToggleButton.style.backgroundColor = "white";
      masterToggleButton.style.borderRadius = "50%";
      masterToggleButton.style.transition = "left 0.2s";
      masterToggleButton.style.boxShadow = `0 2px 4px ${COLORS.shadow.light}`;

      masterToggle.appendChild(masterToggleButton);
      masterHeader.appendChild(masterLabelContainer);
      masterHeader.appendChild(masterToggle);

      masterToggleSection.appendChild(masterHeader);

      // 마스터 토글 섹션에 버튼 추가
      const masterActions = document.createElement("div");
      masterActions.style.display = "flex";
      masterActions.style.justifyContent = "space-between";
      masterActions.style.gap = "10px";
      masterActions.style.marginTop = "15px";
      masterActions.style.paddingTop = "15px";
      masterActions.style.borderTop = `1px solid ${COLORS.border.primary}`;

      // 저장 버튼
      const saveBtn = document.createElement("button");
      saveBtn.textContent = "Save";
      saveBtn.style.padding = "8px 16px";
      saveBtn.style.borderRadius = "4px";
      saveBtn.style.border = `1px solid ${COLORS.chzzkGreen}`;
      saveBtn.style.backgroundColor = COLORS.background.primary;
      saveBtn.style.color = COLORS.chzzkGreen;
      saveBtn.style.cursor = "pointer";
      saveBtn.style.fontWeight = "bold";
      saveBtn.style.fontSize = "14px";

      saveBtn.onclick = () => {
        // localStorage에 입력값 저장
        localStorage.setItem(
          "tags",
          document.getElementById("editor-tags").value
        );
        localStorage.setItem(
          "channels",
          document.getElementById("editor-channels").value
        );
        localStorage.setItem(
          "categories",
          document.getElementById("editor-categories").value
        );

        // 저장 알림 표시
        const notification = document.createElement("div");
        notification.textContent =
          "설정이 저장되었습니다! 적용하려면 페이지를 새로고침하세요.";
        notification.style.position = "fixed";
        notification.style.left = "50%";
        notification.style.top = "40px";
        notification.style.transform = "translateX(-50%)";
        notification.style.background = COLORS.chzzkGreen;
        notification.style.color = COLORS.background.primary;
        notification.style.padding = "14px 28px";
        notification.style.borderRadius = "8px";
        notification.style.fontFamily =
          "-apple-system,BlinkMacSystemFont,Malgun Gothic,맑은 고딕,Helvetica,Arial,sans-serif";
        notification.style.fontSize = "15px";
        notification.style.fontWeight = "600";
        notification.style.boxShadow = `0 4px 16px ${COLORS.shadow.light}`;
        notification.style.zIndex = "100000";
        notification.style.pointerEvents = "none";
        document.body.appendChild(notification);

        setTimeout(() => {
          document.body.removeChild(notification);
        }, 3000);
      };

      // Save & Apply 버튼
      const applyBtn = document.createElement("button");
      applyBtn.textContent = "Save & Apply";
      applyBtn.style.padding = "8px 16px";
      applyBtn.style.borderRadius = "4px";
      applyBtn.style.border = "none";
      applyBtn.style.backgroundColor = COLORS.chzzkGreen;
      applyBtn.style.color = COLORS.background.primary;
      applyBtn.style.cursor = "pointer";
      applyBtn.style.fontWeight = "bold";
      applyBtn.style.fontSize = "14px";

      applyBtn.onclick = () => {
        // localStorage에 입력값 저장
        localStorage.setItem(
          "tags",
          document.getElementById("editor-tags").value
        );
        localStorage.setItem(
          "channels",
          document.getElementById("editor-channels").value
        );
        localStorage.setItem(
          "categories",
          document.getElementById("editor-categories").value
        );
        // 즉시 새로고침
        location.reload();
      };

      masterActions.appendChild(saveBtn);
      masterActions.appendChild(applyBtn);
      masterToggleSection.appendChild(masterActions);

      // 마스터 토글 클릭 이벤트
      masterToggle.onclick = () => {
        const newMasterState = !isMasterEnabled;
        isMasterEnabled = newMasterState;
        localStorage.setItem("masterEnabled", newMasterState.toString());

        // 마스터 토글 UI 업데이트
        masterToggle.style.backgroundColor = newMasterState
          ? COLORS.chzzkGreen
          : COLORS.border.secondary;
        masterToggleButton.style.left = newMasterState ? "27px" : "2.5px";

        // 모든 개별 토글 UI 업데이트
        const allToggles = document.querySelectorAll("[data-storage-key]");
        allToggles.forEach((toggle) => {
          const storageKey = toggle.getAttribute("data-storage-key");
          const textarea = toggle.parentElement.nextElementSibling;
          const toggleButton = toggle.querySelector("div");

          // 개별 토글의 실제 상태 확인
          let individualEnabled = false;
          if (storageKey === "tags") {
            individualEnabled =
              localStorage.getItem("tagBlockingEnabled") !== "false";
          } else if (storageKey === "channels") {
            individualEnabled =
              localStorage.getItem("channelBlockingEnabled") !== "false";
          } else if (storageKey === "categories") {
            individualEnabled =
              localStorage.getItem("categoryBlockingEnabled") !== "false";
          }

          if (newMasterState) {
            // 마스터가 켜지면 실제 상태에 따라 토글 위치 설정, 색상은 초록색
            toggle.style.backgroundColor = individualEnabled
              ? COLORS.chzzkGreen
              : COLORS.border.secondary;
            toggleButton.style.left = individualEnabled ? "22px" : "2px";
            textarea.disabled = !individualEnabled;
            textarea.style.opacity = individualEnabled ? "1" : "0.5";
            textarea.style.backgroundColor = individualEnabled
              ? COLORS.background.secondary
              : COLORS.background.primary;
          } else {
            // 마스터가 꺼지면 실제 상태에 따라 토글 위치는 유지하되 색상만 회색
            toggle.style.backgroundColor = COLORS.border.secondary;
            toggleButton.style.left = individualEnabled ? "22px" : "2px";
            textarea.disabled = true;
            textarea.style.opacity = "0.5";
            textarea.style.backgroundColor = COLORS.background.primary;
          }
        });
      };

      editorEl.appendChild(masterToggleSection);

      // 필터 목록 입력란 생성 함수
      const createSection = (
        title,
        description,
        storageKey,
        placeholder,
        isEnabled
      ) => {
        const section = document.createElement("div");
        section.style.marginBottom = "20px";

        // 헤더 영역
        const header = document.createElement("div");
        header.style.display = "flex";
        header.style.justifyContent = "space-between";
        header.style.alignItems = "flex-start";
        header.style.marginBottom = "10px";

        // 제목과 설명 컨테이너
        const titleContainer = document.createElement("div");
        titleContainer.style.flex = "1";
        titleContainer.style.marginRight = "15px";
        titleContainer.style.display = "flex";
        titleContainer.style.alignItems = "center";
        titleContainer.style.gap = "4px";
        titleContainer.style.minWidth = "0"; // flex 아이템이 줄어들 수 있도록

        const titleLabel = document.createElement("div");
        titleLabel.textContent = title;
        titleLabel.style.fontWeight = "bold";
        titleLabel.style.fontSize = "16px";
        titleLabel.style.margin = "0";
        titleLabel.style.color = COLORS.text.primary;
        titleLabel.style.whiteSpace = "nowrap"; // 제목은 줄바꿈 방지
        titleLabel.style.flexShrink = "0"; // 제목은 줄어들지 않도록

        // 물음표 아이콘 생성
        const questionIcon = createQuestionIcon(description);

        titleContainer.appendChild(titleLabel);
        titleContainer.appendChild(questionIcon);

        // 토글 스위치
        const toggle = document.createElement("div");
        toggle.style.position = "relative";
        toggle.style.width = "40px";
        toggle.style.height = "20px";
        toggle.style.backgroundColor = isEnabled
          ? COLORS.chzzkGreen
          : COLORS.border.secondary;
        toggle.style.borderRadius = "10px";
        toggle.style.cursor = "pointer";
        toggle.style.transition = "background-color 0.2s";
        toggle.style.flexShrink = "0";

        const toggleButton = document.createElement("div");
        toggleButton.style.position = "absolute";
        toggleButton.style.top = "2px";
        toggleButton.style.left = isEnabled ? "22px" : "2px";
        toggleButton.style.width = "16px";
        toggleButton.style.height = "16px";
        toggleButton.style.backgroundColor = "white";
        toggleButton.style.borderRadius = "50%";
        toggleButton.style.transition = "left 0.2s";
        toggleButton.style.boxShadow = `0 2px 4px ${COLORS.shadow.light}`;

        toggle.appendChild(toggleButton);
        header.appendChild(titleContainer);
        header.appendChild(toggle);

        const textarea = document.createElement("textarea");
        textarea.id = `editor-${storageKey}`;
        textarea.style.width = "100%";
        textarea.style.height = "120px";
        textarea.style.padding = "10px";
        textarea.style.borderRadius = "4px";
        textarea.style.border = `1px solid ${COLORS.border.primary}`;
        textarea.style.backgroundColor = isEnabled
          ? COLORS.background.secondary
          : COLORS.background.primary;
        textarea.style.resize = "vertical";
        textarea.style.fontFamily =
          "-apple-system,BlinkMacSystemFont,Malgun Gothic,맑은 고딕,Helvetica,Arial,sans-serif";
        textarea.style.fontSize = "13px";
        textarea.style.overflowX = "auto";
        textarea.style.whiteSpace = "nowrap";
        textarea.placeholder = placeholder;
        const placeholderStyle = document.createElement("style");
        placeholderStyle.textContent = `
          #chzzk-blocker-editor textarea::placeholder {
            white-space: pre-wrap !important;
            line-height: 1.4;
          }
        `;
        document.head.appendChild(placeholderStyle);
        textarea.disabled = !isEnabled;
        textarea.style.opacity = isEnabled ? "1" : "0.5";

        // localStorage에서 데이터 불러오기
        const savedData = localStorage.getItem(storageKey);
        if (savedData) {
          textarea.value = savedData;
        }

        // 토글 클릭 이벤트
        toggle.onclick = () => {
          if (!isMasterEnabled) {
            return;
          }

          const storageKey = toggle.getAttribute("data-storage-key");
          let currentState = false;

          if (storageKey === "tags") {
            currentState = isTagBlockingEnabled;
          } else if (storageKey === "channels") {
            currentState = isChannelBlockingEnabled;
          } else if (storageKey === "categories") {
            currentState = isCategoryBlockingEnabled;
          }

          const newState = !currentState;

          // 상태 업데이트
          if (storageKey === "tags") {
            isTagBlockingEnabled = newState;
            localStorage.setItem("tagBlockingEnabled", newState.toString());
          } else if (storageKey === "channels") {
            isChannelBlockingEnabled = newState;
            localStorage.setItem("channelBlockingEnabled", newState.toString());
          } else if (storageKey === "categories") {
            isCategoryBlockingEnabled = newState;
            localStorage.setItem(
              "categoryBlockingEnabled",
              newState.toString()
            );
          }

          // UI 업데이트
          toggle.style.backgroundColor = newState
            ? isMasterEnabled
              ? COLORS.chzzkGreen
              : COLORS.border.secondary
            : COLORS.border.secondary;
          toggleButton.style.left = newState ? "22px" : "2px";
          textarea.disabled = !newState || !isMasterEnabled;
          textarea.style.opacity = newState && isMasterEnabled ? "1" : "0.5";
          textarea.style.backgroundColor =
            newState && isMasterEnabled
              ? COLORS.background.secondary
              : COLORS.background.primary;
        };

        toggle.setAttribute("data-storage-key", storageKey);

        section.appendChild(header);
        section.appendChild(textarea);

        return section;
      };

      // 태그, 채널, 카테고리 입력란
      editorEl.appendChild(
        createSection(
          "1. 태그 필터",
          "필터링하고 싶은 태그를 한 줄에 하나씩 입력하세요.",
          "tags",
          "예시)\n종합 게임\n버튜버",
          isTagBlockingEnabled
        )
      );

      editorEl.appendChild(
        createSection(
          "2. 채널 필터",
          "필터링하고 싶은 채널 URL 또는 ID를 한 줄에 하나씩 입력하세요.",
          "channels",
          "예시)\nhttps://chzzk.naver.com/channel/1234567890\n1234567890",
          isChannelBlockingEnabled
        )
      );

      editorEl.appendChild(
        createSection(
          "3. 카테고리 필터",
          "허용하고 싶은 카테고리를 한 줄에 하나씩 입력하세요.",
          "categories",
          "예시)\n팔로잉 채널 라이브\n이 방송 어때요?\n이런 카테고리는 어때요?",
          isCategoryBlockingEnabled
        )
      );

      document.body.appendChild(backdropEl);
      document.body.appendChild(editorEl);
    };

    // 에디터 열기/닫기/토글 함수
    const open = () => {
      if (!editorEl) {
        createEditor();
      }
      backdropEl.style.display = "block";
      editorEl.style.display = "block";
      isOpen = true;
    };

    const close = () => {
      if (backdropEl && editorEl) {
        backdropEl.style.display = "none";
        editorEl.style.display = "none";
      }
      isOpen = false;
    };

    const toggle = () => {
      if (isOpen) {
        close();
        isOpen = false;
      } else {
        open();
        isOpen = true;
      }
    };

    return toggle;
  })();

  // 툴바에 에디터 열기 버튼 추가
  const editorOpenButton = document.createElement("div");
  editorOpenButton.style.marginRight = "1px";
  editorOpenButton.style.color = "inherit";
  editorOpenButton.style.flex = "none";
  editorOpenButton.style.position = "relative";
  editorOpenButton.style.width = "40px";
  editorOpenButton.style.height = "40px";
  editorOpenButton.style.borderRadius = "4px";
  editorOpenButton.style.display = "flex";
  editorOpenButton.style.alignItems = "center";
  editorOpenButton.style.justifyContent = "center";
  editorOpenButton.style.cursor = "pointer";

  editorOpenButton.innerHTML = `<svg width="25" height="25" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.91" d="M12,22.5h0A11.87,11.87,0,0,1,2.45,10.86V3.41L12,1.5l9.55,1.91v7.45A11.87,11.87,0,0,1,12,22.5Z"/>
    <circle fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.91" cx="12" cy="12" r="4.77"/>
    <line fill="none" stroke="currentColor" stroke-miterlimit="10" stroke-width="1.91" x1="15.38" y1="8.62" x2="8.66" y2="15.34"/>
  </svg>`;
  editorOpenButton.onclick = editor;

  const span = document.createElement("span");
  span.style.fontSize = "12px";
  span.style.left = "50%";
  span.style.letterSpacing = "-.3px";
  span.style.lineHeight = "14px";
  span.style.position = "absolute";
  span.style.top = "calc(100% + 2px)";
  span.style.whiteSpace = "nowrap";
  span.style.backgroundColor = COLORS.background.secondary;
  span.style.borderRadius = "6px";
  span.style.display = "none";
  span.style.padding = "5px 9px";
  span.style.transform = "translateX(-50%)";
  span.innerText = "치지직 필터";
  editorOpenButton.appendChild(span);

  editorOpenButton.onmouseover = () => {
    editorOpenButton.style.setProperty(
      "background-color",
      COLORS.background.hover,
      "important"
    );
    span.style.display = "block";
  };
  editorOpenButton.onmouseout = () => {
    editorOpenButton.style.setProperty(
      "background-color",
      "transparent",
      "important"
    );
    span.style.display = "none";
  };

  editorOpenButton.id = "chzzk-blocker-editor-open";

  const startObserver = () => {
    const observer = new MutationObserver(() => {
      if (!document.getElementById("chzzk-blocker-editor-open")) {
        const header = document.querySelector(`[class*=toolbar_section]`);
        if (header) header.insertBefore(editorOpenButton, header.firstChild);
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", startObserver);
  } else {
    startObserver();
  }
})();
