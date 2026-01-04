// ==UserScript==
// @name         Quick Edit
// @namespace    http://tampermonkey.net/
// @version      1.5
// @description  "Quick Edit Popup for Web Content"
// @author       DuyNguyen2k6 
// @match        *://*/*
// @grant        none
// @icon       https://github.com/DuyNguyen2k6/quick-edit_Extension/blob/main/icon.png?raw=true
// @downloadURL https://update.greasyfork.org/scripts/539810/Quick%20Edit.user.js
// @updateURL https://update.greasyfork.org/scripts/539810/Quick%20Edit.meta.js
// ==/UserScript==

(function() {
  // Ẩn hoàn toàn scrollbar popup và textarea, nhưng vẫn scroll được
  (function insertHideScrollbarCSS() {
    const style = document.createElement("style");
    style.textContent = `
      /* Ẩn scrollbar nhưng vẫn scroll được */
      #html-quick-edit-popup,
      #html-quick-edit-popup textarea {
        scrollbar-width: none; /* Firefox */
        -ms-overflow-style: none;  /* IE 10+ */
      }
      #html-quick-edit-popup::-webkit-scrollbar,
      #html-quick-edit-popup textarea::-webkit-scrollbar {
        display: none; /* Chrome, Safari, Edge */
      }
    `;
    document.head.appendChild(style);
  })();

  // Snackbar style & function
  (function insertSnackbarCSS() {
    const style = document.createElement("style");
    style.id = "snackbar-style";
    style.textContent = `
      #snackbar {
        visibility: hidden;
        min-width: 250px;
        background-color: rgba(255,255,255,0.95);
        color: #222;
        text-align: center;
        border-radius: 12px;
        padding: 14px 24px;
        position: fixed;
        left: 50%;
        bottom: 30px;
        font-size: 16px;
        transform: translateX(-50%);
        z-index: 1000001;
        box-shadow: 0 4px 20px rgba(0,0,0,0.1);
        opacity: 0;
        transition: opacity 0.4s ease, visibility 0.4s;
        font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
        backdrop-filter: none;
        -webkit-backdrop-filter: none;
        border: 1px solid #ddd;
      }
      @media (prefers-color-scheme: dark) {
        #snackbar {
          background-color: rgba(20,20,20,0.75);
          color: #eee;
          box-shadow: 0 4px 20px rgba(0,0,0,0.6);
          backdrop-filter: blur(12px) saturate(180%);
          -webkit-backdrop-filter: blur(12px) saturate(180%);
          border: 1px solid rgba(255,255,255,0.15);
        }
      }
      #snackbar.show {
        visibility: visible;
        opacity: 1;
      }
    `;
    document.head.appendChild(style);
  })();

  function showSnackbar(message, duration = 3000) {
    let snackbar = document.getElementById("snackbar");
    if (snackbar) {
      snackbar.remove();
    }

    snackbar = document.createElement("div");
    snackbar.id = "snackbar";
    snackbar.textContent = message;

    document.body.appendChild(snackbar);

    setTimeout(() => {
      snackbar.classList.add("show");
    }, 100);

    setTimeout(() => {
      snackbar.classList.remove("show");
      setTimeout(() => {
        if (snackbar.parentNode) snackbar.parentNode.removeChild(snackbar);
      }, 400);
    }, duration + 100);
  }

  function sanitizeText(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.textContent;
  }

  function replaceTextInRange(range, newText) {
    const startNode = range.startContainer;
    const endNode = range.endContainer;
    const startOffset = range.startOffset;
    const endOffset = range.endOffset;

    if (startNode === endNode && startNode.nodeType === Node.TEXT_NODE) {
      const originalText = startNode.textContent;
      startNode.textContent =
        originalText.substring(0, startOffset) +
        newText +
        originalText.substring(endOffset);
    } else {
      const commonAncestor = range.commonAncestorContainer;
      const walker = document.createTreeWalker(
        commonAncestor,
        NodeFilter.SHOW_TEXT,
        {
          acceptNode: (node) =>
            range.intersectsNode(node)
              ? NodeFilter.FILTER_ACCEPT
              : NodeFilter.FILTER_SKIP,
        }
      );

      let node;
      const nodesToUpdate = [];
      while ((node = walker.nextNode())) {
        nodesToUpdate.push(node);
      }

      nodesToUpdate.forEach((textNode, index) => {
        if (index === 0) {
          textNode.textContent =
            textNode.textContent.substring(0, startOffset) + newText;
        } else if (index === nodesToUpdate.length - 1) {
          textNode.textContent = textNode.textContent.substring(endOffset);
        } else {
          textNode.textContent = "";
        }
      });

      nodesToUpdate.forEach((node) => {
        if (node.textContent === "" && node.parentNode) {
          node.parentNode.removeChild(node);
        }
      });
    }
  }

  function createEditorPopup(selectedText, range) {
    const existing = document.getElementById("html-quick-edit-popup");
    if (existing) existing.remove();

    const isDarkMode = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const popup = document.createElement("div");
    popup.id = "html-quick-edit-popup";

    Object.assign(popup.style, {
      position: "fixed",
      zIndex: "1000000",
      background: isDarkMode
        ? "rgba(18, 18, 18, 0.75)"
        : "rgba(249, 249, 249, 0.9)",
      color: isDarkMode ? "#e0e0e0" : "#1c1c1c",
      borderRadius: "16px",
      boxShadow: isDarkMode
        ? "0 6px 20px rgba(0,0,0,0.8)"
        : "0 6px 20px rgba(0,0,0,0.15)",
      padding: "20px",
      minWidth: "380px",
      maxWidth: "90vw",
      maxHeight: "70vh",
      opacity: "0",
      visibility: "hidden",
      transform: "scale(0.8)",
      transition: "opacity 0.3s ease, visibility 0.3s ease, transform 0.3s ease",
      display: "flex",
      flexDirection: "column",
      fontFamily:
        "SF Pro Text, -apple-system, BlinkMacSystemFont, 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      userSelect: "text",

      backdropFilter: isDarkMode ? "blur(20px) saturate(180%)" : "blur(10px)",
      WebkitBackdropFilter: isDarkMode ? "blur(20px) saturate(180%)" : "blur(10px)",
      border: isDarkMode
        ? "1px solid rgba(255, 255, 255, 0.15)"
        : "1px solid rgba(0, 0, 0, 0.1)",

      overflowY: "auto",
    });

    const header = document.createElement("div");
    header.textContent = "Quick Edit by DuyNguyen2k6";
    Object.assign(header.style, {
      fontWeight: "700",
      fontSize: "18px",
      marginBottom: "15px",
      textAlign: "center",
      cursor: "move",
      userSelect: "none",
      color: isDarkMode ? "#ddd" : "#1c1c1e",
      letterSpacing: "0.05em",
    });
    popup.appendChild(header);

    const textarea = document.createElement("textarea");
    textarea.value = selectedText;
    Object.assign(textarea.style, {
      flexGrow: "1",
      width: "100%",
      borderRadius: "16px",
      border: isDarkMode
        ? "1.5px solid rgba(255, 255, 255, 0.3)"
        : "1.5px solid rgba(0, 0, 0, 0.1)",
      backgroundColor: isDarkMode
        ? "rgba(255, 255, 255, 0.1)"
        : "rgba(255, 255, 255, 0.7)",
      color: isDarkMode ? "#eee" : "#1c1c1e",
      fontSize: "16px",
      fontFamily: "inherit",
      padding: "15px",
      resize: "vertical",
      outline: "none",
      transition: "border-color 0.3s ease",
      boxSizing: "border-box",
      minHeight: "130px",
      backdropFilter: isDarkMode ? "blur(12px) saturate(180%)" : "blur(8px)",
      WebkitBackdropFilter: isDarkMode ? "blur(12px) saturate(180%)" : "blur(8px)",

      overflowY: "auto",
    });
    textarea.oninput = () => {
      textarea.style.borderColor = isDarkMode ? "#90caf9" : "#007aff";
      setTimeout(() => {
        textarea.style.borderColor = isDarkMode
          ? "rgba(255, 255, 255, 0.3)"
          : "rgba(0, 0, 0, 0.1)";
      }, 500);
    };
    textarea.onkeydown = (e) => {
      if (e.key === "Tab") {
        e.preventDefault();
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        textarea.value =
          textarea.value.substring(0, start) + "\n" + textarea.value.substring(end);
        textarea.selectionStart = textarea.selectionEnd = start + 1;
      }
    };
    popup.appendChild(textarea);

    const infoText = document.createElement("div");
    infoText.textContent = "Press Enter to save, Escape to cancel, Tab for new line.";
    Object.assign(infoText.style, {
      marginTop: "12px",
      fontSize: "12px",
      color: isDarkMode ? "#999" : "#8e8e93",
      textAlign: "center",
      userSelect: "none",
    });
    popup.appendChild(infoText);

    // Thêm popup vào DOM trước để đo kích thước
    document.body.appendChild(popup);

    // Đo popup và tính vị trí pixel tuyệt đối giữa màn hình
    const popupRect = popup.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    let currentX = (viewportWidth - popupRect.width) / 2;
    let currentY = (viewportHeight - popupRect.height) / 2;

    // Gán vị trí pixel tuyệt đối, bỏ transform (sẽ có transform scale, nhưng vị trí cố định)
    popup.style.left = `${currentX}px`;
    popup.style.top = `${currentY}px`;
    popup.style.transformOrigin = "center center";

    // Hiệu ứng Zoom & Fade mở popup
    setTimeout(() => {
      popup.style.visibility = "visible";
      popup.style.opacity = "1";
      popup.style.transform = "scale(1)";
    }, 10);

    // Hàm đóng popup với hiệu ứng thu nhỏ và mờ dần
    function closePopup() {
      popup.style.opacity = "0";
      popup.style.transform = "scale(0.8)";
      popup.style.visibility = "hidden";
      setTimeout(() => {
        if (popup.parentNode) {
          popup.parentNode.removeChild(popup);
        }
      }, 300);
    }

    popup.addEventListener("keydown", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        try {
          const cleanedText = sanitizeText(textarea.value);
          replaceTextInRange(range, cleanedText);
          showSnackbar("Changes saved!");
          closePopup();
        } catch (error) {
          showSnackbar("Error saving changes.");
          console.error(error);
        }
      } else if (e.key === "Escape") {
        closePopup();
      }
    });

    // Drag functionality
    let isDragging = false,
      initialX = 0,
      initialY = 0,
      currentXPos = currentX,
      currentYPos = currentY;

    header.addEventListener("mousedown", (e) => {
      isDragging = true;

      initialX = e.clientX - currentXPos;
      initialY = e.clientY - currentYPos;

      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
    });

    function onMouseMove(e) {
      if (isDragging) {
        e.preventDefault();

        currentXPos = e.clientX - initialX;
        currentYPos = e.clientY - initialY;

        const maxX = window.innerWidth - popup.offsetWidth;
        const maxY = window.innerHeight - popup.offsetHeight;
        currentXPos = Math.max(0, Math.min(currentXPos, maxX));
        currentYPos = Math.max(0, Math.min(currentYPos, maxY));

        popup.style.left = currentXPos + "px";
        popup.style.top = currentYPos + "px";
      }
    }

    function onMouseUp() {
      isDragging = false;
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    }

    textarea.focus();
  }

  // Lắng nghe middle-click để mở popup
  document.addEventListener("mousedown", (e) => {
    if (e.button === 1) { // Middle click
      const selection = window.getSelection();
      if (selection && !selection.isCollapsed) {
        e.preventDefault();
        const range = selection.getRangeAt(0);
        const selectedText = selection.toString();
        createEditorPopup(selectedText, range);
      }
    }
  });
})();
