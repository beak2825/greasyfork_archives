
// ==UserScript==
// @name         EZ (PRE UPDATE VER)
// @namespace    http://tampermonkey.net/
// @version      4.7
// @description  Dò đáp án đúng...
// @author       V Quan Người đã test: H Nam, K Ngoc, ...
// @match        https://lms360.edu.vn/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/513239/EZ%20%28PRE%20UPDATE%20VER%29.user.js
// @updateURL https://update.greasyfork.org/scripts/513239/EZ%20%28PRE%20UPDATE%20VER%29.meta.js
// ==/UserScript==

(async function() {
  'use strict';

  // URL meta.js chứa thông tin cập nhật
  const updateURL = 'https://update.greasyfork.org/scripts/513239/D%C3%B2%20%C4%90%C3%A1p%20%C3%81n%20LMS%20360%20%28UPDATE%20VER%29.meta.js';
  const currentVersion = '4.7'; // Phiên bản hiện tại của script

  // Gọi hàm kiểm tra cập nhật ngay khi script được chạy
  await checkForUpdates();

  // Hàm kiểm tra cập nhật
  async function checkForUpdates() {
    let hasUpdate = false;

    try {
      const response = await fetch(updateURL, {
        headers: { 'Content-Type': 'text/plain' }
      });

      if (!response.ok) throw new Error('Không thể tải thông tin cập nhật');

      const data = await response.text();

      // Phân tích metadata để tìm phiên bản mới
      const versionMatch = data.match(/@version\s+([\d.]+)/);
      if (versionMatch && versionMatch[1]) {
        const latestVersion = versionMatch[1];

        // So sánh phiên bản hiện tại với phiên bản mới
        hasUpdate = compareVersions(currentVersion, latestVersion);

        if (hasUpdate) {
          showNotification(`<strong>Có bản cập nhật mới (v<strong>${latestVersion}</strong>)!</strong>`, 'success', true);
        } else {
          showNotification('<strong>Không có cập nhật mới</strong>', 'info', false);
        }
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra cập nhật:', error);
      showNotification('<strong>Lỗi khi kiểm tra cập nhật</strong>', 'error', false);
    }
  }

  // Hàm so sánh phiên bản
  function compareVersions(current, latest) {
    const currentParts = current.split('.').map(Number);
    const latestParts = latest.split('.').map(Number);

    for (let i = 0; i < Math.max(currentParts.length, latestParts.length); i++) {
      const curr = currentParts[i] || 0;
      const latest = latestParts[i] || 0;
      if (curr < latest) return true;
      if (curr > latest) return false;
    }
    return false;
  }

  // Hàm hiển thị thông báo
  function showNotification(message, type, showOkButton) {
    const notificationBox = document.createElement('div');
    notificationBox.className = 'notification';
    notificationBox.style.position = 'fixed';
    notificationBox.style.bottom = '70px';
    notificationBox.style.left = '-300px';
    notificationBox.style.padding = '10px';
    notificationBox.style.backgroundColor = 'white';
    notificationBox.style.border = '1px solid #ccc';
    notificationBox.style.borderRadius = '5px';
    notificationBox.style.display = 'flex';
    notificationBox.style.alignItems = 'center';
    notificationBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
    notificationBox.style.zIndex = '9999';
    notificationBox.style.transition = 'left 0.5s ease, opacity 0.5s ease';
    notificationBox.style.opacity = '1';

    const icon = document.createElement('div');
    icon.className = 'icon';
    const notificationText = document.createElement('div');
    notificationText.className = 'text';
    notificationText.innerHTML = message;

    // Thay đổi biểu tượng và màu sắc dựa trên loại thông báo
    if (type === 'success') {
      icon.innerHTML = '<img src="https://img.icons8.com/ios-filled/50/28a745/checkmark.png" class="icon">';
      notificationText.style.color = 'green';
    } else if (type === 'error') {
      icon.innerHTML = '<img src="https://img.icons8.com/ios-filled/50/FF0000/cancel.png" class="icon">';
      notificationText.style.color = 'red';
    } else if (type === 'info') {
      icon.innerHTML = '<img src="https://cdn.iconscout.com/icon/free/png-512/free-info-icon-download-in-svg-png-gif-file-formats--information-data-user-interface-pack-icons-1604565.png?f=webp&w=256" width="30" height="30">';
      notificationText.style.color = 'blue';
    }

    icon.style.marginRight = '10px';
    notificationBox.appendChild(icon);
    notificationBox.appendChild(notificationText);

    // Tạo nút "Ok" chỉ khi có bản cập nhật mới
    if (showOkButton) {
      const okButton = document.createElement('button');
      okButton.textContent = 'Ok';
      okButton.style.marginLeft = '10px';
      okButton.style.padding = '5px 10px';
      okButton.style.border = 'none';
      okButton.style.borderRadius = '5px';
      okButton.style.backgroundColor = '#28a745';
      okButton.style.color = 'white';
      okButton.style.cursor = 'pointer';

      // Thêm sự kiện click cho nút "Ok"
      okButton.onclick = () => {
        window.open('https://update.greasyfork.org/scripts/513239/EZ%20%28PRE%20UPDATE%20VER%29.user.js');
        document.body.removeChild(notificationBox); // Đóng thông báo
      };

      notificationBox.appendChild(okButton);
    }

    document.body.appendChild(notificationBox);

    // Hiệu ứng slide vào màn hình
    setTimeout(() => {
      notificationBox.style.left = '10px';
    }, 100);

    // Tự động ẩn sau 3 giây
    setTimeout(() => {
      notificationBox.style.opacity = '0';
      notificationBox.style.left = '-300px';
      setTimeout(() => {
        document.body.removeChild(notificationBox);
      }, 500);
    }, 3000);
  }

})();

    // Tạo nút để mở cửa sổ nhỏ
    const button = document.createElement("button");
    button.innerHTML = "Open Poe.com";
    button.style.position = "fixed";
    button.style.bottom = "20px";
    button.style.right = "20px";
    button.style.padding = "10px 20px";
    button.style.backgroundColor = "#007bff";
    button.style.color = "#fff";
    button.style.border = "none";
    button.style.borderRadius = "5px";
    button.style.cursor = "pointer";
    button.style.zIndex = "9999";

    button.onclick = function() {
        // Mở cửa sổ nhỏ với kích thước 800x600
        window.open("https://poe.com/", "Poe", "width=800,height=600");
    };

    // Thêm nút vào trang
    document.body.appendChild(button);


(function() {
    'use strict';

    let hasCopied = false; // Biến kiểm tra xem đã dò đáp án chưa
    let currentQuestion = ""; // Biến để lưu câu hỏi hiện tại
    let isPanelOpen = true; // Biến kiểm soát mở/đóng bảng
    let autoCheckEnabled = false; // Biến kiểm soát tự động dò đáp án

// Hàm để lấy tên người dùng
function getUserName() {
    const userNameElement = document.querySelector("#root > div > div.gradient-9.fixed.top-0.iw-full.z-full > div.hidden.lg\\:block.iw-full > div > div.grow.flex.justify-between.items-center.ipr-30.ipy-12 > div.flex.items-center.gap-2 > div.relative.nav-user > div.relative > div.flex.flex-column.items-start.justify-content-center.ih-45.ibg-0d6.itext-13.itext-light.ipy-9.ipx-30.rounded-tr-20.rounded-br-20 > span.text-light.font-bold");

    // Kiểm tra xem phần tử có chứa chữ không
    return userNameElement && userNameElement.innerText.trim() ? userNameElement.innerText.trim() : 'Người dùng';
}

// Tạo ô thông báo tên
const greetingBox = document.createElement('div');
greetingBox.style.position = 'fixed';
greetingBox.style.left = '50%'; // Đặt ở giữa ngang
greetingBox.style.bottom = '60px'; // Cách đáy 60px để có chỗ cho ô gradient
greetingBox.style.transform = 'translateX(-50%)'; // Giữa theo chiều ngang
greetingBox.style.padding = '10px 20px'; // Thêm padding cho ô
greetingBox.style.background = 'green'; // Nền màu xanh
greetingBox.style.borderRadius = '5px';
greetingBox.style.display = 'flex';
greetingBox.style.alignItems = 'center';
greetingBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
greetingBox.style.zIndex = '9999';
greetingBox.style.transition = 'bottom 0.5s ease, opacity 0.5s ease'; // Hiệu ứng cho bottom và opacity
greetingBox.style.opacity = '1';

// Thêm nội dung thông báo tên
const userName = getUserName();
const greetingText = document.createElement('span');
greetingText.innerHTML = `<strong>Xin chào bạn ${userName}!</strong>`; // Sử dụng thẻ strong để in đậm
greetingText.style.color = 'white'; // Màu chữ đen

// Thêm phần tử vào ô thông báo tên
greetingBox.appendChild(greetingText);

// Thêm ô thông báo vào body tên
document.body.appendChild(greetingBox);

// Hiệu ứng mở đầu: trượt ra
setTimeout(() => {
    greetingBox.style.bottom = '70px'; // Đưa ô vào vị trí hiển thị
}, 1000); // Thời gian chờ trước khi mở

// Tự động ẩn ô thông báo sau 3 giây
setTimeout(() => {
    greetingBox.style.opacity = '0'; // Giảm độ mờ
    greetingBox.style.bottom = '-100px'; // Trượt vào
    setTimeout(() => {
        document.body.removeChild(greetingBox);
    }, 500); // Thời gian để ẩn
}, 3000);


// Tạo ô thông báo thành công
const notificationBox = document.createElement('div');
notificationBox.style.position = 'fixed';
notificationBox.style.bottom = '10px';
notificationBox.style.left = '-300px'; // Bắt đầu ngoài màn hình bên trái
notificationBox.style.padding = '10px';
notificationBox.style.backgroundColor = 'white';
notificationBox.style.border = '1px solid #ccc';
notificationBox.style.borderRadius = '5px';
notificationBox.style.display = 'flex';
notificationBox.style.alignItems = 'center';
notificationBox.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
notificationBox.style.zIndex = '9999';
notificationBox.style.transition = 'left 0.5s ease, opacity 0.5s ease'; // Hiệu ứng cho left và opacity
notificationBox.style.opacity = '1';

// Thêm biểu tượng tick
const icon = document.createElement('img');
icon.src = 'https://img.icons8.com/ios-filled/50/28a745/checkmark.png';
icon.style.width = '20px';
icon.style.height = '20px';
icon.style.marginRight = '10px';

// Thêm nội dung thông báo
const notificationText = document.createElement('span');
notificationText.innerHTML = `<strong>Tải thành công!</strong>`;
notificationText.style.color = 'green';

// Thêm phần tử vào ô thông báo
notificationBox.appendChild(icon);
notificationBox.appendChild(notificationText);

// Thêm ô thông báo vào body
document.body.appendChild(notificationBox);

// Hiệu ứng mở đầu: trượt vào
setTimeout(() => {
    notificationBox.style.left = '10px'; // Đưa ô vào vị trí hiển thị
}, 100);

// Tự động ẩn ô thông báo sau 3 giây
setTimeout(() => {
    notificationBox.style.opacity = '0'; // Giảm độ mờ
    notificationBox.style.left = '-300px'; // Trượt ra
    setTimeout(() => {
        document.body.removeChild(notificationBox);
    }, 500);
}, 3000);


    // Hàm tạo tên ngẫu nhiên với tối đa 10 ký tự
    function generateRandomName() {
        const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let name = '';
        for (let i = 0; i < 10; i++) {
            name += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return name;
    }

    // Lấy tên ngẫu nhiên
    const nameText = generateRandomName();

    // Tạo bảng thông báo
    const infoBox = document.createElement('div');
    infoBox.style.position = 'fixed';
    infoBox.style.top = '50px';
    infoBox.style.right = '10px';
    infoBox.style.padding = '10px';
    infoBox.style.backgroundColor = 'white';
    infoBox.style.border = '3px solid #003366';
    infoBox.style.borderRadius = '10px';
    infoBox.style.zIndex = '9999';
    infoBox.style.cursor = 'move';
    infoBox.style.width = '250px';

    // Nút "Đáp án (không thủ công)"
    const answerButton = document.createElement('button');
    answerButton.innerText = 'Đáp án (không thủ công)';
    answerButton.style.marginTop = '10px';
    answerButton.style.padding = '5px 10px';
    answerButton.style.borderRadius = '5px';
    answerButton.style.border = '2px solid #003366';
    answerButton.style.backgroundColor = 'white';
    answerButton.style.cursor = 'pointer';

    // Khung hiển thị trung tâm
    const centerBox = document.createElement('div');
    centerBox.style.position = 'fixed';
    centerBox.style.top = '50%';
    centerBox.style.left = '50%';
    centerBox.style.transform = 'translate(-50%, -50%)';
    centerBox.style.backgroundColor = 'white';
    centerBox.style.border = '3px solid #003366';
    centerBox.style.borderRadius = '10px';
    centerBox.style.padding = '20px';
    centerBox.style.zIndex = '10000';
    centerBox.style.display = 'none';

    // Nút "Công nghệ"
    const techButton = document.createElement('button');
    techButton.innerText = 'Công nghệ';
    techButton.style.marginRight = '10px';
    techButton.style.padding = '5px 10px';
    techButton.style.borderRadius = '5px';
    techButton.style.border = '2px solid #003366';
    techButton.style.cursor = 'pointer';

    // Nút "KHTN"
    const khtnButton = document.createElement('button');
    khtnButton.innerText = 'KHTN';
    khtnButton.style.padding = '5px 10px';
    khtnButton.style.borderRadius = '5px';
    khtnButton.style.border = '2px solid #003366';
    khtnButton.style.cursor = 'pointer';

// Tạo nút đóng (icon nhỏ) hình vuông
const closeButton = document.createElement('button');
closeButton.innerHTML = '&#x2715;'; // Biểu tượng đóng
closeButton.style.position = 'absolute';
closeButton.style.top = '5px';
closeButton.style.right = '5px';
closeButton.style.width = '23px'; // Đặt chiều rộng
closeButton.style.height = '23px'; // Đặt chiều cao
closeButton.style.borderRadius = '50%';
closeButton.style.border = 'none';
closeButton.style.backgroundColor = 'red';
closeButton.style.color = 'white';
closeButton.style.cursor = 'pointer';

    // Xử lý nút "Đáp án (không thủ công)"
    answerButton.onclick = () => {
        centerBox.style.display = 'block';
    };

    // Xử lý nút "Công nghệ"
        techButton.onclick = () => {
        const answerBox = document.createElement('div');
        answerBox.style.position = 'fixed';
        answerBox.style.top = '50%';
        answerBox.style.left = '50%';
        answerBox.style.transform = 'translate(-50%, -50%)';
        answerBox.style.backgroundColor = 'white';
        answerBox.style.border = '3px solid #003366';
        answerBox.style.borderRadius = '10px';
        answerBox.style.padding = '20px';
        answerBox.style.zIndex = '10001';

        answerBox.innerHTML = `
            <h3>ĐÉO CÓ</h3>
        `;

        const closeAnswerButton = closeButton.cloneNode(true);
        closeAnswerButton.onclick = () => {
            answerBox.remove();
        };
        answerBox.appendChild(closeAnswerButton);
        document.body.appendChild(answerBox);
    };

    // Xử lý nút "KHTN"
    khtnButton.onclick = () => {
        const answerBox = document.createElement('div');
        answerBox.style.position = 'fixed';
        answerBox.style.top = '50%';
        answerBox.style.left = '50%';
        answerBox.style.transform = 'translate(-50%, -50%)';
        answerBox.style.backgroundColor = 'white';
        answerBox.style.border = '3px solid #003366';
        answerBox.style.borderRadius = '10px';
        answerBox.style.padding = '20px';
        answerBox.style.zIndex = '10001';

        answerBox.innerHTML = `
            <h3>KHTN đáp án bài mới</h3>
            <p>Câu nối:</p>
            <p>+ Vật phản xạ âm tốt: gạch men, cửa kính</p>
            <p>+ Vật phản xạ âm kém: tấm xốp, thảm len</p>
            <p>Câu nối:</p>
            <p>+Hiện tượng sóng âm được đề cập tới trong video là hiện tượng (tiếng vang)</p>
        `;

        const closeAnswerButton = closeButton.cloneNode(true);
        closeAnswerButton.onclick = () => {
            answerBox.remove();
        };
        answerBox.appendChild(closeAnswerButton);
        document.body.appendChild(answerBox);
    };

    // Xử lý nút đóng
    closeButton.onclick = () => {
        centerBox.style.display = 'none';
    };

    // Kéo thả khung trung tâm
    let isDragging = false;
    let offsetX = 0;
    let offsetY = 0;

    centerBox.onmousedown = (e) => {
        isDragging = true;
        offsetX = e.clientX - centerBox.getBoundingClientRect().left;
        offsetY = e.clientY - centerBox.getBoundingClientRect().top;
        document.body.style.userSelect = 'none';
    };

    document.onmousemove = (e) => {
        if (isDragging) {
            centerBox.style.left = `${e.clientX - offsetX}px`;
            centerBox.style.top = `${e.clientY - offsetY}px`;
        }
    };

    document.onmouseup = () => {
        isDragging = false;
        document.body.style.userSelect = '';
    };

    // Thêm các nút vào khung trung tâm
    centerBox.appendChild(techButton);
    centerBox.appendChild(khtnButton);
    centerBox.appendChild(closeButton);

    // Thêm vào trang
    infoBox.appendChild(answerButton);
    document.body.appendChild(infoBox);
    document.body.appendChild(centerBox);

// Thêm sự kiện cho việc kéo bảng thông báo
let isDraggingInfoBox = false;
let infoBoxOffsetX, infoBoxOffsetY;

infoBox.addEventListener('mousedown', (e) => {
    isDraggingInfoBox = true;
    infoBoxOffsetX = e.clientX - infoBox.getBoundingClientRect().left;
    infoBoxOffsetY = e.clientY - infoBox.getBoundingClientRect().top;
    document.body.style.userSelect = 'none'; // Ngăn chặn chọn văn bản khi kéo
});

document.addEventListener('mousemove', (e) => {
    if (isDraggingInfoBox) {
        // Cập nhật vị trí bảng thông báo
        infoBox.style.left = `${e.clientX - infoBoxOffsetX}px`;
        infoBox.style.top = `${e.clientY - infoBoxOffsetY}px`;
        infoBox.style.right = 'auto'; // Bỏ giá trị right để có thể di chuyển tự do
    }
});

document.addEventListener('mouseup', () => {
    isDraggingInfoBox = false;
    document.body.style.userSelect = ''; // Cho phép chọn văn bản lại
});

// Tạo tiêu đề cho bảng với tên người dùng
const titleBar = document.createElement('div');
titleBar.style.fontWeight = 'bold';
titleBar.style.marginBottom = '10px';
titleBar.innerHTML = `Dò Đáp Án (<span style="color: black; font-weight: bold;">${nameText}</span>)`; // Chèn tên ngẫu nhiên màu đen vào

// Tạo nút Dò và hiển thị đáp án cạnh nhau
const checkButtonContainer = document.createElement('div');
checkButtonContainer.style.display = 'flex'; // Bố trí theo hàng ngang

// Nút dò
const checkButton = document.createElement('button');
checkButton.innerText = 'Dò';
checkButton.style.marginTop = '10px';
checkButton.style.padding = '5px 10px';
checkButton.style.cursor = 'pointer';
checkButton.style.border = '2px solid #003366'; // Viền màu xanh dương đậm
checkButton.style.borderRadius = '5px'; // Bo tròn góc
checkButton.style.backgroundColor = 'white'; // Nền trắng
checkButton.style.transition = 'border-color 0.3s, background-color 0.3s'; // Hiệu ứng chuyển màu viền và nền

// Hàm để đổi màu viền RGB
let hue = 0;
function changeBorderColor() {
    hue = (hue + 1) % 360; // Giới hạn giá trị hue từ 0 đến 360
    checkButton.style.borderColor = `hsl(${hue}, 100%, 50%)`; // Thiết lập màu viền
}

// Bắt đầu đổi màu viền liên tục
setInterval(changeBorderColor, 100); // Đổi màu viền mỗi 100ms

// Thêm hiệu ứng hover cho nút
checkButton.onmouseover = () => {
    checkButton.style.backgroundColor = '#f0f0f0'; // Màu nền khi hover
};

checkButton.onmouseout = () => {
    checkButton.style.backgroundColor = 'white'; // Màu nền lại khi không hover
};

// Thêm nút vào document
infoBox.appendChild(checkButton); // Giả sử bạn đã tạo infoBox trước đó

const answerDisplay = document.createElement('div');
answerDisplay.style.marginLeft = '10px'; // Khoảng cách giữa nút Dò và đáp án
answerDisplay.style.fontWeight = 'bold';
answerDisplay.style.color = 'green';

checkButtonContainer.appendChild(checkButton);
checkButtonContainer.appendChild(answerDisplay);

// Thêm bảng thông báo vào body
document.body.appendChild(infoBox);

// Tạo nút mở/đóng nằm bên ngoài bảng
const externalToggleButton = document.createElement('button');
externalToggleButton.innerText = 'Mở/Đóng Dò Đáp Án';
externalToggleButton.style.position = 'fixed';
externalToggleButton.style.top = '10px';
externalToggleButton.style.right = '10px';
externalToggleButton.style.padding = '5px 10px';
externalToggleButton.style.cursor = 'pointer';
externalToggleButton.style.zIndex = '10000';
externalToggleButton.style.border = '3px solid #003366'; // Viền màu xanh dương đậm
externalToggleButton.style.borderRadius = '5px'; // Bo tròn góc cho nút
externalToggleButton.style.backgroundColor = 'white'; // Nền trắng cho nút
externalToggleButton.style.transition = 'background-color 0.3s'; // Hiệu ứng chuyển màu nền khi hover

// Thêm hiệu ứng hover cho nút
externalToggleButton.onmouseover = () => {
    externalToggleButton.style.backgroundColor = '#f0f0f0'; // Màu nền khi hover
};
externalToggleButton.onmouseout = () => {
    externalToggleButton.style.backgroundColor = 'white'; // Màu nền lại khi không hover
};

// Cho phép di chuyển nút bằng chuột
let isDraggingButton = false;
let buttonOffsetX, buttonOffsetY;

externalToggleButton.addEventListener('mousedown', (e) => {
    isDraggingButton = true;
    buttonOffsetX = e.clientX - externalToggleButton.getBoundingClientRect().left;
    buttonOffsetY = e.clientY - externalToggleButton.getBoundingClientRect().top;
    document.body.style.userSelect = 'none'; // Ngăn chặn chọn văn bản khi kéo
});

document.addEventListener('mousemove', (e) => {
    if (isDraggingButton) {
        // Cập nhật vị trí nút
        externalToggleButton.style.left = `${e.clientX - buttonOffsetX}px`;
        externalToggleButton.style.top = `${e.clientY - buttonOffsetY}px`;
        externalToggleButton.style.right = 'auto'; // Bỏ giá trị right để có thể di chuyển tự do
    }
});

document.addEventListener('mouseup', () => {
    isDraggingButton = false;
    document.body.style.userSelect = ''; // Cho phép chọn văn bản lại
});

// Thêm nút vào body
document.body.appendChild(externalToggleButton);


    // Tạo checkbox tùy chọn tự động dò đáp án
    const autoCheckLabel = document.createElement('label');
    autoCheckLabel.style.display = 'block';
    autoCheckLabel.style.marginTop = '10px';
    autoCheckLabel.innerHTML = 'Tự động dò đáp án + AUTO'; // Thêm " + AUTO"

    const autoCheckBox = document.createElement('input');
    autoCheckBox.type = 'checkbox';
    autoCheckBox.style.marginLeft = '5px';

    autoCheckLabel.appendChild(autoCheckBox);

    // Hàm kiểm tra câu hỏi hiện tại để reset khi thay đổi
    function checkCurrentQuestion(iframeDoc) {
        const questionElement = iframeDoc.querySelector(".h5p-question-content");
        if (questionElement) {
            const newQuestion = questionElement.innerText || ""; // Lấy nội dung câu hỏi hiện tại
            if (newQuestion !== currentQuestion) {
                currentQuestion = newQuestion;
                hasCopied = false; // Reset biến khi câu hỏi thay đổi
                answerDisplay.innerHTML = ""; // Xóa nội dung hiển thị đáp án
            }
        }
    }

function findCorrectAnswer() {
    const iframe = document.querySelector('iframe'); // Select the first iframe on the page
    if (!iframe) {
        answerDisplay.innerHTML = 'Không tìm thấy iframe.'; // If iframe not found, show an error
        return;
    }

    const iframeDoc = iframe.contentDocument || iframe.contentWindow.document; // Access the iframe's content

    checkCurrentQuestion(iframeDoc); // Check if the question has changed

    if (hasCopied) return; // Prevent rechecking if the answer has already been found

    // Function to periodically check for the correct answer
    function periodicCheck() {
        let correctAnswer = iframeDoc.querySelector(
            "body > div > div > div > div.h5p-column-content.h5p-question.h5p-single-choice-set > div.h5p-question-content > div > div.h5p-sc-set.h5p-sc-animate > div.h5p-sc-slide.h5p-sc.h5p-sc-current-slide > ul > li.h5p-sc-alternative.h5p-sc-is-correct"
        );

        if (!correctAnswer) {
            // If the correct answer is not found, keep checking with other known paths
            correctAnswer = iframeDoc.querySelector(
                "body > div > div > div.h5p-question-content > div > div.h5p-sc-set.h5p-sc-animate > div.h5p-sc-slide.h5p-sc.h5p-sc-current-slide > ul > li.h5p-sc-alternative.h5p-sc-is-correct"
            );
        }

        if (!correctAnswer) {
            correctAnswer = iframeDoc.querySelector(
                "body > div > div > div.h5p-video-wrapper.h5p-video.hardware-accelerated > div > div > div > div > div.h5p-question-content > div > div.h5p-sc-set.h5p-sc-animate > div.h5p-sc-slide.h5p-sc.h5p-sc-current-slide > ul > li.h5p-sc-alternative.h5p-sc-is-correct"
            );
        }

        if (!correctAnswer) {
            correctAnswer = iframeDoc.querySelector(
                "body > div > div > div > div.h5p-column-content.h5p-question.h5p-single-choice-set > div.h5p-question-content > div > div.h5p-sc-set.h5p-sc-animate > div.h5p-sc-slide.h5p-sc.h5p-sc-current-slide > ul > li.h5p-sc-alternative.h5p-sc-is-correct"
            );
        }

        if (!correctAnswer) {
            correctAnswer = iframeDoc.querySelector(
                "body > div > div > div.h5p-question-content > div > div.h5p-sc-set.h5p-sc-animate > div.h5p-sc-slide.h5p-sc.h5p-sc-current-slide > ul > li.h5p-sc-alternative.h5p-sc-is-correct"
            );
        }

        if (!correctAnswer) {
            correctAnswer = iframeDoc.querySelector(
                "body > div > div > div.h5p-dialog-wrapper.h5p-ie-transparent-background > div > div.h5p-dialog-inner > div > div.h5p-question-content > div > div.h5p-sc-set.h5p-sc-animate > div.h5p-sc-slide.h5p-sc.h5p-sc-current-slide > ul > li.h5p-sc-alternative.h5p-sc-is-correct"
            );
        }

        if (!correctAnswer) {
            correctAnswer = iframeDoc.querySelector(
                "body > div > div > div.h5p-dialog-wrapper.h5p-ie-transparent-background > div > div.h5p-dialog-inner > div > div.h5p-question-content > div > div.h5p-sc-set.h5p-sc-animate > div.h5p-sc-slide.h5p-sc.h5p-sc-current-slide > ul > li.h5p-sc-alternative.h5p-sc-is-correct"
            );
        }

        if (!correctAnswer) {
            correctAnswer = iframeDoc.querySelector(
                "body > div > div > div.h5p-dialog-wrapper.h5p-ie-transparent-background > div > div.h5p-dialog-inner > div > div.h5p-question-content > div > div.h5p-sc-set.h5p-sc-animate > div.h5p-sc-slide.h5p-sc.h5p-sc-current-slide > ul > li.h5p-sc-alternative.h5p-sc-is-correct"
            );
        }

        if (correctAnswer) {
            const answerText = correctAnswer.querySelector('.h5p-sc-label, .h5p-true-false-answer.correct')?.innerText || '';

            if (autoCheckEnabled) {
                correctAnswer.click(); // Auto-select the correct answer if the auto-check is enabled
            }

            // Check if there's an image associated with the answer
            const imgElement = correctAnswer.querySelector('img');
            if (imgElement) {
                const imgSrc = imgElement.src;

                if (imgSrc.startsWith('data:image/svg+xml')) {
                    const svgImage = document.createElement('img');
                    svgImage.src = imgSrc;
                    svgImage.style.maxWidth = '50px'; // Adjust the max width of the image
                    svgImage.style.marginLeft = '10px'; // Add some margin between the text and image

                    const textNode = document.createTextNode(`Đáp án: ${answerText} - Hình ảnh: `);
                    answerDisplay.appendChild(textNode);
                    answerDisplay.appendChild(svgImage);
                } else {
                    answerDisplay.innerHTML = `Đáp án: ${answerText} - Ảnh không phải SVG.`;
                }
            } else {
                answerDisplay.innerHTML = `Đáp án: ${answerText}`; // Display the correct answer
            }

            hasCopied = true; // Mark as answer found
        } else {
            answerDisplay.innerHTML = 'Không tìm thấy đáp án. Tiếp tục dò...'; // Display that it's still searching
            setTimeout(periodicCheck, 1000); // Retry after 1 second if the answer isn't found
        }
    }

    // Start checking for the correct answer periodically
    periodicCheck();
}



    // Khi nhấn nút Dò, thực hiện tìm kiếm đáp án
    checkButton.onclick = findCorrectAnswer;

    // Khi nhấn nút mở/đóng bảng
    externalToggleButton.onclick = function() {
        isPanelOpen = !isPanelOpen;
        if (isPanelOpen) {
            infoBox.style.maxHeight = '500px'; // Mở bảng
            infoBox.style.opacity = '1';
        } else {
            infoBox.style.maxHeight = '0'; // Đóng bảng
            infoBox.style.opacity = '0';
        }
    };

// Khi nhấn checkbox tự động dò đáp án
autoCheckBox.onchange = function() {
    autoCheckEnabled = autoCheckBox.checked; // Cập nhật trạng thái tự động dò
    if (autoCheckEnabled) {
        // Tự động dò nếu tùy chọn được bật
        const autoCheckInterval = setInterval(findCorrectAnswer, 1000); // Dò lại sau mỗi giây

        // Dừng tự động dò khi tắt checkbox
        autoCheckBox.onchange = function() {
            autoCheckEnabled = autoCheckBox.checked; // Cập nhật trạng thái tự động dò
            if (!autoCheckEnabled) {
                clearInterval(autoCheckInterval); // Dừng việc dò
            }
        };
    }
};


    titleBar.onmousedown = function(e) {
        isDragging = true;
        offsetX = e.clientX - infoBox.getBoundingClientRect().left;
        offsetY = e.clientY - infoBox.getBoundingClientRect().top;
    };

    document.onmousemove = function(e) {
        if (isDragging) {
            infoBox.style.left = `${e.clientX - offsetX}px`;
            infoBox.style.top = `${e.clientY - offsetY}px`;
        }
    };

    document.onmouseup = function() {
        isDragging = false;
    };

    // Thêm các phần tử vào trang
    infoBox.appendChild(titleBar);
    infoBox.appendChild(checkButtonContainer);
    infoBox.appendChild(autoCheckLabel);
    document.body.appendChild(infoBox);
    document.body.appendChild(externalToggleButton);
})();
