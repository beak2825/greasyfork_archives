// ==UserScript==
// @name                Instagram Follow Spy
// @namespace           https://cjambrosi.dev.br
// @version             1.0.4
// @description         The script is a web scraper for Instagram web, where you can find out who doesn't follow you back and who you don't follow back, with a pleasant and intuitive interface. You can also check the last analysis performed.
// @description:pt-BR   O script é um web scraper para o Instagram web, onde permite descobrir quem não segue você e quem você não segue de volta com uma interface agradável e intuitiva. Também, é possível conferir a última analise realizada.
// @author              cjambrosi
// @license             MIT
// @supportURL          https://github.com/cjambrosi/instagram-follow-spy/issues
// @match               https://www.instagram.com/*
// @exclude             /^https?://\S+\.(txt|png|jpg|jpeg|gif|xml|svg|manifest|log|ini)[^\/]*$/
// @icon                data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACYAAAAmCAYAAACoPemuAAAACXBIWXMAAAsTAAALEwEAmpwYAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAjeSURBVHgB1VhNbGRHEa7qfmNvwqIdH1cC7ewFlJPHkUBw8phTuIS1QkDksrOcwk9iR0LazQrWY3GyctiBA1nIYWxYCQSCNYpWAgnJ3gscbSu5cPLkFJSLh/+J33vdfFXVb+y1dzwOnHjW87zXXd1dXfX1V1WP6RzXw5ceNl3ku57Kpg/xkotxzxF153/5pY2zxv35+Z+t+BjanqjBMQyySJu+Nly9vPmN/qQ1eZLAg6/9/prz1POhrDuKhMkjh5I9nqHgbjyMCwubi4PjY3au9eoZT2+5EJoi56PK4g76XCNqX3749TM35c7q/Hl7q1HWfK8kvlQw9o67YKYSmpaMZdjN0jTfPTkuuKdXCnJNUb+EKoVzIq+3zJEzd/dbvfp/rRg2t4RJ6jqpY8YzF+zkJvnNcaOvvfWVt1eqMX/68q9XoMhyacqYUqTyJM+FzVOni27prLWzszoxQdNH6A6A+chwClSlIL5kmCVGlkaO0YXOH7769qCGviKEFdktZCESbBysDLeST+0eCIoxXMPr6ri1x2Ks196qR+cPBBve7qjOE5zI5CFG/Op7hZ2Eu6N3jPHST7IxeQ/kjs31r78VM3PbNwYfyWLDLGvKbmUxcSr2D2fgHbghLIAVZNfoF8sxy3NMymG/Kq/2YWJRBn1QhThjPAfIoXf649OzEH70pPXHYixQNi84MTwxV3gR8BcGYE64YWAoVuBGu9wir3jCIUA767PORzKPtsfSx8Vx64+1WM6+5aGed4Ys3aVgQzAmrpE9cTRbKpZw4kQeChHcrPgLYC/0yXiv5lNLc5D5nMCAZ8etP9Zi2FWrFHpQa3i1jJ6wdKv1hArUUj7qLTRC2g+LwHJiJbHQkTXNUlzRBzWF885tse+/vNMqxU4sYJcTxFEAHHTnTq0mlol6Wp3iSZClfWYwWJqUb6A7LKanELKKT/k1zDLVg7vYhOT2uRQj52YLDAxY1JvDYDOvCulbsGPv1K0kfVEoxMBfuZuESRQCjuWUJtcTVVCQaYS2z69Ywco/60ImLKcQHCQ2UWGZLjGSHDycR6yH/iB8pQKwGFMmQSsUymEZtsAuGMTYeC2WQiNm4f+r6xTB3lx+p0Uh6ymJlsJTFSkqUY4INFMSJT16mbgrlnryjISNz9Cv7jaileMh3oV8IuWKvBEVFhd+tbh7XI9TrgzEg+BogxTpwpsebinEW6RYUmQQ58IUrE5FLxZRmtA2EEVQbFnkScgSdaMCXuIFlCHLVCDLzsWxFnt5eb9RPV8YdQ9pGrdcTw3p1DX9mPzw8bFDeX580AU61jY8Jlj1DWlQpVDcvrnf4OB7WYzznlIstPwp2m+Z4py6iUyGkmsq15psRnIQqvbkQo2nVWyVsJaek7ur3O4otsY+2O4LWUG1HjzWKkjOEyee0kHK607ZCGeSlbOEhqIXakhy0u8RgMRbEhI9JYIR9pAsRAMHXKsRwFksVQICHaHZg6iFZlRGYm4IDZzjXoa4N2+EmUKPKGX8ozsUPGhqA0uo4k6CszPWEF10ca/rq8JCLZAHwWrKQ1XwJ5+IWJRksTroUsdGw6CRcEDUQEsrC8zvYfFGVLMLrC3+uUSGx0g0EWeylJpS3GSRwOjTCU8lBZ0prQop6bJGi1iRM6zHVUQQegSZc5WVhL5/Zv47MuFzeoZ0Aq6OhVKn7uTojIhsrPqiZjhCsvJPKdfGRa5kNO3RVkqJpaKSk5wM0PmMdLVVxZd1xWs3329kzrWdchbFLBrANfzKuwwPyl2sCZHyF0AgGBFLCH9Jf5KTeYzf1JJUyZlMEKqIkkBlwWlOkm7rD8X2i/e/uE3nvdrL+3X6H667yzt1uc8rf2b59tLtD5pcFtex2+s4/jOJMvow+gYynI17a1f7Z43vQBF3SEu1SG2MayRa+StSy024dfW1e5/vf2TFXrj9wRLM23WaIFqOnj3GW+G94PLFt9741O6Txt/+5k4z87UHqEcbEvI1BFVcFg0OOK2rr/zkM6vnVuz5OwdLIL6uVTZHiuDu47nlEnFi9wfOx2cvfEiDQ8obU4SyjP6xO00X6siZtoDPK5liR8cPcFT3MA61RKzbHEIltLz048/+4KQOp5KO5zoHjRxeGNWBbFlq7vnG/bVPLDjOriJDfWT1AM+UJe8MMzogn+3gfYv44kFObgcZakPqgzzl+LlzP/3um3MLr7/57Axs10m1KZWROnfbp7F3SrFDcm0MqFfpr1beUlxQ7TcvvP6Xrb87lP0f5otF5F1T2l/KkbshjZ4L0c8hgqzK+JwtxZZCWZUg9+qdV9/dufPtd5Zu3ZtbDY5/aAUL1poKSxMVQ/IyXylkubpVNyXRTHC+hQLswT9rH2uUPqzqotLns7233ri6+6Pu1d3CZWrlVIlLUWM5v1ZG3AShd7/3rb3lwyn1itYJhYutiYohJDRyNhfajvxReS8lnCxUo3YMtV0pRkRxWGtU7UCBKyMrsbCZlXJlcp0UI8Fn1zvduQHk9vTd+cZJPbLTFpOrYu4q6IIgJOIamcp+5oeoXI1wnWQIo/G5hpqoSaMxfEzFMMsB4GjVzZVbr7zbLgLVq4RgomKQ6kOVK0F2SxZmNGd0ktyxBlzEwKYUEVKqWQlJI8qAZfZStck+HXqnf6aA5RLgRPa9IsVeSXUmKoaYtY0ttUxLAF/jZ8ppnEZbJg3cKRjDIlyWvz0aH3dLTQG0RNGlLWylsk9t6CxFchZwyxDWT+pxyoZTYSicMlDbpSvYQTA8jT4V6GcCwdH65trlfiV7f+2T25DdToeGy+pTghXGqVDm0acGyPRDzT+aqNh2Z2aA3b5GqRgzM+ibLhBG38d04X7p3WnmjnRD+/Q0euNC+zZGVVulcI611rrP9CcqJtcf7zy1DoctYwX7RHQsPugHEjSU3u/nHBd+15npnxz/C7FgoAXI9fNjnwQqshbro30AarrR7X5680k6nBnEP9f5d8P70AEoZmG0pioKYgXIHmXx6e52hwc04Xrx1vvycRhJgNUUGtZCXJ8qwsa97vgk4D/H685g3+WzUAAAAABJRU5ErkJggg==
// @run-at              document-start
// @compatible          chrome
// @compatible          firefox
// @compatible          safari
// @compatible          edge
// @grant               GM_addStyle
// @grant               GM_setValue
// @grant               GM_getValue
// @noframes
// @downloadURL https://update.greasyfork.org/scripts/541297/Instagram%20Follow%20Spy.user.js
// @updateURL https://update.greasyfork.org/scripts/541297/Instagram%20Follow%20Spy.meta.js
// ==/UserScript==

(function () {
  'use strict';

  /** Types
   * @typedef { 'pt-BR' | 'en' } Locale
   * @typedef {{ name: string; username: string; imageURL: string }} User
  */

  const MOCK_USERS = [
    { name: "James Hetfield | BRAZIL 🇧🇷", username: "jameshetfieldbr", imageURL: '' },
    { name: "Ozzy Osbourne", username: "ozzyosbourne", imageURL: '' },
    { name: "Zakk Wylde", username: "zakkwyldebls", imageURL: '' },
    { name: "Bruce Dickinson", username: "brucedickinsonhq", imageURL: '' },
    { name: "Brian Johnson", username: "brianjohnsontv", imageURL: '' },
    { name: "Rob Halford", username: "robhalfordlegacy", imageURL: '' },
    { name: "Kirk Hammett", username: "kirkhammett", imageURL: '' },
    { name: "Slash", username: "slash", imageURL: '' },
    { name: "Ronnie James Dio", username: "_ronniejamesdio", imageURL: '' },
    { name: "Dave Mustaine", username: "davemustaine", imageURL: '' },
  ];

  const MINIFY_CSS = `
    .floating-button{position:fixed;bottom:50px;right:35px;width:64px;height:64px;border:none;border-radius:9999px;background:linear-gradient(to top right,#3b82f6,#ec4899);box-shadow:0 4px 50px rgb(127 76 76 / .5);cursor:pointer;z-index:9999;transition:transform 0.2s ease-in-out}.floating-button:hover{transform:scale(1.05)}.floating-button:disabled{background:#374151;cursor:not-allowed;box-shadow:none;opacity:.6}.floating-button:disabled:hover{transform:scale(1)}.floating-button>.outline-spy-icon{width:24px;height:24px}.drawer-main{font-family:'Inter',sans-serif;width:100%;max-width:450px;height:100dvh;background-color:#1A1F2C;border-radius:.5rem 0 0 .5rem;color:#fff;margin:0;padding:0;position:fixed;top:0;right:0;z-index:999999;display:flex;flex-direction:column;justify-content:space-between;box-shadow:0 4px 40px rgb(0 0 0 / .5);transform:translateX(100%);opacity:0;transition:transform 0.3s ease,opacity 0.3s ease;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:antialiased;-webkit-appearance:optimizelegibility;-moz-appearance:optimizelegibility;appearance:optimizelegibility}.drawer-main.open{transform:translateX(0);opacity:1}.drawer-main *{scrollbar-width:thin;scrollbar-color:#6d6767 #2B2B2B}.drawer-main *::-webkit-scrollbar{width:12px;height:12px}.drawer-main *::-webkit-scrollbar-track{background:#2B2B2B}.drawer-main *::-webkit-scrollbar-thumb{background:#6d6767;border-radius:10px;border:3px solid #fff0;background-clip:content-box}.drawer-main *::-webkit-scrollbar-thumb:hover{background-color:#939393}.drawer-overlay{position:fixed;inset:0;background:rgb(0 0 0 / .6);z-index:999998;transform:translateX(100%);opacity:0;pointer-events:none;transition:opacity 0.3s ease;cursor:not-allowed}.drawer-overlay.open{transform:translateX(0);opacity:1;pointer-events:all}.drawer-header{display:flex;align-items:center;justify-content:space-between;padding:1rem;border-bottom:1px solid #374151}.drawer-header_title-container{display:flex;justify-content:center;align-items:center;gap:.5rem}.drawer-header_title{font-size:1.25rem;font-weight:700;margin:0}.drawer-header_close-button{background:none;border:none;color:#9CA3AF;padding:.5rem;cursor:pointer;transition:color 0.2s}.drawer-header_close-button:hover{color:#fff}.tabs-container{width:100%}.tabs-container_list{border-bottom:1px solid #374151;width:100%;display:grid;grid-template-columns:1fr 1fr;gap:.5rem}.button-tab-trigger{background:none;border:none;color:#9CA3AF;padding:1rem;cursor:pointer;font-size:1rem;transition:color 0.2s}.button-tab-trigger_counter-badge{margin-left:.5rem;color:#9CA3AF}.button-tab-trigger.active{color:#fff;border-bottom:2px solid #3B82F6}.button-tab-trigger.active .button-tab-trigger_counter-badge{color:#fff}.button-tab-trigger:disabled{color:#374151;cursor:not-allowed}.button-tab-trigger:disabled.active{border-bottom:2px solid #374151}.button-tab-trigger:disabled .button-tab-trigger_counter-badge{color:#374151}.main-content{height:calc(100dvh - 340px);overflow-x:hidden;overflow-y:auto}.user-list{list-style:none;padding:0;margin:0}.user-list.hide{display:none}.user-item{display:flex;align-items:center;justify-content:space-between;gap:2rem;padding:1rem;border-bottom:1px solid #374151;transition:background 0.2s}.user-item:last-child{border-bottom:none}.user-item:hover{background-color:#374151}.user-item_info{display:inline-flex;align-items:center;gap:.75rem;width:100%;text-decoration:none!important}.user-item_avatar-container{border:1px solid #fff;border-radius:9999px;max-width:40px;width:100%;height:40px;display:flex;justify-content:center;align-items:center;overflow:hidden}.user-item_avatar-container>.single-user-image{width:42px;height:42px;object-fit:cover}.user-item_avatar-container>.single-user-icon{width:24px;height:24px;object-fit:cover}.user-item_wrapper{display:flex;flex-direction:column;gap:2px}.user-item_name{font-weight:600;color:#fff}.user-item_username{font-size:.875rem;color:#9CA3AF}.user-item_copy-clipboard-button{background:none;border:none;color:#9CA3AF;padding:.5rem;cursor:pointer;transition:color 0.2s;display:flex;align-items:center;justify-content:center}.user-item_copy-clipboard-button>.clipboard-success-icon{display:none}.user-item_copy-clipboard-button.copied>.clipboard-icon{display:none}.user-item_copy-clipboard-button.copied>.clipboard-success-icon{display:block}.drawer-footer{height:191px;display:flex;flex-direction:column;justify-content:space-between;margin-top:20px}.drawer-footer_action-button-container{display:flex;flex-direction:column;justify-content:space-between}.drawer-footer_action-button{border:none;border-radius:100px;color:#fff;cursor:pointer;font-size:1.15rem;font-weight:600;background:linear-gradient(to top right,#3b82f6,#ec4899);box-shadow:0 4px 10px rgb(127 76 76 / .5);height:60px;width:200px;margin:0 auto;transition:transform 0.2s ease-in-out}.drawer-footer_action-button:hover{transform:scale(1.05)}.drawer-footer_action-button:disabled{background:#374151;cursor:not-allowed;box-shadow:none;opacity:.6}.drawer-footer_action-button:disabled:hover{transform:none}.drawer-footer_info-container{display:flex;flex-direction:column;gap:10px;margin-top:1rem;padding:1rem}.drawer-footer_info-container_flex-item{display:flex;align-items:center;justify-content:space-between;gap:5px}.drawer-footer_social-container{border-top:1px solid #374151;display:flex;align-items:center;justify-content:center;gap:5px;height:40px}.drawer-footer_text-info{font-size:.875rem;color:#9CA3AF;margin:0;padding:0}.drawer-footer_link{color:#3B82F6;font-size:.875rem;text-decoration:none;font-weight:400;transition:all 0.2s}.drawer-footer_link:hover{color:#fff;text-decoration:underline}.empty-container{display:flex;flex-direction:column;align-items:center;justify-content:center;gap:1rem;height:100%;text-align:center;padding:0 80px}.empty-container_image{width:64px;height:64px;margin-bottom:1rem}.empty-container_title{color:#fff;font-size:1.125rem;font-weight:700;margin:0;padding:0}.empty-container_description{color:#9CA3AF;font-size:.875rem;line-height:1.4;text-align:center;padding:0;margin:0}.error-message-container{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5rem 1rem 2rem}.error-message-container>.alert-icon{width:48px;height:48px;margin-bottom:12px}.error-message-container_title{color:#ea384c;font-size:1.125rem;font-weight:500;margin:0;padding:0;margin-bottom:8px}.error-message-container_description{color:#9CA3AF;font-size:.875rem;line-height:1.4;text-align:center;padding:0;margin:0}.error-message-container_list-text{padding:0 20px 0 50px;margin:0;list-style:disc}.error-message-container_list-text .error-message-container_description{text-align:left}.loading-container{background-color:#374151;border-radius:.5rem;display:flex;align-items:center;gap:1rem;margin:1.5rem 1rem;padding:.5rem 1rem;height:44px}.loading-container>.spinner-icon{animation:spin-loading 1.5s linear infinite}.loading-container_loading-text-container{position:relative;overflow:hidden;min-height:18px;width:100%}.loading-container_title{color:#fff;font-size:1rem;font-weight:600;display:block;position:absolute;width:100%;opacity:0;animation-duration:6s;animation-iteration-count:infinite;animation-timing-function:ease-in-out}.loading-container_title_1{animation-name:text-animation-1}.loading-container_title_2{animation-name:text-animation-2}.toast-container{position:relative;width:100%;height:0}.toast-container_toast{display:flex;align-items:center;gap:.5rem;position:absolute;top:-1px;right:0;left:0;width:100%;padding:1rem;background-color:#1A1F2C;box-shadow:0 4px 40px rgb(0 0 0 / .5);transform:translateY(-100%);opacity:0;transition:transform 0.3s ease,opacity 0.3s ease;z-index:100}.toast-container.active .toast-container_toast{transform:translateY(0);opacity:1}.toast_icon-container>.icon{width:20px;height:20px;margin-top:1px}.toast-container_toast.success{background-color:#43CA74}.toast-container_toast.error{background-color:#EA384C}.toast-container_toast.info{background-color:#3B82F6}.toast-container_toast.warning{background-color:#CF9E1E}.toast-container_toast .toast-container_toast_title{color:#fff;font-size:1rem;line-height:1.2;font-weight:600;margin:0;padding:0}.line-break{word-break:break-all}.margin-top-05{margin-top:.5rem}.margin-top-1{margin-top:1rem}.margin-top-2{margin-top:2rem}.not-allowed{cursor:not-allowed}.pointer-events-none{pointer-events:none}@keyframes spin-loading{0%{transform:rotate(0deg)}100%{transform:rotate(360deg)}}@keyframes text-animation-1{0%,100%{opacity:0;transform:translateY(100%)}10%,40%{opacity:1;transform:translateY(0)}50%,90%{opacity:0;transform:translateY(-100%)}}@keyframes text-animation-2{0%,50%{opacity:0;transform:translateY(100%)}60%,90%{opacity:1;transform:translateY(0)}100%{opacity:0;transform:translateY(-100%)}}
  `;

  const IS_ENV_DEV = false;
  const IS_DEBUG = false;
  const PREFIX = 'cja_x10e_';

  /** @type {Locale[]} */
  const AVAILABLE_LOCALES = ['pt-BR', 'en'];

  const GENERAL_CONFIG = {
    INSTAGRAM_URL: 'https://www.instagram.com',
    FOLLOWERS_ANCHOR_HREF: 'a[href$="/followers/"]',
    FOLLOWING_ANCHOR_HREF: 'a[href$="/following/"]',
    FOLLOWERS_MODAL_CLOSE_BUTTON_SELECTOR: 'button._abl-',
    FOLLOWERS_MODAL_CONTAINER_SELECTOR: 'div[role="dialog"]',
    // Scroll container DOM element
    FOLLOWERS_MODAL_LIST_CONTAINER_SELECTOR: 'div.x6nl9eh.x1a5l9x9',
    FOLLOWERS_MODAL_LIST_ITEM_SELECTOR: '.x6nl9eh > div > div > div',
    FOLLOWING_MODAL_CLOSE_BUTTON_SELECTOR: 'button._abl-',
    FOLLOWING_MODAL_CONTAINER_SELECTOR: 'div[role="dialog"]',
    // Scroll container DOM element
    FOLLOWING_MODAL_LIST_CONTAINER_SELECTOR: 'div.x6nl9eh.x1a5l9x9',
    FOLLOWING_MODAL_LIST_ITEM_SELECTOR: '.x6nl9eh > div > div > div',
    MODAL_USER_TEXT_NAME_SELECTOR: 'span.x1lliihq span',
    MODAL_USER_ANCHOR_SELECTOR: 'a[role="link"]',
    MODAL_USER_IMAGE_SELECTOR: 'img.xpdipgo',
  };

  const STORAGE_KEY = {
    ANALYSIS_DATA: `${PREFIX}analysis_data`,
  };

  const SMART_SCROLL_CONFIG = {
    STEP: 50,
    INTERVAL: 500,
    MAX_ATTEMPTS: 3,
    CHANGE_WAITING_TIME: 1000,
  };

  const ANALYSIS_TIMER = {
    START: null,
    END: null,
    DURATION: null,
  };

  const FLOW_TYPE = {
    NOT_FOLLOWERS: 'not-followers',
    NOT_FOLLOWING: 'not-following',
  };

  const STATUS_TYPE = {
    IDLE: 'idle',
    LOADING: 'loading',
    SUCCESS: 'success',
    ERROR: 'error',
  };

  const TOAST_TYPE = {
    SUCCESS: 'success',
    ERROR: 'error',
    INFO: 'info',
    WARNING: 'warning',
  };

  const MODAL_ACTION_TYPE = {
    OPEN: 'open',
    CLOSE: 'close',
  };

  const AVAILABLE_PERMISSION_TYPE = {
    ENABLED: 'enabled',
    DISABLED: 'disabled',
  };

  const REGEX = {
    TRIM_SLASHES: /^\/|\/$/g,
  };

  const ICONS = {
    SINGLE_USER: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="single-user-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 21V19C19 17.9391 18.5786 16.9217 17.8284 16.1716C17.0783 15.4214 16.0609 15 15 15H9C7.93913 15 6.92172 15.4214 6.17157 16.1716C5.42143 16.9217 5 17.9391 5 19V21" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    SPY: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="spy-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 12.4444C24 13.4249 23.231 14.2222 22.2857 14.2222H1.71429C0.769029 14.2222 0 13.4249 0 12.4444C0 11.464 0.769029 10.6667 1.71429 10.6667H22.2857C23.231 10.6667 24 11.464 24 12.4444ZM21.4286 19.5556C21.4286 22.0061 19.5061 24 17.1429 24C14.7796 24 12.8571 22.0061 12.8571 19.5556C12.8571 19.0048 12.9588 18.4795 13.1361 17.9924C12.448 17.7242 11.552 17.7242 10.8639 17.9924C11.0412 18.4795 11.1429 19.0048 11.1429 19.5556C11.1429 22.0061 9.22037 24 6.85714 24C4.49391 24 2.57143 22.0061 2.57143 19.5556C2.57143 17.105 4.49391 15.1111 6.85714 15.1111C8.38384 15.1111 9.72291 15.9459 10.4823 17.1957C11.4027 16.8112 12.5973 16.8112 13.5178 17.1957C14.2771 15.9459 15.6162 15.1111 17.1429 15.1111C19.5061 15.1111 21.4286 17.105 21.4286 19.5556ZM9.42857 19.5556C9.42857 18.0851 8.27511 16.8889 6.85714 16.8889C6.62049 16.8889 6.42857 17.0877 6.42857 17.3333C6.42857 17.579 6.62049 17.7778 6.85714 17.7778C7.8024 17.7778 8.57143 18.5751 8.57143 19.5556C8.57143 19.8012 8.76334 20 9 20C9.23666 20 9.42857 19.8012 9.42857 19.5556ZM19.7143 19.5556C19.7143 18.0851 18.5608 16.8889 17.1429 16.8889C16.9062 16.8889 16.7143 17.0877 16.7143 17.3333C16.7143 17.579 16.9062 17.7778 17.1429 17.7778C18.0881 17.7778 18.8571 18.5751 18.8571 19.5556C18.8571 19.8012 19.0491 20 19.2857 20C19.5224 20 19.7143 19.8012 19.7143 19.5556ZM19.3703 2.51822C19.0128 1.0356 17.7338 0 16.2602 0C15.3357 0 14.4563 0.413644 13.8476 1.13542L12.3227 2.94271C12.1574 3.13889 11.8426 3.13844 11.6773 2.94316L10.1522 1.13542C9.54347 0.413644 8.66413 0 7.73983 0C6.26619 0 4.98716 1.0356 4.62977 2.51822L3.30823 8H20.6917L19.3703 2.51822ZM20.9061 8.88889H3.09394L2.87966 9.77778H21.1203L20.9061 8.88889Z" fill="url(#paint0_linear_28_68)"/>
        <defs>
          <linearGradient id="paint0_linear_28_68" x1="24" y1="3.5" x2="9.5" y2="24" gradientUnits="userSpaceOnUse">
            <stop stop-color="#EC4899"/>
            <stop offset="1" stop-color="#3B82F6"/>
          </linearGradient>
        </defs>
      </svg>
    `,
    SPY_OUTLINE: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="outline-spy-icon" xmlns="http://www.w3.org/2000/svg">
        <path
          d="M22.2857 10.6447H21.3346L19.3703 2.51305C19.2283 1.92528 18.9335 1.38896 18.5179 0.962287C18.1023 0.535609 17.5817 0.23486 17.0126 0.0926665C16.4436 -0.0495268 15.8477 -0.0277348 15.2898 0.155678C14.7318 0.339091 14.233 0.677122 13.8476 1.1331L12.3227 2.93666C12.2816 2.98288 12.2318 3.01978 12.1763 3.04503C12.1207 3.07029 12.0607 3.08335 12.0001 3.08339C11.9394 3.08343 11.8794 3.07046 11.8239 3.04528C11.7683 3.0201 11.7184 2.98326 11.6773 2.93711L10.1522 1.1331C9.76673 0.677183 9.26797 0.339207 8.71005 0.155831C8.15212 -0.0275444 7.55633 -0.0493186 6.9873 0.0928706C6.41827 0.23506 5.89772 0.535784 5.48211 0.962423C5.06651 1.38906 4.77172 1.92533 4.62973 2.51305L2.66537 10.6447H1.71429C1.25963 10.6447 0.823593 10.8316 0.502103 11.1643C0.180612 11.497 0 11.9483 0 12.4188C0 12.8893 0.180612 13.3406 0.502103 13.6733C0.823593 14.006 1.25963 14.1929 1.71429 14.1929H22.2857C22.7404 14.1929 23.1764 14.006 23.4979 13.6733C23.8194 13.3406 24 12.8893 24 12.4188C24 11.9483 23.8194 11.497 23.4979 11.1643C23.1764 10.8316 22.7404 10.6447 22.2857 10.6447ZM5.46137 2.72772C5.56543 2.29718 5.7814 1.90435 6.08587 1.59182C6.39034 1.27929 6.77168 1.059 7.18853 0.954837C7.60538 0.850674 8.04184 0.866616 8.45056 1.00093C8.85928 1.13525 9.22467 1.38282 9.50709 1.71678L11.0324 3.52163C11.1531 3.66426 11.3019 3.77854 11.4688 3.85682C11.6357 3.9351 11.8169 3.97558 12.0001 3.97554C12.1833 3.97549 12.3644 3.93494 12.5313 3.85658C12.6982 3.77822 12.8469 3.66387 12.9676 3.52119L14.4925 1.71718C14.7749 1.3832 15.1403 1.1356 15.5491 1.00125C15.9578 0.866894 16.3943 0.85091 16.8111 0.955028C17.228 1.05915 17.6094 1.27939 17.9139 1.59188C18.2184 1.90438 18.4345 2.29719 18.5386 2.72772L19.8082 7.98353H4.19177L5.46137 2.72772ZM3.97749 8.87059H20.0225L20.4511 10.6447H3.54891L3.97749 8.87059ZM22.2857 13.3059H1.71429C1.48696 13.3059 1.26894 13.2124 1.10819 13.0461C0.947449 12.8797 0.857143 12.6541 0.857143 12.4188C0.857143 12.1836 0.947449 11.9579 1.10819 11.7916C1.26894 11.6252 1.48696 11.5318 1.71429 11.5318H22.2857C22.513 11.5318 22.7311 11.6252 22.8918 11.7916C23.0526 11.9579 23.1429 12.1836 23.1429 12.4188C23.1429 12.6541 23.0526 12.8797 22.8918 13.0461C22.7311 13.2124 22.513 13.3059 22.2857 13.3059ZM17.1429 15.08C16.4179 15.0808 15.705 15.2721 15.0709 15.6359C14.4369 15.9997 13.9025 16.5242 13.5177 17.1601C12.5399 16.7764 11.4601 16.7764 10.4823 17.1601C9.89366 16.1894 8.96702 15.49 7.89405 15.2067C6.82109 14.9233 5.68392 15.0776 4.71783 15.6377C3.75174 16.1978 3.03067 17.1208 2.70381 18.2157C2.37695 19.3107 2.46931 20.4937 2.96179 21.5202C3.45427 22.5466 4.30917 23.3378 5.34961 23.7301C6.39005 24.1225 7.53641 24.0859 8.5515 23.6279C9.56658 23.1699 10.3727 22.3256 10.8031 21.2697C11.2335 20.2138 11.2552 19.0271 10.8637 17.9551C11.599 17.6875 12.4006 17.6875 13.1359 17.9551C12.8152 18.8395 12.776 19.8067 13.0239 20.7158C13.2718 21.6249 13.7938 22.4282 14.5139 23.0087C15.2339 23.5891 16.1143 23.9163 17.0267 23.9425C17.9391 23.9688 18.8357 23.6926 19.5858 23.1544C20.3358 22.6162 20.9002 21.8441 21.1964 20.9507C21.4927 20.0572 21.5053 19.0892 21.2326 18.1878C20.9599 17.2864 20.416 16.4987 19.6803 15.9396C18.9446 15.3806 18.0556 15.0794 17.1429 15.08ZM6.85714 23.0635C6.17904 23.0635 5.51616 22.8554 4.95233 22.4655C4.3885 22.0756 3.94906 21.5215 3.68956 20.8731C3.43006 20.2248 3.36216 19.5113 3.49445 18.823C3.62674 18.1348 3.95328 17.5025 4.43278 17.0063C4.91227 16.5101 5.52318 16.1721 6.18826 16.0352C6.85334 15.8983 7.54271 15.9686 8.1692 16.2371C8.79569 16.5057 9.33116 16.9605 9.7079 17.544C10.0846 18.1275 10.2857 18.8135 10.2857 19.5153C10.2847 20.456 9.92311 21.3579 9.28036 22.023C8.6376 22.6882 7.76614 23.0624 6.85714 23.0635ZM17.1429 23.0635C16.4648 23.0635 15.8019 22.8554 15.238 22.4655C14.6742 22.0756 14.2348 21.5215 13.9753 20.8731C13.7158 20.2248 13.6479 19.5113 13.7802 18.823C13.9125 18.1348 14.239 17.5025 14.7185 17.0063C15.198 16.5101 15.8089 16.1721 16.474 16.0352C17.1391 15.8983 17.8284 15.9686 18.4549 16.2371C19.0814 16.5057 19.6169 16.9605 19.9936 17.544C20.3703 18.1275 20.5714 18.8135 20.5714 19.5153C20.5704 20.456 20.2088 21.3579 19.5661 22.023C18.9233 22.6882 18.0519 23.0624 17.1429 23.0635ZM9.42857 19.5153C9.42857 19.6329 9.38342 19.7457 9.30305 19.8289C9.22267 19.9121 9.11366 19.9588 9 19.9588C8.88634 19.9588 8.77733 19.9121 8.69695 19.8289C8.61658 19.7457 8.57143 19.6329 8.57143 19.5153C8.57095 19.0449 8.39019 18.5939 8.0688 18.2613C7.74741 17.9287 7.31165 17.7416 6.85714 17.7412C6.74348 17.7412 6.63447 17.6944 6.5541 17.6112C6.47372 17.5281 6.42857 17.4153 6.42857 17.2976C6.42857 17.18 6.47372 17.0672 6.5541 16.984C6.63447 16.9008 6.74348 16.8541 6.85714 16.8541C7.5389 16.8549 8.19252 17.1355 8.67459 17.6344C9.15666 18.1333 9.42782 18.8097 9.42857 19.5153ZM19.7143 19.5153C19.7143 19.6329 19.6691 19.7457 19.5888 19.8289C19.5084 19.9121 19.3994 19.9588 19.2857 19.9588C19.1721 19.9588 19.063 19.9121 18.9827 19.8289C18.9023 19.7457 18.8571 19.6329 18.8571 19.5153C18.8567 19.0449 18.6759 18.5939 18.3545 18.2613C18.0331 17.9287 17.5974 17.7416 17.1429 17.7412C17.0292 17.7412 16.9202 17.6944 16.8398 17.6112C16.7594 17.5281 16.7143 17.4153 16.7143 17.2976C16.7143 17.18 16.7594 17.0672 16.8398 16.984C16.9202 16.9008 17.0292 16.8541 17.1429 16.8541C17.8246 16.8549 18.4782 17.1355 18.9603 17.6344C19.4424 18.1333 19.7135 18.8097 19.7143 19.5153Z"
          fill="white"
        />
      </svg>
    `,
    SPINNER: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="spinner-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M21 12C20.9999 13.9006 20.3981 15.7524 19.2809 17.2899C18.1637 18.8275 16.5885 19.9719 14.7809 20.5592C12.9733 21.1464 11.0262 21.1464 9.21864 20.559C7.41109 19.9716 5.83588 18.8271 4.71876 17.2895C3.60165 15.7519 2.99999 13.9001 3 11.9995C3.00001 10.0989 3.60171 8.24711 4.71884 6.7095C5.83598 5.17189 7.4112 4.02741 9.21877 3.44008C11.0263 2.85274 12.9734 2.85272 14.781 3.44" stroke="#3B82F6" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    CLIPBOARD: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="clipboard-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    CLIPBOARD_SUCCESS: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="clipboard-success-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M9 14L11 16L15 12" stroke="#4CAF50" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    ERROR_ALERT: `
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" class="alert-icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M24 44C35.0457 44 44 35.0457 44 24C44 12.9543 35.0457 4 24 4C12.9543 4 4 12.9543 4 24C4 35.0457 12.9543 44 24 44Z" stroke="#EA384C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M24 16V24" stroke="#EA384C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M24 32H24.02" stroke="#EA384C" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    SUCCESS: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="success-icon icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2ZM10.7071 16.7071L5.70711 11.7071L7.12132 10.2929L10.7071 13.8787L16.8787 7.70711L18.2929 9.12132L10.7071 16.7071Z" fill="white"/>
      </svg>
    `,
    ERROR: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="error-icon icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 8V12" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
        <path d="M12 16H12.01" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
    `,
    INFO: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="info-icon icon" xmlns="http://www.w3.org/2000/svg">
        <path d="M11.9999 22.2456C17.5948 22.2456 22.2455 17.6049 22.2455 12C22.2455 6.40513 17.5848 1.75444 11.9899 1.75444C6.38494 1.75444 1.75439 6.40513 1.75439 12C1.75439 17.6049 6.39501 22.2456 11.9999 22.2456ZM11.9095 8.42413C11.1762 8.42413 10.6037 7.84148 10.6037 7.11831C10.6037 6.38503 11.1762 5.80243 11.9095 5.80243C12.6428 5.80243 13.2153 6.38503 13.2153 7.11831C13.2153 7.84148 12.6428 8.42413 11.9095 8.42413ZM10.2321 17.5245C9.83027 17.5245 9.50884 17.2332 9.50884 16.8214C9.50884 16.4297 9.83027 16.1183 10.2321 16.1183H11.4876V11.5078H10.4028C10.001 11.5078 9.67958 11.2165 9.67958 10.8047C9.67958 10.4129 10.001 10.1016 10.4028 10.1016H12.3012C12.8035 10.1016 13.0848 10.4632 13.0848 11.0056V16.1183H14.3303C14.7421 16.1183 15.0635 16.4297 15.0635 16.8214C15.0635 17.2332 14.7421 17.5245 14.3303 17.5245H10.2321Z" fill="white"/>
      </svg>
    `,
    WARNING: `
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" class="warning-icon icon" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" clip-rule="evenodd" d="M13.0459 2.26386C13.356 2.44103 13.6129 2.698 13.7901 3.00806L22.3438 17.9769C22.8918 18.936 22.5586 20.1577 21.5996 20.7057C21.2974 20.8784 20.9553 20.9692 20.6073 20.9692H3.5C2.39543 20.9692 1.5 20.0738 1.5 18.9692C1.5 18.6212 1.59083 18.2791 1.76351 17.9769L10.3172 3.00806C10.8652 2.04903 12.0869 1.71584 13.0459 2.26386ZM12 14.75C11.2857 14.75 10.75 15.278 10.75 15.982C10.75 16.718 11.2695 17.246 12 17.246C12.7143 17.246 13.25 16.718 13.25 15.998C13.25 15.278 12.7143 14.75 12 14.75ZM13 7H11V13H13V7Z" fill="white"/>
      </svg>
    `,
  };

  const DOM_ELEMENT_ID = {
    FLOATING_BUTTON: `${PREFIX}floating-button`,
    DRAWER_MAIN: `${PREFIX}drawer-main`,
    DRAWER_OVERLAY: `${PREFIX}drawer-overlay`,
    DRAWER_HEADER_CLOSE_BUTTON: `${PREFIX}drawer-header_close-button`,
    DRAWER_MAIN_CONTENT: `${PREFIX}main-content`,
    TOAST_CONTAINER: `${PREFIX}toast-container`,
    BUTTON_NOT_FOLLOWERS_TAB_TRIGGER: `${PREFIX}button-tab-trigger_not-followers`,
    BUTTON_NOT_FOLLOWING_TAB_TRIGGER: `${PREFIX}button-tab-trigger_not-following`,
    DRAWER_ACTION_BUTTON_CONTAINER: `${PREFIX}drawer-action-button-container`,
    DRAWER_ACTION_BUTTON: `${PREFIX}drawer-action-button`,
    NOT_FOLLOWER_LIST_CONTAINER: `${PREFIX}not-followers-list`,
    NOT_FOLLOWING_LIST_CONTAINER: `${PREFIX}not-following-list`,
    USER_CLIPBOARD_BUTTON: `${PREFIX}user-clipboard-button`,
    FOOTER_ANALYSIS_DATE_VALUE: `${PREFIX}footer-analysis-date-value`,
    FOOTER_ANALYSIS_TIME_VALUE: `${PREFIX}footer-analysis-time-value`,
  };

  const DICTIONARY = {
    'pt-BR': {
      title: 'Instagram Follow Spy',
      open: 'Abrir',
      close: 'Fechar',
      followers: 'Seguidores',
      following: 'Seguindo',
      notFollowers: 'Não me seguem',
      notFollowing: 'Não sigo',
      analyzeButtonLabel: 'Analisar',
      clipboardCopy: 'Copiar',
      clipboardCopied: 'Copiado',
      clipboardToastError1_1: 'Não foi possível copiar',
      clipboardToastError1_2: 'para o seu clipboard.',
      footerAnalysisDateLabel: 'Última análise',
      footerAnalysisTimeLabel: 'Tempo de análise',
      footerSocialLabel: 'Desenvolvido por',
      footerSocialLink: 'https://cjambrosi.dev.br',
      footerSocicalLinkLabel: 'cjambrosi',
      emptyTitle: 'Bem-vindo!',
      emptyDescription: 'Clique no botão abaixo para analisar sua lista de seguidores/seguindo.',
      loadingMessageOne: 'Analisando a lista de ',
      loadingMessageTwo: 'Não feche o modal!',
      errorTitle: 'Não foi possível carregar os dados',
      errorDescription: 'Ocorreu um erro ao analisar sua lista de seguidores/seguindo. <b>Confira se você está seguindo os passos abaixo:</b>',
      errorMessage1: 'Está na página correta do perfil.',
      errorMessage1_2: 'Ex.: https://www.instagram.com/USERNAME/',
      errorMessage2: 'As opções "seguidores" e "seguindo" estão visíveis;',
      errorMessage3: 'Os modais das opções "seguidores" e "seguindo" estão sendo abertos automaticamente ao executar a análise;',
      errorMessage4: 'Se o problema continuar persistindo, tente recarregar a página.',
      errorMessage5: '<i>** Importante</i>: Caso o Instagram detecte uma quantidade excessiva de chamadas (requests) ou identificar que se trata de uma automação, a chamada de novos itens nas listas <br /> pode ser bloqueada.',
      toastSuccessMessage: 'Análise concluída com sucesso!',
      toastAnalyseNotFound: 'Nenhum resultado encontrado!',
      toastErrorMessage1: 'Análise interrompida!',
      toastErrorMessage2: 'Modal de Seguidores não encontrado!',
      toastErrorMessage3: 'Modal de Seguindo não encontrado!',
      toastErrorMessage4: 'Lista de Seguidores não encontrada!',
      toastErrorMessage5: 'Lista de Seguindo não encontrada!',
      toastErrorMessage6: 'Feche o modal do Instagram para executar <br /> a análise.',
    },
    'en': {
      title: 'Instagram Follow Spy',
      open: 'Open',
      close: 'Close',
      followers: 'Followers',
      following: 'Following',
      notFollowers: 'Don\'t follow me',
      notFollowing: 'I don\'t follow',
      analyzeButtonLabel: 'Analyze',
      clipboardCopy: 'Copy',
      clipboardCopied: 'Copied',
      clipboardToastError1_1: 'Could not copy',
      clipboardToastError1_2: 'to your clipboard.',
      footerAnalysisDateLabel: 'Last analysis',
      footerAnalysisTimeLabel: 'Analysis time',
      footerSocialLabel: 'Developed by',
      footerSocialLink: 'https://cjambrosi.dev.br',
      footerSocicalLinkLabel: 'cjambrosi',
      emptyTitle: 'Welcome!',
      emptyDescription: 'Click the button below to analyze your followers/following list.',
      loadingMessageOne: 'Analyzing the list of ',
      loadingMessageTwo: 'Do not close the modal!',
      errorTitle: "Unable to load data",
      errorDescription: "An error occurred while analyzing your followers/following list. <b>Make sure you're following the steps below:</b>",
      errorMessage1: "You are on the correct profile page.",
      errorMessage1_2: "E.g.: https://www.instagram.com/USERNAME/",
      errorMessage2: "The 'followers' and 'following' options are visible;",
      errorMessage3: "The 'followers' and 'following' modals are being opened automatically when starting the analysis;",
      errorMessage4: "If the issue persists, try reloading the page.",
      errorMessage5: "<i>** Important</i>: If Instagram detects an excessive number of requests or identifies automation activity, loading new items in the lists <br /> may be blocked.",
      toastSuccessMessage: 'Analysis completed successfully!',
      toastAnalyseNotFound: 'No results found!',
      toastErrorMessage1: 'Analysis interrupted!',
      toastErrorMessage2: 'Followers modal not found!',
      toastErrorMessage3: 'Following modal not found!',
      toastErrorMessage4: 'Followers list not found!',
      toastErrorMessage5: 'Following list not found!',
      toastErrorMessage6: 'Close the Instagram modal to run <br /> the analysis.',
    },
  };

  let flow = FLOW_TYPE.NOT_FOLLOWERS;
  let status = STATUS_TYPE.IDLE;
  let isAnalysisCancelled = false;

  /** @type {Locale} */
  let locale = 'en';

  /** @type {User[]} */
  let followersList = [];

  /** @type {User[]} */
  let followingList = [];

  /** @type {User[]} */
  let notFollowersList = IS_ENV_DEV ? MOCK_USERS : [];

  /** @type {User[]} */
  let notFollowingList = IS_ENV_DEV ? MOCK_USERS : [];

  let lastAnalizysDate = null;

  const StyleModule = {
    css: MINIFY_CSS.trim(),
    /**
     * Appends a global style to the document head.
     * @param {boolean} isDev - Flag indicating if the environment is development.
     * @returns {void}
    */
    appendGlobalStyle(isDev) {
      if (!isDev) {
        GM_addStyle(this.css);
        return;
      }

      const style = document.createElement('style');
      style.textContent = this.css;
      document.head.appendChild(style);
    },
  };

  const HelpersModule = {
    /**
     * Converts an HTML string into a DocumentFragment.
     * @param {string} htmlString - The HTML string to convert.
     * @returns {DocumentFragment} The resulting DocumentFragment.
     * @example
     * const fragment = htmlStringToFragmentDOM('<div>Hello World</div>');
    */
    htmlStringToFragmentDOM(htmlString) {
      return document.createRange().createContextualFragment(htmlString);
    },
    /**
     * Watches for an element to appear in the DOM and executes a callback when it does.
     * @param {string} selector - The DOM element selector of the element to watch for.
     * @param {Function} onAdd - Function executed when the element appears in the DOM.
     * @param {Function} onRemove - Function executed when the element is removed from the DOM.
     * @returns {MutationObserver} - Returns the observer to external control if necessary.
    */
    observerElementInDOM(selector, onAdd, onRemove) {
      const targetNode = document.body;
      let wasLoadedElem = false;

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector);
        const hasElement = !!element;

        if (hasElement && !wasLoadedElem) {
          wasLoadedElem = true;
          onAdd?.(element);
        } else if (!hasElement && wasLoadedElem) {
          wasLoadedElem = false;
          observer.disconnect();
          onRemove?.(element);
        }
      });

      observer.observe(targetNode, {
        childList: true,
        subtree: true,
      });

      return observer;
    },
    /**
     * Get the user's preferred language from the navigator object.
     * If the language is not in the available locales, default to 'en'.
     * @returns {Locale} The user's preferred language or 'en' if not available.
    */
    getNavigatorLanguage() {
      const navigatorLanguage = navigator?.language || navigator?.userLanguage;
      return AVAILABLE_LOCALES.includes(navigatorLanguage) ? navigatorLanguage : 'en';
    },
    /**
     * Checks if the user is on the correct page to analyze followers or following.
     * It verifies the presence of the followers and following anchors in the DOM.
     * @returns {boolean} Returns true if the user is on the correct page, false otherwise.
    */
    isEnableToAnalyze() {
      const hasFollowersAnchor = this.hasFollowersAnchorInDOM();
      const hasFollowingAnchor = this.hasFollowingAnchorInDOM();

      if (!hasFollowersAnchor && !hasFollowingAnchor) {
        status = STATUS_TYPE.ERROR;
        return false;
      };

      return true;
    },
    /**
     * Checks if the followers anchor element exists in the DOM.
     * @returns {boolean} Returns true if the followers anchor element is present, otherwise false.
    */
    hasFollowersAnchorInDOM() {
      return !!document.querySelector(GENERAL_CONFIG.FOLLOWERS_ANCHOR_HREF);
    },
    /**
     * Checks if the followings anchor element exists in the DOM.
     * @returns {boolean} Returns true if the followings anchor element is present, otherwise false.
    */
    hasFollowingAnchorInDOM() {
      return !!document.querySelector(GENERAL_CONFIG.FOLLOWING_ANCHOR_HREF);
    },
    /**
     * Checks if either the followers or following modal is currently open on the page.
     * @returns {boolean} Returns true if either the followers or following modal container exists in the DOM, otherwise false.
    */
    isModalAlreadyOpen() {
      const followersModalContainer = !!document.querySelector(GENERAL_CONFIG.FOLLOWERS_MODAL_CONTAINER_SELECTOR);
      const followingModalContainer = !!document.querySelector(GENERAL_CONFIG.FOLLOWING_MODAL_CONTAINER_SELECTOR);

      return !!(followersModalContainer || followingModalContainer);
    },
    /**
     * Asynchronously sets a value in the "userscript manager" storage after serializing it to JSON.
     * @async
     * @param {string} key - The key under which the value will be stored.
     * @param {*} value - The value to be stored; it will be serialized to a JSON string.
     * @returns {Promise<void>} A promise that resolves when the value has been stored.
    */
    async setStorageValue(key, value) {
      await GM_setValue(key, JSON.stringify(value));
    },
    /**
     * Asynchronously retrieves a value from the "userscript manager" storage by the given key and parses it as JSON.
     * @async
     * @param {string} key - The key associated with the value to retrieve from storage.
     * @returns {Promise<any>} A promise that resolves to the parsed value from storage.
    */
    async getStorageValue(key) {
      return JSON.parse(await GM_getValue(key));
    },
    /**
     * Smoothly scrolls a modal element to the bottom, detecting dynamically loaded content and continuing to scroll
     * until no more new content is detected or a maximum number of attempts is reached.
     * @param {HTMLElement} selector - The modal DOM element to scroll. Its className is used to select the modal.
     * @returns {Promise<void>} Resolves when scrolling is complete and no new content is detected, or rejects if the modal is not found or the analysis is cancelled.
     * @throws {Error} If the modal element cannot be found or if the analysis is cancelled during scrolling.
    */
    smartScrollModal(selector) {
      return new Promise((resolve, reject) => {
        const modalSelector = `.${selector.className.replaceAll(' ', '.').trim()}`;
        const modalElement = document.querySelector(modalSelector);

        if (!modalElement) {
          const errorMessage = flow === FLOW_TYPE.NOT_FOLLOWERS
            ? DICTIONARY[locale]['toastErrorMessage2']
            : DICTIONARY[locale]['toastErrorMessage3'];

          reject(new Error(errorMessage));
          return;
        };

        let attempts = 0;

        const startScroll = () => {
          const intervalId = setInterval(() => {
            const { scrollTop, scrollHeight, clientHeight } = modalElement;

            if (isAnalysisCancelled) {
              clearInterval(intervalId);
              isAnalysisCancelled = false;

              reject(new Error(DICTIONARY[locale]['toastErrorMessage1']));
              return;
            };

            if (scrollTop + clientHeight >= scrollHeight) {
              clearInterval(intervalId);
              handleScrollEnd();
              return;
            };

            modalElement.scrollTop += SMART_SCROLL_CONFIG.STEP;
          }, SMART_SCROLL_CONFIG.INTERVAL);
        };

        const handleScrollEnd = () => {
          let hasChangeDetected = false;

          const observer = new MutationObserver((mutationsList) => {
            if (mutationsList.length > 0) {
              hasChangeDetected = true;
            }
          });

          observer.observe(modalElement, {
            childList: true,
            subtree: true,
          });

          setTimeout(() => {
            observer.disconnect();

            if (hasChangeDetected) {
              attempts = 0;
              startScroll();
              log('🔄 Detecting new content. Resetting scroll.');
            } else {
              attempts++;
              log(`⚠️ No changes detected. Attempt ${attempts} of ${SMART_SCROLL_CONFIG.MAX_ATTEMPTS}.`);

              if (attempts < SMART_SCROLL_CONFIG.MAX_ATTEMPTS) {
                startScroll();
              } else {
                log('✅ Scrolling finished after attempts. No changes in Modal.');
                resolve();
              }
            }
          }, SMART_SCROLL_CONFIG.CHANGE_WAITING_TIME);
        };

        startScroll();
      });
    },
    /**
     * Extracts and normalizes a list of user objects from a modal dialog in the DOM.
     * @async
     * @param {string} selector - The DOM element selector used to find user list elements in the modal.
     * @returns {Promise<Array<User>>} A promise that resolves to an array of user objects, each containing `name`, `username`, and `imageURL` properties.
    */
    async normalizeUserListFromModal(selector) {
      try {
        const nodeListUsers = document.querySelectorAll(selector);
        const userList = [];

        Array.from(nodeListUsers, li => {
          const linkElem = li.querySelector(GENERAL_CONFIG.MODAL_USER_ANCHOR_SELECTOR);
          const spanElem = li.querySelector(GENERAL_CONFIG.MODAL_USER_TEXT_NAME_SELECTOR);
          const imgElem = li.querySelector(GENERAL_CONFIG.MODAL_USER_IMAGE_SELECTOR);

          const username = linkElem ? linkElem.getAttribute('href')?.replace(REGEX.TRIM_SLASHES, "") : '';
          const name = spanElem ? spanElem.textContent.trim() : '';
          const imageURL = imgElem?.src ? imgElem.src : '';

          userList.push({
            name,
            username,
            imageURL,
          })
        });

        return userList;
      } catch (error) {
        log("error", `Error >> normalizeUserListFromModal`, { error });
        return [];
      }
    },
    /**
     * Compares the followers and following lists to determine users who do not follow back and users you do not follow back.
     * @async
     * @returns {Promise<boolean>} Returns true if the comparison was successful, false if either list is empty.
    */
    async compareFollowersAndFollowingList() {
      if (followersList.length === 0) {
        log("warn", `compareFollowersAndFollowingList >> No followers found!`, { followersList });
        return false;
      };

      if (followingList.length === 0) {
        log("warn", `compareFollowersAndFollowingList >> No following found!`, { followingList });
        return false;
      };

      const setFollowers = new Set(followersList.map(user => user.username));
      const setFollowing = new Set(followingList.map(user => user.username));

      notFollowersList = followingList.filter(user => !setFollowers.has(user.username));
      notFollowingList = followersList.filter(user => !setFollowing.has(user.username));
      lastAnalizysDate = new Date().toISOString();

      log("info", "Analysis data:", {
        followersList,
        followingList,
        notFollowersList,
        notFollowingList,
        totalFollowers: followersList.length,
        totalFollowings: followingList.length,
      });

      return true;
    },
    /**
     * Copies the provided text to the clipboard, using the modern Clipboard API if available,
     * and falling back to a legacy method if necessary. Checks for clipboard-write permissions
     * before attempting to write to the clipboard.
     * @async
     * @param {string} text - The text to be copied to the clipboard.
     * @returns {Promise<boolean>} Resolves to true if the text was successfully copied, false otherwise.
     * @throws {Error} If the "text" parameter is undefined.
    */
    async copyToClipboard(text) {
      if (typeof text === 'undefined') {
        throw new Error(`copyToClipboard: "text" params is not defined!`);
      }

      if (!navigator.permissions) {
        return this.legacyCopyToClipboard(text);
      }

      try {
        const result = await navigator.permissions.query({ name: "clipboard-write" });
        const hasClipboardPermission = result.state === 'granted' || result.state === 'prompt';

        if (hasClipboardPermission) {
          await navigator.clipboard.writeText(text);
          return true;
        }

        log("error", `Error >> copyToClipboard >> Clipboard access permission denied.`, { error });
        return false;
      } catch (error) {
        log("error", `Error >> copyToClipboard >> Error copying or checking permissions.`, { error });
        return this.legacyCopyToClipboard(text);
      }
    },
    /**
     * Copies the provided text to the clipboard using a legacy method (document.execCommand).
     * @param {string} text - The text to be copied to the clipboard.
     * @returns {boolean} Returns true if the text was successfully copied, false otherwise.
    */
    legacyCopyToClipboard(text) {
      let isCopied = false;

      try {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.top = "-9999px";
        textarea.setAttribute("readonly", "");
        document.body.appendChild(textarea);
        textarea.select();

        const isSuccessful = document.execCommand("copy");

        if (isSuccessful) {
          isCopied = true;
          log("info", `legacyCopyToClipboard >> Text copied successfully.`, { error });
        } else {
          isCopied = false;
          log("error", `Error >> legacyCopyToClipboard >> Failed to copy.`, { error });
        }
      } catch (error) {
        isCopied = false;
        log("error", `Error >> legacyCopyToClipboard`, { error });
      }

      document.body.removeChild(textarea);
      return isCopied;
    },
    /**
     * Checks if the provided value is a valid number (not NaN).
     * @param {*} value - The value to check.
     * @returns {boolean} Returns true if the value is a number and not NaN, otherwise false.
    */
    isNumber(value) {
      return typeof value === 'number' && !isNaN(value);
    },
    /**
     * Formats a given date according to the specified locale.
     * @param {Date|string|number} date - The date to format. Can be a Date object, a date string, or a timestamp.
     * @returns {string} The formatted date string.
    */
    formatDate(date) {
      const currentDate = new Date(date);
      return new Intl.DateTimeFormat(locale).format(currentDate);
    },
    /**
     * Formats a duration given in milliseconds into a string in the format "HH:MM:SS".
     * @param {number} duration - The duration in milliseconds to format.
     * @returns {string} The formatted duration as "HH:MM:SS", or an empty string if the input is not a number.
    */
    formatAnalysisDuration(duration) {
      if (!this.isNumber(duration)) {
        log("error", "formatAnalysisDuration >> Error:", { duration });
        return '';
      };

      const totalSeconds = Math.floor(duration / 1000);
      const hours = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
      const seconds = String(totalSeconds % 60).padStart(2, '0');

      return `${hours}:${minutes}:${seconds}`;
    },
    /**
     * Updates the analysis data in storage unless running in development environment.
     *
     * @returns {void}
    */
    updateDataAnalysisOnStorage() {
      if (IS_ENV_DEV) return;

      this.setStorageValue(STORAGE_KEY.ANALYSIS_DATA, {
        analysisDuration: ANALYSIS_TIMER.DURATION,
        lastAnalizysDate,
        notFollowersList,
        notFollowingList,
      });
    },
    /**
     * Retrieves the last analysis data from storage and updates relevant variables.
     * Skips execution in development environment.
     * @async
     * @returns {Promise<void>} Resolves when the data retrieval and assignment is complete.
    */
    async retrieveDataFromLastAnalysis() {
      if (IS_ENV_DEV) return;

      try {
        const value = await this.getStorageValue(STORAGE_KEY.ANALYSIS_DATA);

        if (!value) {
          log("info", `retrieveDataFromLastAnalysis >> "${STORAGE_KEY.ANALYSIS_DATA}" value not found!`, { value });
          return;
        };

        notFollowersList = value?.notFollowersList;
        notFollowingList = value?.notFollowingList;
        lastAnalizysDate = value?.lastAnalizysDate;
        ANALYSIS_TIMER.DURATION = value?.analysisDuration;
      } catch (error) {
        log("error", `retrieveDataFromLastAnalysis >> Error:`, error);
      }
    },
    reset() {
      if (status !== STATUS_TYPE.LOADING) {
        status = STATUS_TYPE.IDLE;
        flow = FLOW_TYPE.NOT_FOLLOWERS;
      };

      UIModule.loadSelectTabs();
    },
  };

  const AnalysisModule = {
    /**
     * Initiates the analysis process for the followers modal.
     * @param {string} selector - The DOM element selector for the followers modal to analyze.
     * @returns {void}
    */
    startAnalysisFollowersModal(selector) {
      const timeout = 2000;

      setTimeout(async () => {
        const hasModalListSelector = !!document.querySelectorAll(GENERAL_CONFIG.FOLLOWERS_MODAL_LIST_ITEM_SELECTOR);

        if (!hasModalListSelector) {
          status = STATUS_TYPE.IDLE;
          UIModule.loadContentByContext();
          UIModule.toastContent(TOAST_TYPE.ERROR, DICTIONARY[locale]['toastErrorMessage4']);
          log("error", `Error >> startAnalysisFollowersModal >> "${GENERAL_CONFIG.FOLLOWERS_MODAL_LIST_ITEM_SELECTOR}" selector not found!`);
          return;
        };

        try {
          await HelpersModule.smartScrollModal(selector);
          followersList = await HelpersModule.normalizeUserListFromModal(GENERAL_CONFIG.FOLLOWERS_MODAL_LIST_ITEM_SELECTOR);

          AnalysisModule.toggleVisibleFollowersModal(MODAL_ACTION_TYPE.CLOSE);
          flow = FLOW_TYPE.NOT_FOLLOWING;

          setTimeout(() => {
            AnalysisModule.toggleVisibleFollowingModal(MODAL_ACTION_TYPE.OPEN);
          }, 500);
        } catch (error) {
          status = STATUS_TYPE.IDLE;
          UIModule.loadContentByContext();
          UIModule.toastContent(TOAST_TYPE.ERROR, error);
          log("error", `Error >> startAnalysisFollowersModal`, { error });
        }
      }, timeout);
    },
    /**
    * Initiates the analysis process for the followings modal.
    * @param {string} selector - The DOM element selector for the followings modal to analyze.
    * @returns {void}
   */
    startAnalysisFollowingModal(selector) {
      const timeout = 2000;

      setTimeout(async () => {
        const hasModalListSelector = !!document.querySelectorAll(GENERAL_CONFIG.FOLLOWING_MODAL_LIST_ITEM_SELECTOR);

        if (!hasModalListSelector) {
          flow = FLOW_TYPE.NOT_FOLLOWERS;
          status = STATUS_TYPE.IDLE;
          UIModule.loadContentByContext();
          UIModule.toastContent(TOAST_TYPE.ERROR, DICTIONARY[locale]['toastErrorMessage5']);
          log("error", `Error >> startAnalysisFollowingModal >> "${GENERAL_CONFIG.FOLLOWING_MODAL_LIST_ITEM_SELECTOR}" selector not found!`);
          return;
        };

        try {
          await HelpersModule.smartScrollModal(selector);
          followingList = await HelpersModule.normalizeUserListFromModal(GENERAL_CONFIG.FOLLOWING_MODAL_LIST_ITEM_SELECTOR);
          const isSuccessfulCompare = await HelpersModule.compareFollowersAndFollowingList();

          ANALYSIS_TIMER.END = performance.now();
          ANALYSIS_TIMER.DURATION = ANALYSIS_TIMER.END - ANALYSIS_TIMER.START;

          if (isSuccessfulCompare) {
            UIModule.updateDrawerTabsCounters();
            UIModule.updateFooterCounters();
            HelpersModule.updateDataAnalysisOnStorage();
          };

          flow = FLOW_TYPE.NOT_FOLLOWERS;
          status = STATUS_TYPE.SUCCESS;

          AnalysisModule.toggleVisibleFollowingModal(MODAL_ACTION_TYPE.CLOSE);
          UIModule.loadContentByContext();
          UIModule.toastContent(TOAST_TYPE.SUCCESS, DICTIONARY[locale]['toastSuccessMessage']);
        } catch (error) {
          status = STATUS_TYPE.IDLE;
          UIModule.toastContent(TOAST_TYPE.ERROR, error);
          log("error", `Error >> startAnalysisFollowingModal`, { error });
        }

        UIModule.loadContentByContext();
      }, timeout);
    },
    /**
     * Toggles the visibility of the "Followers" modal on Instagram.
     * @param {MODAL_ACTION_TYPE} action - The action to perform (open or close the followers modal).
    */
    toggleVisibleFollowersModal(action) {
      try {
        if (action === MODAL_ACTION_TYPE.CLOSE) {
          const closeButtonElem = document.querySelector(GENERAL_CONFIG.FOLLOWERS_MODAL_CLOSE_BUTTON_SELECTOR);
          if (!closeButtonElem) return;

          closeButtonElem.click();
          return;
        }

        const anchorElem = document.querySelector(GENERAL_CONFIG.FOLLOWERS_ANCHOR_HREF);
        if (!anchorElem) return;

        ANALYSIS_TIMER.START = performance.now();

        HelpersModule.observerElementInDOM(
          GENERAL_CONFIG.FOLLOWERS_MODAL_LIST_CONTAINER_SELECTOR,
          AnalysisModule.startAnalysisFollowersModal,
          () => {
            isAnalysisCancelled = flow === FLOW_TYPE.NOT_FOLLOWERS;
          }
        );

        anchorElem.click();
      } catch (error) {
        log("error", `Error >> toggleVisibleFollowersModal`, { error });
        status = STATUS_TYPE.ERROR;
        UIModule.loadContentByContext();
      }
    },
    /**
     * Toggles the visibility of the "Following" modal on Instagram.
     * @param {MODAL_ACTION_TYPE} action - The action to perform (e.g., OPEN or CLOSE).
    */
    toggleVisibleFollowingModal(action) {
      if (action === MODAL_ACTION_TYPE.CLOSE) {
        const closeButtonElem = document.querySelector(
          GENERAL_CONFIG.FOLLOWING_MODAL_CLOSE_BUTTON_SELECTOR
        );
        if (!closeButtonElem) return;

        closeButtonElem.click();
        return;
      }

      const anchorElem = document.querySelector(GENERAL_CONFIG.FOLLOWING_ANCHOR_HREF);
      if (!anchorElem) return;

      UIModule.loadContentByContext();

      HelpersModule.observerElementInDOM(
        GENERAL_CONFIG.FOLLOWING_MODAL_LIST_CONTAINER_SELECTOR,
        AnalysisModule.startAnalysisFollowingModal,
        () => {
          isAnalysisCancelled = flow === FLOW_TYPE.NOT_FOLLOWING;
        }
      );

      anchorElem.click();
    },
  };

  const HandlersModule = {
    /**
     * Opens the drawer by adding the 'open' class to the drawer and its overlay elements.
     * @returns {void}
    */
    onOpenDrawer() {
      const drawerElem = document.getElementById(DOM_ELEMENT_ID.DRAWER_MAIN);
      if (!drawerElem) return;

      const drawerOverlayElem = document.getElementById(DOM_ELEMENT_ID.DRAWER_OVERLAY);

      drawerOverlayElem.classList.add('open');
      drawerElem.classList.add('open');
    },
    /**
     * Closes the main drawer by removing the 'open' class from the drawer and its overlay elements.
     * @returns {void}
    */
    onCloseDrawer() {
      const drawerElem = document.getElementById(DOM_ELEMENT_ID.DRAWER_MAIN);
      if (!drawerElem) return;

      const drawerOverlayElem = document.getElementById(DOM_ELEMENT_ID.DRAWER_OVERLAY);

      drawerElem.classList.remove('open');
      drawerOverlayElem.classList.remove('open');
      HelpersModule.reset();
    },
    /**
     * Handles the user list selection event in the UI.
     * Updates the visibility of the user lists based on the current flow type.
     * @returns {void}
    */
    onSelectUserList() {
      const notFollowersListElement = document.getElementById(
        DOM_ELEMENT_ID.NOT_FOLLOWER_LIST_CONTAINER
      );
      const notFollowingListElement = document.getElementById(
        DOM_ELEMENT_ID.NOT_FOLLOWING_LIST_CONTAINER
      );

      if (!notFollowersListElement || !notFollowingListElement) {
        return;
      };

      if (flow === FLOW_TYPE.NOT_FOLLOWERS) {
        notFollowersListElement.classList.remove('hide');
        notFollowingListElement.classList.add('hide');
      } else {
        notFollowingListElement.classList.remove('hide');
        notFollowersListElement.classList.add('hide');
      };
    },
    /**
     * Handles the tab selection event in the UI.
     * Updates the active tab styling and sets the current flow type based on the selected tab.
     * @param {{ target: { dataset: { value: FLOW_TYPE } } }} event - The event object triggered by selecting a tab.
     * @returns {void}
    */
    onSelectTab(event) {
      const mainContent = document.getElementById(
        DOM_ELEMENT_ID.DRAWER_MAIN_CONTENT
      );
      if (!mainContent) return;

      const target = event.target;
      const flowValueFromTarget = target.dataset.value;

      if (!flowValueFromTarget) return;

      const tabNotFollowersButton = document.getElementById(
        DOM_ELEMENT_ID.BUTTON_NOT_FOLLOWERS_TAB_TRIGGER
      );
      const tabNotFollowingButton = document.getElementById(
        DOM_ELEMENT_ID.BUTTON_NOT_FOLLOWING_TAB_TRIGGER
      );

      if (flowValueFromTarget === FLOW_TYPE.NOT_FOLLOWERS) {
        flow = FLOW_TYPE.NOT_FOLLOWERS;
        tabNotFollowingButton.classList.remove('active');
        tabNotFollowersButton.classList.add('active');
      } else {
        flow = FLOW_TYPE.NOT_FOLLOWING;
        tabNotFollowersButton.classList.remove('active');
        tabNotFollowingButton.classList.add('active');
      }

      HandlersModule.onSelectUserList();
    },
    /**
     * Handles the analysis process when triggered.
     * @returns {void}
    */
    onAnalyze() {
      if (!HelpersModule.isEnableToAnalyze()) {
        UIModule.loadContentByContext();
        return;
      };

      if (HelpersModule.isModalAlreadyOpen()) {
        UIModule.toastContent(TOAST_TYPE.WARNING, DICTIONARY[locale]['toastErrorMessage6']);
        return;
      }

      flow = FLOW_TYPE.NOT_FOLLOWERS;
      status = STATUS_TYPE.LOADING;

      AnalysisModule.toggleVisibleFollowersModal(MODAL_ACTION_TYPE.OPEN);
      UIModule.loadSelectTabs();
      UIModule.loadContentByContext();
    },
  };

  const UIModule = {
    /**
     * Creates a floating button element and appends it to the document body.
     * When clicked, it shows Drawer element
     * @returns {void}
    */
    createFloatingButton() {
      if (document.getElementById(DOM_ELEMENT_ID.FLOATING_BUTTON)) {
        return;
      }

      const btnImgElem = HelpersModule.htmlStringToFragmentDOM(ICONS.SPY_OUTLINE);
      const btnElem = document.createElement('button');
      btnElem.type = 'button';
      btnElem.id = DOM_ELEMENT_ID.FLOATING_BUTTON;
      btnElem.className = 'floating-button';
      btnElem.title = DICTIONARY[locale]['open'];
      btnElem.ariaLabel = DICTIONARY[locale]['open'];

      btnElem.appendChild(btnImgElem);
      btnElem.addEventListener('click', HandlersModule.onOpenDrawer);

      document.body.appendChild(btnElem);
    },
    /**
     * Creates and displays the main drawer UI component on the page.
     *
     * This method constructs the drawer element, including its header, tabs, content area,
     * footer and overlay.
     * @returns {void}
    */
    createDrawer() {
      if (document.getElementById(DOM_ELEMENT_ID.DRAWER_MAIN)) {
        return;
      }

      const drawerElem = document.createElement('div');
      drawerElem.id = DOM_ELEMENT_ID.DRAWER_MAIN;
      drawerElem.className = 'drawer-main';

      const drawerOverlayElem = document.createElement('div');
      drawerOverlayElem.id = DOM_ELEMENT_ID.DRAWER_OVERLAY;
      drawerOverlayElem.className = 'drawer-overlay';

      const formattedlastAnalizysDate = lastAnalizysDate ? HelpersModule.formatDate(lastAnalizysDate) : '--';
      const formattedAnalizysDuration = ANALYSIS_TIMER.DURATION ? HelpersModule.formatAnalysisDuration(ANALYSIS_TIMER.DURATION) : '--';

      const fragment = HelpersModule.htmlStringToFragmentDOM(`
        <div class="drawer-wrapper">
          <div class="drawer-header">
            <div class="drawer-header_title-container">
              ${ICONS.SPY}
              <h2 class="drawer-header_title">${DICTIONARY[locale]['title']}</h2>
            </div>
            <button type="button" id="${DOM_ELEMENT_ID.DRAWER_HEADER_CLOSE_BUTTON}" class="drawer-header_close-button" aria-label="${DICTIONARY[locale]['close']}" title="${DICTIONARY[locale]['close']}">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        <div class="tabs-container">
          <div class="tabs-container_list">
            <button type="button" id="${DOM_ELEMENT_ID.BUTTON_NOT_FOLLOWERS_TAB_TRIGGER}" class="button-tab-trigger active" data-value="${FLOW_TYPE.NOT_FOLLOWERS}">
              ${DICTIONARY[locale]['notFollowers']} <span class="button-tab-trigger_counter-badge">(${notFollowersList.length})</span>
            </button>
            <button type="button" id="${DOM_ELEMENT_ID.BUTTON_NOT_FOLLOWING_TAB_TRIGGER}" class="button-tab-trigger" data-value="${FLOW_TYPE.NOT_FOLLOWING}">
              ${DICTIONARY[locale]['notFollowing']} <span class="button-tab-trigger_counter-badge">(${notFollowingList.length})</span>
            </button>
          </div>
        </div>
        <div id="${DOM_ELEMENT_ID.TOAST_CONTAINER}" class="toast-container"></div>
        <div id="${DOM_ELEMENT_ID.DRAWER_MAIN_CONTENT}" class="main-content"></div>
        <div class="drawer-footer">
          <div id="${DOM_ELEMENT_ID.DRAWER_ACTION_BUTTON_CONTAINER}" class="drawer-footer_action-button-container">
            <button type="button" id="${DOM_ELEMENT_ID.DRAWER_ACTION_BUTTON}" class="drawer-footer_action-button">${DICTIONARY[locale]['analyzeButtonLabel']}</button>
          </div>
          <div class="drawer-footer_info-container">
            <div class="drawer-footer_info-container_flex-item">
              <p class="drawer-footer_text-info">${DICTIONARY[locale]['footerAnalysisDateLabel']}:</p>
              <p id="${DOM_ELEMENT_ID.FOOTER_ANALYSIS_DATE_VALUE}" class="drawer-footer_text-info">${formattedlastAnalizysDate}</p>
            </div>
            <div class="drawer-footer_info-container_flex-item">
              <p class="drawer-footer_text-info">${DICTIONARY[locale]['footerAnalysisTimeLabel']}:</p>
              <p id="${DOM_ELEMENT_ID.FOOTER_ANALYSIS_TIME_VALUE}" class="drawer-footer_text-info">${formattedAnalizysDuration}</p>
            </div>
          </div>
          <div class="drawer-footer_social-container">
            <span class="drawer-footer_text-info">${DICTIONARY[locale]['footerSocialLabel']}</span>
            <a
              href="${DICTIONARY[locale]['footerSocialLink']}"
              target="_blank" title="${DICTIONARY[locale]['footerSocicalLinkLabel']}"
              class="drawer-footer_link">${DICTIONARY[locale]['footerSocicalLinkLabel']}
            </a>
          </div>
        </div>
      `);

      document.body.appendChild(drawerOverlayElem);
      drawerElem.appendChild(fragment);
      document.body.appendChild(drawerElem);

      const closeButton = document.getElementById(DOM_ELEMENT_ID.DRAWER_HEADER_CLOSE_BUTTON);
      closeButton.addEventListener('click', HandlersModule.onCloseDrawer);

      const tabFollowersButton = document.getElementById(DOM_ELEMENT_ID.BUTTON_NOT_FOLLOWERS_TAB_TRIGGER);
      tabFollowersButton.addEventListener('click', HandlersModule.onSelectTab);
      const tabFollowingButton = document.getElementById(DOM_ELEMENT_ID.BUTTON_NOT_FOLLOWING_TAB_TRIGGER);
      tabFollowingButton.addEventListener('click', HandlersModule.onSelectTab);

      const analyzeButton = document.getElementById(DOM_ELEMENT_ID.DRAWER_ACTION_BUTTON);
      analyzeButton.addEventListener('click', HandlersModule.onAnalyze);
    },
    /**
     * Updates the counter badges displayed on the "Not Followers" and "Not Following" drawer tab triggers.
     * @returns {void}
    */
    updateDrawerTabsCounters() {
      const notFollowersCounterElem = document.querySelector(
        `#${DOM_ELEMENT_ID.BUTTON_NOT_FOLLOWERS_TAB_TRIGGER} .button-tab-trigger_counter-badge`
      );

      const notFollowingCounterElem = document.querySelector(
        `#${DOM_ELEMENT_ID.BUTTON_NOT_FOLLOWING_TAB_TRIGGER} .button-tab-trigger_counter-badge`
      );

      if (notFollowersCounterElem) {
        notFollowersCounterElem.textContent = `(${notFollowersList.length})`;
      };

      if (notFollowingCounterElem) {
        notFollowingCounterElem.textContent = `(${notFollowingList.length})`;
      };
    },
    /**
     * Updates the footer section of the UI with analysis info.
     * @returns {void}
     */
    updateFooterCounters() {
      const lastAnalysisDateElem = document.querySelector(
        `#${DOM_ELEMENT_ID.FOOTER_ANALYSIS_DATE_VALUE}`
      );

      const analysisTimeElem = document.querySelector(
        `#${DOM_ELEMENT_ID.FOOTER_ANALYSIS_TIME_VALUE}`
      );

      if (lastAnalysisDateElem) {
        const formattedlastAnalizysDate = lastAnalizysDate ? HelpersModule.formatDate(lastAnalizysDate) : '--';
        lastAnalysisDateElem.textContent = `${formattedlastAnalizysDate}`;
      };

      if (analysisTimeElem) {
        const formattedAnalizysDuration = ANALYSIS_TIMER.DURATION ? HelpersModule.formatAnalysisDuration(ANALYSIS_TIMER.DURATION) : '--';
        analysisTimeElem.textContent = `${formattedAnalizysDuration}`;
      };
    },
    /**
     *
     * @param {string} elementId - DOM Element ID of the content list.
     * @param {Array<User>} userList - Array of user objects to display.
     * @returns {HTMLUListElement | null} Returns the generated <ul> element or `null` if the list is empty.
    */
    buildUserList(elementId, userList) {
      const isHideList = elementId === DOM_ELEMENT_ID.NOT_FOLLOWING_LIST_CONTAINER;

      const ul = document.createElement('ul');
      ul.id = elementId;
      ul.className = `user-list ${isHideList ? 'hide' : ''}`.trim();

      if (!userList || userList?.length === 0) {
        return null;
      };

      userList.forEach((user) => {
        const li = document.createElement('li');
        li.className = 'user-item';
        li.dataset.username = user.username;

        const hasImageProfile = !IS_ENV_DEV && !!user?.imageURL;
        const imageElement = hasImageProfile
          ? `
            <img
              src="${user.imageURL}"
              alt="${user.username}"
              width="42"
              height="42"
            />
          `
          : ICONS.SINGLE_USER;

        li.innerHTML = `
          <a href="${GENERAL_CONFIG.INSTAGRAM_URL}/${user.username}" title="${user.username}" target="_blank" class="user-item_info">
            <div class="user-item_avatar-container">
              ${imageElement}
            </div>
            <div class="user-item_wrapper">
              <span class="user-item_name line-break">${user.username}</span>
              <span class="user-item_username line-break">${user.name}</span>
            </div>
          </a>
          <button
            id="${DOM_ELEMENT_ID.USER_CLIPBOARD_BUTTON}"
            type="button"
            aria-label="${DICTIONARY[locale]['clipboardCopy']} ${user.username}"
            title="${DICTIONARY[locale]['clipboardCopy']} ${user.username}"
            class="user-item_copy-clipboard-button"
          >
            ${ICONS.CLIPBOARD}
            ${ICONS.CLIPBOARD_SUCCESS}
          </button>
        `;

        ul.appendChild(li);
      });

      ul.addEventListener('click', async (event) => {
        const button = event.target.closest('.user-item_copy-clipboard-button');
        if (!button) return;

        const li = button.closest('.user-item');
        const username = li?.dataset.username;
        if (!username) return;

        const isCopied = await HelpersModule.copyToClipboard(username);

        if (isCopied) {
          button.classList.add('copied');
          setTimeout(() => {
            button.classList.remove('copied');
          }, 1000);
        } else {
          this.toastContent(TOAST_TYPE.ERROR, `${DICTIONARY[locale]['clipboardToastError1_1']} ${username} ${DICTIONARY[locale]['clipboardToastError1_2']}`);
        }
      });

      return ul;
    },
    /**
     * Renders a normalized list of users in the Drawer's main content element.
     * @returns {void}
    */
    renderUserListContent() {
      const mainContentElem = document.getElementById(DOM_ELEMENT_ID.DRAWER_MAIN_CONTENT);
      if (!mainContentElem) return;

      const notFollowersListElement = this.buildUserList(
        DOM_ELEMENT_ID.NOT_FOLLOWER_LIST_CONTAINER,
        notFollowersList
      );

      const notFollowingListElement = this.buildUserList(
        DOM_ELEMENT_ID.NOT_FOLLOWING_LIST_CONTAINER,
        notFollowingList
      );

      mainContentElem.replaceChildren(
        notFollowersListElement,
        notFollowingListElement
      );
    },
    /**
     * Replaces the main content area with an "empty" state, displaying a message and illustration.
     * @param {string} title - Optional custom title to display. If not provided, a default localized title is used.
     * @param {string} description - Optional custom description to display. If not provided, a default localized description is used.
     * @returns {void}
    */
    emptyContent(title, description) {
      const mainContentElem = document.getElementById(DOM_ELEMENT_ID.DRAWER_MAIN_CONTENT);
      if (!mainContentElem) return;

      const currentTitle = title || DICTIONARY[locale]['emptyTitle'];
      const currentDescription = typeof description === 'string' ? description : DICTIONARY[locale]['emptyDescription'];

      const fragment = HelpersModule.htmlStringToFragmentDOM(`
        <div class="empty-container">
          <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" viewBox="0 0 64 64" fill="none" class="empty-container_image">
            <path
              d="M64 33.1852C64 35.7998 61.9493 37.9259 59.4286 37.9259H4.57143C2.05074 37.9259 0 35.7998 0 33.1852C0 30.5705 2.05074 28.4444 4.57143 28.4444H59.4286C61.9493 28.4444 64 30.5705 64 33.1852ZM57.1429 52.1481C57.1429 58.6829 52.0162 64 45.7143 64C39.4123 64 34.2857 58.6829 34.2857 52.1481C34.2857 50.6796 34.5567 49.2786 35.0296 47.9796C33.1946 47.2646 30.8054 47.2646 28.9704 47.9796C29.4433 49.2786 29.7143 50.6796 29.7143 52.1481C29.7143 58.6829 24.5877 64 18.2857 64C11.9838 64 6.85714 58.6829 6.85714 52.1481C6.85714 45.6134 11.9838 40.2963 18.2857 40.2963C22.3569 40.2963 25.9278 42.5223 27.9527 45.8553C30.4073 44.83 33.5928 44.83 36.0474 45.8553C38.0722 42.5223 41.6431 40.2963 45.7143 40.2963C52.0162 40.2963 57.1429 45.6134 57.1429 52.1481ZM25.1429 52.1481C25.1429 48.2268 22.067 45.037 18.2857 45.037C17.6546 45.037 17.1429 45.5672 17.1429 46.2222C17.1429 46.8773 17.6546 47.4074 18.2857 47.4074C20.8064 47.4074 22.8571 49.5335 22.8571 52.1481C22.8571 52.8032 23.3689 53.3333 24 53.3333C24.6311 53.3333 25.1429 52.8032 25.1429 52.1481ZM52.5714 52.1481C52.5714 48.2268 49.4955 45.037 45.7143 45.037C45.0832 45.037 44.5714 45.5672 44.5714 46.2222C44.5714 46.8773 45.0832 47.4074 45.7143 47.4074C48.235 47.4074 50.2857 49.5335 50.2857 52.1481C50.2857 52.8032 50.7975 53.3333 51.4286 53.3333C52.0597 53.3333 52.5714 52.8032 52.5714 52.1481ZM51.6541 6.71526C50.7009 2.7616 47.2902 0 43.3605 0C40.8951 0 38.5502 1.10305 36.9269 3.02779L32.8605 7.84723C32.4197 8.37037 31.5803 8.36919 31.1394 7.84841L27.0725 3.02779C25.4493 1.10305 23.1043 0 20.6395 0C16.7098 0 13.2991 2.7616 12.3461 6.71526L8.82194 21.3333H55.1779L51.6541 6.71526ZM55.7495 23.7037H8.25051L7.67909 26.0741H56.3208L55.7495 23.7037Z"
              fill="url(#paint0_linear_30_2)" />
            <defs>
              <linearGradient id="paint0_linear_30_2" x1="64" y1="9.33333" x2="25.3333" y2="64"
                gradientUnits="userSpaceOnUse">
                <stop stop-color="#EC4899" />
                <stop offset="1" stop-color="#3B82F6" />
              </linearGradient>
            </defs>
          </svg>
          <h3 class="empty-container_title">${currentTitle}</h3>
          <p class="empty-container_description">${currentDescription}</p>
        </div>
      `);

      mainContentElem.replaceChildren(fragment);
    },
    /**
     * Renders a loading spinner and loading messages inside the main content element.
     * @returns {void}
    */
    loadingContent() {
      const mainContentElem = document.getElementById(DOM_ELEMENT_ID.DRAWER_MAIN_CONTENT);
      if (!mainContentElem) return;

      const titleText = `${flow === FLOW_TYPE.NOT_FOLLOWERS ? DICTIONARY[locale]['followers'] : DICTIONARY[locale]['following']}...`;

      const fragment = HelpersModule.htmlStringToFragmentDOM(`
        <div class="loading-container">
          ${ICONS.SPINNER}
          <div class="loading-container_loading-text-container">
            <span class="loading-container_title loading-container_title_1">${DICTIONARY[locale]['loadingMessageOne']} ${titleText}</span>
            <span class="loading-container_title loading-container_title_2">${DICTIONARY[locale]['loadingMessageTwo']}</span>
          </div>
        </div>
      `);

      mainContentElem.replaceChildren(fragment);
    },
    /**
     * Renders an error message UI inside the main content element of the drawer.
     * @returns {void}
    */
    errorContent() {
      const mainContentElem = document.getElementById(DOM_ELEMENT_ID.DRAWER_MAIN_CONTENT);
      if (!mainContentElem) return;

      const fragment = HelpersModule.htmlStringToFragmentDOM(`
        <div class="error-message-container">
          ${ICONS.ERROR_ALERT}
          <h3 class="error-message-container_title">${DICTIONARY[locale]['errorTitle']}</h3>
          <p class="error-message-container_description margin-top-1">${DICTIONARY[locale]['errorDescription']}</p>
          <ul class="error-message-container_list-text margin-top-1">
            <li>
              <p class="error-message-container_description">${DICTIONARY[locale]['errorMessage1']}</p>
              <p class="error-message-container_description">${DICTIONARY[locale]['errorMessage1_2']}</p>
            </li>
            <li>
              <p class="error-message-container_description margin-top-05">${DICTIONARY[locale]['errorMessage2']}</p>
            </li>
            <li>
              <p class="error-message-container_description margin-top-05">${DICTIONARY[locale]['errorMessage3']}</p>
            </li>
          </ul>
          <p class="error-message-container_description margin-top-2">${DICTIONARY[locale]['errorMessage4']}</p>
          <p class="error-message-container_description margin-top-1">${DICTIONARY[locale]['errorMessage5']}</p>
        </div>
      `);

      mainContentElem.replaceChildren(fragment);
    },
    /**
     * Triggers the tab selection handler with the current global flow value.
     * @returns {void}
    */
    loadSelectTabs() {
      HandlersModule.onSelectTab({
        target: {
          dataset: { value: flow }
        }
      });
    },
    /**
     * Loads and displays content based on the current application context, status, and flow type.
     * @returns {void}
    */
    loadContentByContext() {
      if (status === STATUS_TYPE.LOADING) {
        this.loadingContent();
        this.toggleActionPermissionAnalyzeButton(AVAILABLE_PERMISSION_TYPE.DISABLED);
        this.toggleActionPermissionTabButtons(AVAILABLE_PERMISSION_TYPE.DISABLED);
        return;
      }

      if (status === STATUS_TYPE.ERROR) {
        this.errorContent();
        this.toggleActionPermissionTabButtons(AVAILABLE_PERMISSION_TYPE.ENABLED);
        this.toggleActionPermissionAnalyzeButton(AVAILABLE_PERMISSION_TYPE.ENABLED);
        return;
      }

      this.toggleActionPermissionTabButtons(AVAILABLE_PERMISSION_TYPE.ENABLED);
      this.toggleActionPermissionAnalyzeButton(AVAILABLE_PERMISSION_TYPE.ENABLED);

      switch (flow) {
        case FLOW_TYPE.NOT_FOLLOWERS: {
          if (notFollowersList.length > 0) {
            this.renderUserListContent();
            return;
          };

          if (status === STATUS_TYPE.SUCCESS && notFollowersList.length === 0) {
            this.emptyContent(DICTIONARY[locale]['toastAnalyseNotFound'], '');
            return;
          }

          this.emptyContent();
          return;
        };

        case FLOW_TYPE.NOT_FOLLOWING: {
          if (notFollowingList.length > 0) {
            this.renderUserListContent();
            return;
          };

          if (status === STATUS_TYPE.SUCCESS && notFollowingList.length === 0) {
            this.emptyContent(DICTIONARY[locale]['toastAnalyseNotFound'], '');
            return;
          }

          this.emptyContent();
          return;
        };

        default: {
          this.emptyContent();
          return;
        };
      }
    },
    /**
     * Displays a toast notification with the specified type and message.
     * @param {TOAST_TYPE} toastType - The type of toast to display.
     * @param {string} message - The message to display inside the toast notification.
     * @returns {void}
    */
    toastContent(toastType, message) {
      const toastContainerElem = document.getElementById(DOM_ELEMENT_ID.TOAST_CONTAINER);
      if (!toastContainerElem) return;

      const fragment = HelpersModule.htmlStringToFragmentDOM(`
        <div class="toast-container_toast ${toastType}">
          <div class="toast_icon-container">
            ${ICONS[toastType.toUpperCase()]}
          </div>
          <p class="toast-container_toast_title">${message}</p>
        </div>
      `);

      toastContainerElem.replaceChildren(fragment);

      setTimeout(() => {
        toastContainerElem.replaceChildren('');
      }, 6000);

      setTimeout(() => {
        toastContainerElem.classList.remove('active');
      }, 5000);

      setTimeout(() => {
        toastContainerElem.classList.add('active');
      }, 500);
    },
    /**
     * Toggles the 'disabled' attribute on the analyze button based on the given action permission.
     * @param {AVAILABLE_PERMISSION_TYPE} action - The permission type to set for the analyze button.
     * @returns {void}
    */
    toggleActionPermissionAnalyzeButton(action) {
      const analyzeButton = document.getElementById(DOM_ELEMENT_ID.DRAWER_ACTION_BUTTON);

      if (action === AVAILABLE_PERMISSION_TYPE.DISABLED) {
        analyzeButton.setAttribute('disabled', 'disabled');
      }

      if (action === AVAILABLE_PERMISSION_TYPE.ENABLED) {
        analyzeButton.removeAttribute('disabled');
      }
    },
    /**
     * Toggles the disabled state of the "Not Followers" and "Not Following" tab buttons
     * based on the provided action permission type.
     * @param {AVAILABLE_PERMISSION_TYPE} action - The permission type to apply.
     */
    toggleActionPermissionTabButtons(action) {
      const notFollowersTabTrigger = document.getElementById(DOM_ELEMENT_ID.BUTTON_NOT_FOLLOWERS_TAB_TRIGGER);
      const notFollowingTabTrigger = document.getElementById(DOM_ELEMENT_ID.BUTTON_NOT_FOLLOWING_TAB_TRIGGER);

      if (action === AVAILABLE_PERMISSION_TYPE.DISABLED) {
        notFollowersTabTrigger.setAttribute('disabled', 'disabled');
        notFollowingTabTrigger.setAttribute('disabled', 'disabled');
      }

      if (action === AVAILABLE_PERMISSION_TYPE.ENABLED) {
        notFollowersTabTrigger.removeAttribute('disabled');
        notFollowingTabTrigger.removeAttribute('disabled');
      }
    },
  };

  /**
   * Custom log messages to the console with a timestamp.
   *
   * Optionally, the first parameter be a log level: `'log'`, `'info'`, `'warn'`, or `'error'`.
   *
   * @param {...any} args - The log level (optional) followed by any number of values to log.
   * @example
   * log('Hello World');
   * log('info', {name: 'John Doe'});
   * log('warn', ['Hello', 'World']);
   * log('error', new Error('Oops'));
  */
  function log(...args) {
    if (!IS_ENV_DEV && !IS_DEBUG) return;

    const allowedModules = ['log', 'info', 'warn', 'error'];
    let module = 'log';
    let data = [];

    if (allowedModules.includes(args[0])) {
      module = args[0];
      data = args.slice(1);
    } else {
      data = args;
    }

    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;

    console[module](`[${timestamp}]:`, ...data);
  };

  /**
   * Initializes the application by settings.
   *
   * @async
   * @function
   * @returns {Promise<void>} Resolves when initialization is complete.
   */
  async function init() {
    locale = HelpersModule.getNavigatorLanguage();
    await HelpersModule.retrieveDataFromLastAnalysis();

    StyleModule.appendGlobalStyle(IS_ENV_DEV);

    UIModule.createFloatingButton();
    UIModule.createDrawer();
    UIModule.loadContentByContext();
    UIModule.loadSelectTabs();
  };

  window.addEventListener('load', () => {
    init();
  });
})();
