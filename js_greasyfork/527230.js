// ==UserScript==
// @name         Twitter Virastar Integration
// @version      0.1.1
// @description  ویراستارِ توییت‌های فارسی در X (Twitter)
// @homepage     https://github.com/Amm1rr/Twitter-Virastar-Integration/
// @namespace    amm1rr.com.virastar
// @match        https://x.com/*
// @require      https://update.greasyfork.org/scripts/527228/1538801/Virastar%20Library.js
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527230/Twitter%20Virastar%20Integration.user.js
// @updateURL https://update.greasyfork.org/scripts/527230/Twitter%20Virastar%20Integration.meta.js
// ==/UserScript==

/*
 *  توییتر از کتابخانه‌ی Draft.js برای فیلد متنی استفاده می‌کند که مدیریت State در React را پیچیده می‌سازد.
 *  تغییر مستقیم مقدار فیلد ممکن است عملکرد کلیدهای Backspace و Delete را مختل کند،
 *  مخصوصاً اگر متن از طریق insertText یا روش‌های مشابه تزریق شود.
 *  برای جلوگیری از این مشکل، از DataTransfer (رویداد Paste) بهره می‌گیریم تا متن را به‌شکل صحیح وارد فیلد کنیم
 *  و از تداخل با State داخلی Draft.js پرهیز شود.
 *
 *  این اسکریپت یکی از روش‌های کم‌دردسر برای ادغام با توییتر (X) است.
 *  در هر جایی که دکمه‌ی Tweet یا Reply (با data-testid) اضافه شود، در صورت وجود فیلد متنی، یک دکمه‌ی «ویراستار» نیز افزوده می‌گردد.
 *  بدین‌ترتیب تداخلی با ساختار یا ویژگی‌های توییتر ایجاد نخواهد شد.
 */

(function () {
  "use strict";

  // رنگ‌ها و ثابت‌ها
  const COLORS = {
    GRAY: "#ccc",
    GREEN: "#28a745",
    HIGHLIGHT: "#d4f8d4",
    TRANSPARENT: "transparent",
    TEXT_HIGHLIGHT: "#302f2f",
  };

  const TRANSITION_STYLE = "background-color 0.5s ease";

  const SELECTORS = {
    // دو حالت دکمه‌ی توییتر: Post و Reply
    TWEET_BUTTON:
      '[data-testid="tweetButtonInline"], [data-testid="tweetButton"]',
    // فیلد متنی اصلی مبتنی بر Draft.js
    TWEET_FIELD: '[data-testid="tweetTextarea_0"]',
  };

  const TIMING = {
    PROCESSING_DELAY: 300,
    TEXT_HIGHLIGHT: 1000,
    RESET_DELAY: 1250,
    UI_UPDATE: 100,
  };

  // مراجع سراسری برای مدیریت دکمه‌ی ویراستار و جلوگیری از ساخت تکراری
  let lastTweetButtonRef = null;
  let lastVirastarButtonRef = null;

  // توابع کمکی متداول

  // تاخیر ساده بر اساس Promise
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  // بررسی شروع متن با حروف فارسی
  const isPersian = (text) => /^[\u0600-\u06FF\u0750-\u077F]/.test(text);

  // پاک‌کردن فیلد متنی از طریق ClipboardEvent
  function clearTweetField(tweetField) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(tweetField);
    selection.removeAllRanges();
    selection.addRange(range);

    const dt = new DataTransfer();
    dt.setData("text/plain", "");
    const pasteEvent = new ClipboardEvent("paste", {
      bubbles: true,
      cancelable: true,
      clipboardData: dt,
    });
    tweetField.dispatchEvent(pasteEvent);
  }

  // درج متن تمیزشده در فیلد، با استفاده از DataTransfer برای ناسازگارنشدن با Draft.js
  function pasteText(tweetField, text) {
    const dt = new DataTransfer();
    dt.setData("text/plain", text);
    // تبدیل Line Breakها به <br> مطابق با ساختار Draft.js
    dt.setData("text/html", text.replace(/\n/g, "<br>"));

    const pasteEvent = new ClipboardEvent("paste", {
      bubbles: true,
      cancelable: true,
      clipboardData: dt,
    });
    tweetField.dispatchEvent(pasteEvent);
  }

  // قراردادن کرسر در انتهای فیلد متنی
  function setCursorToEnd(tweetField) {
    const selection = window.getSelection();
    const range = document.createRange();
    range.selectNodeContents(tweetField);
    range.collapse(false);
    selection.removeAllRanges();
    selection.addRange(range);
  }

  // بروزرسانی فیلد متنی با متن ویراسته و نمایش افکت رنگی
  async function updateTweetText(processedText) {
    const tweetField = document.querySelector(SELECTORS.TWEET_FIELD);
    if (!tweetField) return;

    tweetField.focus();
    clearTweetField(tweetField);
    await delay(50);
    pasteText(tweetField, processedText);

    tweetField.style.transition = TRANSITION_STYLE;
    tweetField.style.backgroundColor = COLORS.HIGHLIGHT;
    requestAnimationFrame(() => {
      setTimeout(
        () => (tweetField.style.backgroundColor = COLORS.TRANSPARENT),
        TIMING.TEXT_HIGHLIGHT
      );
    });

    await delay(TIMING.UI_UPDATE);
    setCursorToEnd(tweetField);
  }

  /**
   * ایجاد دکمه‌ی ویراستار کنار دکمه‌ی Tweet/Reply جدید
   * - اگر دکمه‌ی قبلی از DOM حذف شده باشد، دکمه‌ی ویراستارش را هم پاک می‌کنیم.
   * - از ساخت مجدد و تکراری دکمه‌ی ویراستار جلوگیری می‌کنیم.
   */
  function createVirastarButton(tweetButton) {
    // اگر دکمه‌ی قبلی وجود داشته ولی از صفحه حذف شده، دکمه‌ی ویراستار آن هم پاک شود
    if (lastTweetButtonRef && !document.contains(lastTweetButtonRef)) {
      if (lastVirastarButtonRef && lastVirastarButtonRef.parentElement) {
        lastVirastarButtonRef.remove();
      }
      lastVirastarButtonRef = null;
      lastVirastarButtonRef = null;
    }

    // اگر این دکمه عیناً همان دکمه‌ی قبلی است، دوباره نساز
    if (tweetButton === lastTweetButtonRef) {
      return;
    }

    // چک کنیم اگر در والد همین دکمه، ویراستار ساخته شده، تکراری نسازیم
    if (tweetButton.parentElement.querySelector("#virastar-button")) {
      return;
    }

    // اگر قصد داشتید همیشه فقط یکی بسازید، باید دکمه‌ی قبلی را حذف کنید؛
    // اما در اینجا شما می‌خواهید با بسته‌شدن دیالوگ، دکمه‌ی قبلی باقی بماند.

    // بنابراین دکمه‌ی جدید را می‌سازیم و مرجع آن را حفظ می‌کنیم
    lastTweetButtonRef = tweetButton;

    const editButton = document.createElement("button");
    editButton.id = "virastar-button";
    editButton.textContent = "ویراستار ✍️";
    editButton.disabled = true;
    editButton.style.cssText = `
    margin-left: 10px;
    padding: 8px 12px;
    border: none;
    border-radius: 9999px;
    background-color: ${COLORS.GRAY};
    color: white;
    cursor: default;
    font-size: 14px;
    transition: background-color 0.3s, transform 0.2s;
    width: 100px;
    text-align: center;
    `;

    lastVirastarButtonRef = editButton;

    // هماهنگ‌سازی رنگ دکمه‌ی ویراستار با دکمه‌ی اصلی توییتر
    const tweetButtonStyles = window.getComputedStyle(tweetButton);
    const tweetButtonBackgroundColor = tweetButtonStyles.backgroundColor;

    // رویدادها جهت افکت Hover
    editButton.addEventListener("mouseover", () => {
      if (!editButton.disabled) {
        editButton.style.backgroundColor = COLORS.TEXT_HIGHLIGHT;
      }
    });
    editButton.addEventListener("mouseout", () => {
      if (!editButton.disabled) {
        editButton.style.backgroundColor = tweetButtonBackgroundColor;
      }
    });

    // رویدادها برای فعال/غیرفعال کردن دکمه بر اساس متن فیلد
    const tweetField = document.querySelector(SELECTORS.TWEET_FIELD);
    if (tweetField) {
      let cachedText = "";
      const updateButtonState = () => {
        const text = tweetField.innerText.trim();
        cachedText = text;
        const hasText = text.length > 0;
        editButton.disabled = !hasText;
        editButton.style.backgroundColor = hasText
          ? tweetButtonBackgroundColor
          : COLORS.GRAY;
        editButton.style.cursor = hasText ? "pointer" : "default";

        if (hasText) {
          tweetField.style.direction = isPersian(text) ? "rtl" : "ltr";
        }
      };

      // گوش‌دادن به تغییرات محتوای فیلد Draft.js
      ["input", "keyup", "compositionend", "textInput"].forEach((ev) => {
        tweetField.addEventListener(ev, updateButtonState);
      });

      // کلیک روی دکمه‌ی ویراستار برای اصلاح متن
      editButton.addEventListener("click", async () => {
        if (editButton.disabled) return;
        editButton.disabled = true;
        editButton.textContent = "... ⏳";
        editButton.style.transform = "scale(0.95)";
        editButton.style.cursor = "default";

        await delay(TIMING.PROCESSING_DELAY);
        const processed = new Virastar().cleanup(cachedText);
        await updateTweetText(processed);

        editButton.textContent = "✅";
        editButton.style.backgroundColor = COLORS.GREEN;

        await delay(TIMING.RESET_DELAY);
        editButton.textContent = "ویراستار ✍️";
        editButton.style.backgroundColor = tweetButtonBackgroundColor;
        editButton.disabled = false;
        editButton.style.transform = "scale(1)";
        editButton.style.cursor = "pointer";
      });

      // مقدار اولیه برای فعال/غیرفعال
      updateButtonState();
    }

    // افزودن دکمه به والد دکمه‌ی Tweet/Reply
    tweetButton.parentElement.appendChild(editButton);
  }

  /*
   *    MutationObserver:
   *    فقط نودهای جدیدی که در صفحه اضافه می‌شوند بررسی می‌کنیم
   *    تا در کل سند جست‌وجوی تکراری و سنگین انجام نگیرد.
   */
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
        for (const node of mutation.addedNodes) {
          if (node.nodeType === Node.ELEMENT_NODE) {
            // اگر گره اضافه‌شده مستقیماً دکمه‌ی توییتر باشد
            if (node.matches?.(SELECTORS.TWEET_BUTTON)) {
              if (node.offsetParent !== null) {
                createVirastarButton(node);
              }
            } else {
              // یا اگر در فرزندان آن یک دکمه‌ی توییتر باشد
              const btn = node.querySelector?.(SELECTORS.TWEET_BUTTON);
              if (btn && btn.offsetParent !== null) {
                createVirastarButton(btn);
              }
            }
          }
        }
      }
    }
  });

  // نظارت بر تغییرات در کل صفحه
  observer.observe(document.body, { childList: true, subtree: true });
})();