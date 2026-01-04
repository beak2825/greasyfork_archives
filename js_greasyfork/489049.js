// ==UserScript==
// @name cc98.org responsive
// @namespace github.com/openstyles/stylus
// @version 1.0.1
// @description Responsive design for cc98.org
// @author ml98
// @license MIT
// @grant GM_addStyle
// @run-at document-start
// @match https://www.cc98.org/
// @match https://www.cc98.org/topic/*
// @match https://www.cc98.org/editor/*
// @match https://www.cc98.org/user*
// @match https://www.cc98.org/message*
// @match https://www.cc98.org/newTopics*
// @match https://www.cc98.org/focus*
// @match https://www.cc98.org/recommendedTopics*
// @match https://www.cc98.org/search*
// @match https://www.cc98.org/topic/hot-*
// @match https://www.cc98.org/boardList*
// @match https://www.cc98.org/board/*
// @match https://www.cc98.org/signin*
// @include https://www.cc98.org*/*
// @downloadURL https://update.greasyfork.org/scripts/489049/cc98org%20responsive.user.js
// @updateURL https://update.greasyfork.org/scripts/489049/cc98org%20responsive.meta.js
// ==/UserScript==

(function() {
let css = "";
if (location.href.startsWith("https://www.cc98.org")) {
  css += `
    @media (min-width: 0px)
    {

      .main-container,
      .headerWithoutImage,
      .header
      {
        min-width: auto;
      }

      .header,
      .headerWithoutImage
      {

        .topBarRow
        {
          max-width: 900px;
          & > .row
          {
            width: 100%;
            & > .topBarCC98
            {
              display: none;
            }
            & > #search
            {
              width: 20%;
              flex-grow: 1;
              & > .box
              {
                width: 100%;
                padding: 0rem;
                margin-left: 0rem;
                & > .searchBoxSelect
                {
                  flex-shrink: 0;
                }
                & > #searchText
                {
                  width: 100%;
                }
                & > .searchIco
                {
                  margin: 6px;
                }
              }
            }
          }
        }
        .topBarText
        {
          margin-right: 0.5rem;
        }

        .topBarUserName
        {
          display: none !important;
        }
        .topBarUserCenter,
        .topBarUserCenter-mainPage
        {
          margin-left: 0;
        }
      }

      .main-container
      {
        & > .footer
        {
          min-width: 100% !important;
        }
        .footerRow {
          flex-wrap: wrap;
        }
      }
    }
  `;
}
if (location.href === "https://www.cc98.org/") {
  css += `
    @media (min-width: 0px)
    {
      .mainPage
      {
        min-width: auto;
        width: 100%;
        flex-direction: column;
        align-items: center;
        & > .leftPart
        {
          width: 90%;
          margin: 1em;
          & > .announcement
          {
            width: auto;
          }
          & > .recommendedReading
          {
            width: auto;
            .recommendedReadingContent
            {
              height: 10em !important;
              padding-bottom: 1em;
              & > .column
              {
                .recommendedReadingButtons
                {
                  margin-top: auto;
                }
                & > div
                {
                  white-space: normal;
                }
              }
            }
          }
          & > .row
          {
            flex-direction: row;
            & > .mainPageList
            {
              width: calc(50% - 1em);
              & > [class^="mainPageTitle"]
              {
                flex-wrap: wrap;
              }
            }
          }
        }

        & > .rightPart
        {
          width: 90%;
          flex-wrap: wrap;
          flex-direction: column;
          width: 90%;
          flex-wrap: wrap;
          height: 55em;
          justify-content: flex-start;
          align-content: space-around;
          & > div
          {
            width: auto;
            max-width: calc(min(240px, 45%));
            margin-top: 0em !important;
            margin-bottom: 1em !important;

            &:nth-child(2) img
            {
              width: 100% !important;
              height: auto !important;
            }
            &:nth-last-child(-n + 3)
            {
              order: 0;
              max-width: 180px;
            }
          }
        }

        .announcementContent,
        .recommendedReadingContent,
        .mainPageListContent1,
        .mainPageListContent2,
        _
        {
          border-radius: 4px;
        }
      }
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/topic/")) {
  css += `
    @media (min-width: 0px)
    {
      .main-container
      {
        & > .center
        {
          width: calc(62.5% + 240px) !important;
          & > .topicInfo-info
          {
            width: 100% !important;
            border-radius: 6px;

            & > .topicInfo-title
            {
              width: 100% !important;
              border-radius: 6px;

              & > .column
              {
                width: 100% !important;
                & > .row
                {
                  flex-wrap: wrap;
                }
              }
              & > .topicInfo-boardMessage
              {
                display: none;
              }
            }

            .topicInfo-ads
            {
              display: none;
            }
          }

          & .center
          {
            width: 100% !important;
          }

          /* & > .column > .row */
          & .row:has( > .pagination)
          {
            padding-bottom: 1em;
            flex-direction: row;
            & > .row
            {
              margin-bottom: 0 !important;
              & > :nth-child(-n+4) {
                display: none;
              }
            }
            & > .pagination
            {
              & > ul
              {
                margin: 0;
                padding: 0;
                & a
                {
                  margin: 0;
                  border-right-width: 0;
                }
                & > li.page-item:first-child > a
                {
                  border-top-left-radius: 6px;
                  border-bottom-left-radius: 6px;
                }
                & > li.page-item:last-child > a
                {
                  border-right-width: 1px;
                  border-top-right-radius: 6px;
                  border-bottom-right-radius: 6px;
                }
              }
            }
          }
        }

        .reply
        {
          width: 100% !important;
          border-radius: 6px;
          flex-direction: column;
          border: none;
          box-shadow: 0 0 3px #0003;

          & > .userMessage
          {
            width: 100% !important;
            border-radius: 6px 6px 0 0;
            display: flex;
            flex-direction: row-reverse !important;
            align-items: center;
            padding-top: 0.5rem;
            padding-bottom: 0.5rem;

            & > .userMessage-left
            {
              width: 100%;
              padding-top: 0em !important;
              padding-right: 1em !important;
              & > .column
              {
                width: auto !important;
                flex-direction: row !important;
                padding-left: 0 !important;
                margin-top: 0.5rem !important;
                & > .userMessageOpt
                {
                  padding-right: 1rem;
                }
              }

              & > .userMessage-userName
              {
                margin-left: 0;
                margin-right: auto;
                text-align: left !important;
              }

              & > div:has( > .userMessageAnonymous)
              {
                flex-direction: row !important;
                & > :first-child
                {
                  margin-top: 0 !important;
                }
                & > .userMessageAnonymous
                {
                  margin-top: 0 !important;
                }
              }
            }

            & > .userMessage-right
            {
              width: 4rem;
              flex-direction: row !important;
              padding-left: 1rem !important;
              & > .userMessageBtn
              {
                margin-top: 0;
                margin-left: 10em;
                align-items: flex-start;
              }
              & > div > div .userPortrait
              {
                width: 4em;
                height: 4em;
              }
            }
          }

          & > div:last-child
          {
            position: absolute;
            top: 6rem;
            align-self: flex-end;
          }
          & .reply-floor,
          .reply-floor-lz
          {
            top: 0rem;
            right: -20px !important;
          }

          & > .column
          {
            width: 100% !important;
            & > .reply-content > .substance
            {
              width: auto;
              margin-right: 1.5rem;
              & > article
              {
                & iframe[src*="bilibili.com"]
                {
                  width: 480px;
                  height: 270px;
                }
              }
              & > .markdown-container {
                max-width: none;
              }
            }

            & > .column
            {
              width: auto !important;

              & > .comment1
              {
                flex-wrap: wrap;
                & > div
                {
                  width: auto !important;
                }
                & > div:last-child
                {
                  margin-left: auto;
                }
                & > .row
                {
                  margin-right: 1.2rem;
                }
              }

              & > .row > .signature
              {
                display: none;
              }

              & > .good
              {
                width: auto !important;
              }
            }
          }
        }
      }
    }
    @media (max-width: 800px)
    {
      .main-container
      {
        & > .center
        {
          width: calc(100% - 60px) !important;
        }
      }
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/editor/") || location.href.startsWith("https://www.cc98.org/topic/")) {
  css += `
    @media (min-width: 0px)
    {
      .createTopic
      {
        width: 96%;
      }
      .createTopic,
      #sendTopicInfo
      {
        & .ubb-editor
        {
          border-radius: 6px;
          & > textarea
          {
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
          }
          & > .ubb-buttons
          {
            flex-wrap: wrap;
            & > .ubb-button
            {
              margin: 0;
              border-radius: 6px;
            }
          }
        }
        & .react-mde
        {
          border-radius: 6px;
          & > .mde-header
          {
            border-top-left-radius: 6px;
            border-top-right-radius: 6px;
          }
          & > .grip
          {
            border-bottom-left-radius: 6px;
            border-bottom-right-radius: 6px;
          }
        }
      }
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/user")) {
  css += `
    @media (min-width: 0px)
    {
      .main-container
      {
        & > .user-center
        {
          width: 96%;
          min-width: auto;
          & > .user-center-content
          {
            width: 100% !important;
            & > .user-center-body
            {
              flex-direction: column;
              & > .user-center-router
              {
                width: auto !important;
                border-radius: 6px;
                padding: 2em;
                & > .user-center-exact
                {
                  & > .user-avatar
                  {
                    align-items: flex-start;
                    width: 100%;
                    height: 20px;
                    & > img
                    {
                      width: 10%;
                      height: auto;
                      margin-left: 25%;
                      border-radius: 50%;
                    }
                  }

                  & > .user-profile
                  {
                    padding: 0;
                    & > #userId > #userId
                    {
                      flex-wrap: wrap;
                      & > p
                      {
                        width: 100%;
                      }
                    }
                  }
                }
              }

              & > .user-center-navigation
              {
                width: auto !important;
                height: auto;
                border-radius: 6px;
                padding: 1em;
                & > ul
                {
                  & > li
                  {
                    display: inline;
                    padding: 1em;
                    line-height: 2;
                  }
                  & > hr
                  {
                    display: none;
                  }
                }
              }
            }
          }
        }
      }
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/message")) {
  css += `
    @media (min-width: 0px)
    {
      .main-container
      {
        .message-root
        {
          width: 96%;
          min-width: auto;
          & > .message
          {
            width: 100% !important;
            & > .message-content
            {
              flex-direction: column;
              & > .message-right
              {
                width: auto !important;
                border-radius: 6px;
                margin-top: 1em;
                & > .message-response,
                & > .message-system
                {
                  border-radius: 6px;
                  & .message-response-box-middle
                  {
                    flex-shrink: unset;
                    & .message-response-box-middle-content
                    {
                      height: auto;
                    }
                  }
                  & > div:last-child
                  {
                    border-bottom: none;
                  }
                }
              }
              & > .message-message
              {
                height: auto;
                margin-top: 1em;
                flex-direction: column;
                & > .message-message-people
                {
                  width: auto !important;
                  & > .message-message-pTitle
                  {
                    border-radius: 6px 6px 0 0;
                    height: auto;
                    padding: 1em;
                  }
                  & > .message-message-pList
                  {
                    flex-direction: row;
                  }
                }
                & > .message-message-window
                {
                  height: 100%;
                  border-radius: 0 0 6px 6px;
                  & .message-message-wContent
                  {
                    flex-basis: 50vh;
                    flex-shrink: 0;
                    & .message-message-wcReceiver
                    {
                      padding: 10px;
                      & > a > img
                      {
                        padding: 0;
                        margin: 0;
                      }
                      & > .message-message-wcContent
                      {
                        margin: 0;
                        margin-left: 10px;
                        &:before
                        {
                          left: 55px;
                        }
                        &:after
                        {
                          left: 59px;
                        }
                      }
                    }
                    & .message-message-wcSender
                    {
                      padding: 10px;
                      & > a > img
                      {
                        padding: 0;
                        margin: 0;
                      }
                      & > .message-message-wcContent
                      {
                        margin: 0;
                        margin-right: 10px;
                        &:before
                        {
                          right: 55px;
                        }
                        &:after
                        {
                          right: 59px;
                        }
                      }
                    }
                  }
                  & .message-message-wPost
                  {
                    border-radius: 0 0 6px 6px;
                    background: none;
                    & > .message-message-wPostArea
                    {
                      width: auto;
                      height: 6em;
                      flex-basis: unset;
                      background: none;
                    }
                    & > .message-message-wPostBtn
                    {
                      margin: auto;
                      margin-bottom: 10px;
                    }
                  }
                }
              }

              & > .message-nav
              {
                width: auto;
                height: auto;
                margin: 0;
                border-radius: 6px;
                flex-direction: row;

                & > a > div
                {
                  padding: 1em;
                  line-height: 1;
                }
                & > hr
                {
                  display: none;
                }
              }
            }
          }
        }
      }
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/newTopics") || location.href.startsWith("https://www.cc98.org/focus") || location.href.startsWith("https://www.cc98.org/recommendedTopics") || location.href.startsWith("https://www.cc98.org/search") || location.href.startsWith("https://www.cc98.org/topic/hot-")) {
  css += `
    @media (min-width: 0px)
    {
      .main-container
      {
        & > .focus-root
        {
          width: calc(37.5% + 480px);
          & > .focus
          {
            width: 100%;

            .focus-board-area
            {
              & > .focus-boardTip
              {
                display: none;
              }
            }

            .focus-topic
            {
              width: 100%;
              margin-top: 2px;

              & > .focus-topic-left
              {
                flex-direction: column;
                flex-basis: 100px;
                width: 100px;
                align-items: center;

                & > .focus-topic-portraitUrl
                {
                  width: 48px;
                  height: 48px;
                  flex-shrink: 0;
                }
                & > .focus-topic-userName
                {
                  margin-right: 0;
                  font-size: 12px;
                  line-height: 1;
                  height: 100%;
                  text-align: center;
                }
              }

              & > .focus-topic-middle
              {
                flex-basis: 0;
                overflow: hidden;
                justify-content: space-around;

                .focus-topic-title
                {
                  width: fit-content;
                  min-width: 10px;
                  height: auto;
                  min-height: 10px;
                  white-space: initial;
                  margin: 10px;
                  margin-bottom: 0;
                }

                .focus-topic-info
                {
                  margin: 10px;
                }
              }

              & > .focus-topic-rightBar
              {
                height: auto;
                margin-top: 0;
                border-left-color: #79b8caa9;
              }

              .focus-topic-right
              {
                height: auto;
                flex-basis: 2em;
              }
            }
          }
        }
      }
    }
    @media (max-width: 800px)
    {
      .main-container
      {
        & > .focus-root
        {
          width: calc(100% - 20px);
        }
      }
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/boardList")) {
  css += `
    @media (min-width: 0px)
    {
      .main-container
      {
        & > .row
        {
          width: 100% !important;
          & > .boardList
          {
            padding: 0 2em 0 2em;
            width: 100% !important;
            & > .anArea
            {
              margin-bottom: 1em;
              border-radius: 12px;
              width: 100% !important;
              .boardContent
              {
                width: auto !important;
              }
              .noImgBoardContent
              {
                width: 25%;
              }
              .boardListHead
              {
                border-radius: 6px 6px 0 0;
              }
              .boardListHead:has( + .hiddenContent[ style*="none"])
              {
                border-radius: 6px;
              }
            }
          }
        }
      }
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/board/")) {
  css += `
    @media (min-width: 0px)
    {
      .main-container
      {
        & > .board-body
        {
          width: 96%;
          & > .board-head-body
          {
            .ant-collapse-header > .row
            {
              height: auto !important;
              flex-wrap: wrap;
              & > .row
              {
                justify-content: unset !important;
                & > .column
                {
                  flex-direction: row;
                }
              }
            }

            & > .board-head-bar > div:nth-child(2)
            {
              display: none;
            }
          }
          & > .board-postItem-head
          {
            border-radius: 6px 6px 0 0;
            & > .board-postItem-head-right
            {
              width: calc(max(40%, 15em));
              justify-content: space-between;
              & > div
              {
                width: auto;
                margin: auto;
              }
            }
          }
          & > .board-list-body
          {
            border-radius: 0 0 6px 6px;
            & > .board-postItem-body
            {
              &:last-child
              {
                border-radius: 0 0 6px 6px;
              }
              & > .board-postItem-right
              {
                width: calc(max(40%, 15em));
                flex-wrap: wrap;
                flex-shrink: 0;
                justify-content: space-between;
                & > .board-postItem-userName
                {
                  width: auto;
                }
                & > .board-postItem-tags
                {
                  width: auto;
                  & > .board-postItem-tag
                  {
                    width: auto;
                    & > span
                    {
                      width: 3.2em !important;
                    }
                  }
                }
                & > a:last-child
                {
                  & > div
                  {
                    white-space: normal;
                    width: auto;
                    & > span {}
                  }
                }
              }
            }
          }
        }
      }

      .ant-modal
      {
        max-width: calc(100vw - 32px);
      }
    }
  `;
}
if (location.href.startsWith("https://www.cc98.org/signin")) {
  css += `
    @media (min-width: 0px)
    {
      .main-container
      {
        & > .sign-in
        {
          width: calc(100% - 80px);
          border-radius: 12px;
        }
      }
    }
  `;
}
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
