// ==UserScript==
// @name         Auto Gmail Registration
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  Tự động đăng ký Gmail giả lập hành vi người dùng
// @author       You
// @match        https://accounts.google.com/*
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/541721/Auto%20Gmail%20Registration.user.js
// @updateURL https://update.greasyfork.org/scripts/541721/Auto%20Gmail%20Registration.meta.js
// ==/UserScript==

(function() {
    'use strict';

    /**
 * Auto Gmail Registration Script
 * Mô phỏng hành vi người dùng thực khi đăng ký tài khoản Gmail
 *
 * Hướng dẫn sử dụng:
 * 1. Mở trang đăng ký Gmail: https://accounts.google.com/signup
 * 2. Mở DevTools (F12) và chuyển sang tab Console
 * 3. Dán toàn bộ mã này vào Console và nhấn Enter
 * 4. Script sẽ tự động điền thông tin và tiến hành đăng ký
 */

// Cấu hình
const CONFIG = {
  // Thời gian chờ tối đa cho trang tải (ms)
  pageLoadTimeout: 15000,
  // Số lần thử lại khi gặp lỗi
  maxRetries: 3,
  // Ngôn ngữ ưu tiên (vi hoặc en)
  preferredLanguage: 'vi',
  // Tỷ lệ chọn giới tính nam (0-1)
  maleRatio: 0.7,
  // Độ tuổi ngẫu nhiên
  minAge: 18,
  maxAge: 40,
  // Ghi log chi tiết
  verboseLogging: true
};

// Danh sách họ và tên phổ biến Việt Nam
const hoViet = ["Nguyễn", "Trần", "Lê", "Phạm", "Hoàng", "Huỳnh", "Phan", "Vũ", "Võ", "Đặng", "Bùi", "Đỗ", "Hồ", "Ngô", "Dương", "Lý"];
const tenViet = ["Anh", "Bình", "Chi", "Dũng", "Dung", "Hải", "Hạnh", "Hòa", "Huy", "Khoa", "Khánh", "Lan", "Linh", "Mai", "Minh", "Nam", "Ngọc", "Phúc", "Quân", "Quyên", "Sơn", "Tâm", "Thảo", "Thành", "Thắng", "Thu", "Trang", "Trung", "Tuấn", "Vy"];

// Lưu trữ thông tin đăng ký
const registrationInfo = {
  firstName: '',
  lastName: '',
  birthDay: '',
  birthMonth: '',
  birthYear: '',
  gender: '',
  username: '',
  password: '',
  recoveryEmail: '',
  phoneNumber: ''
};

// Hàm tiện ích
function random(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min, max) {
  return Math.floor(min + Math.random() * (max - min + 1));
}

function delay(minMs, maxMs) {
  const ms = minMs + Math.random() * (maxMs - minMs);
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Mô phỏng hành vi người dùng
async function moveMouseRandomly(element) {
  if (!element) return;

  // Mô phỏng di chuyển chuột không hoàn hảo
  const rect = element.getBoundingClientRect();
  const centerX = rect.left + rect.width / 2;
  const centerY = rect.top + rect.height / 2;

  // Tạo điểm đích ngẫu nhiên gần trung tâm phần tử
  const targetX = centerX + randomInt(-10, 10);
  const targetY = centerY + randomInt(-5, 5);

  // Giả lập di chuyển chuột
  const mouseEvent = new MouseEvent('mousemove', {
    bubbles: true,
    clientX: targetX,
    clientY: targetY
  });

  element.dispatchEvent(mouseEvent);
  await delay(50, 150);
}

// Hàm gõ từng ký tự như người thật
async function typeLikeHuman(element, text) {
  if (!element) return false;

  // Di chuyển chuột đến phần tử trước khi gõ
  await moveMouseRandomly(element);

  // Focus vào phần tử
  element.focus();
  element.value = '';

  // Thỉnh thoảng dừng lại giữa chừng khi gõ
  for (let i = 0; i < text.length; i++) {
    // Thêm ký tự
    element.value += text[i];
    element.dispatchEvent(new Event('input', { bubbles: true }));

    // Tốc độ gõ không đều
    const typingSpeed = randomInt(80, 200);
    await delay(typingSpeed, typingSpeed + 50);

    // Thỉnh thoảng dừng lại như đang suy nghĩ
    if (i > 0 && i < text.length - 1 && Math.random() < 0.1) {
      await delay(300, 800);
    }
  }

  return true;
}

// Hàm nhấp chuột như người thật
async function clickLikeHuman(element) {
  if (!element) return false;

  // Di chuyển chuột đến phần tử
  await moveMouseRandomly(element);

  // Đôi khi cuộn đến phần tử trước khi nhấp
  if (Math.random() < 0.7) {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    await delay(300, 700);
  }

  // Nhấp chuột
  element.click();
  return true;
}

// Hàm chọn từ dropdown như người thật
async function selectFromDropdown(dropdownSelector, optionValue) {
  const dropdown = document.querySelector(dropdownSelector);
  if (!dropdown) return false;

  // Mở dropdown
  await clickLikeHuman(dropdown);
  await delay(200, 500);

  // Chọn option
  return new Promise(resolve => {
    setTimeout(async () => {
      const options = document.querySelectorAll(`${dropdownSelector.split(' ')[0]} [role="listbox"] li`);

      if (options.length > 0) {
        let targetOption;

        if (typeof optionValue === 'number' && optionValue >= 0 && optionValue < options.length) {
          targetOption = options[optionValue];
        } else if (typeof optionValue === 'string') {
          for (const option of options) {
            if (option.innerText.includes(optionValue)) {
              targetOption = option;
              break;
            }
          }
        }

        if (targetOption) {
          await clickLikeHuman(targetOption);
          resolve(true);
        } else {
          resolve(false);
        }
      } else {
        resolve(false);
      }
    }, randomInt(300, 600));
  });
}

// Hàm tìm và nhấn nút Next
async function findAndClickNextButton() {
  // Tìm nút Next/Tiếp theo dựa trên nhiều selector khác nhau
  const selectors = [
    'button span.VfPpkd-vQzf8d',
    'span.VfPpkd-vQzf8d',
    'button[type="submit"]',
    'button.VfPpkd-LgbsSe-OWXEXe-k8QpJ'
  ];

  // Các từ khóa có thể xuất hiện trên nút (hỗ trợ đa ngôn ngữ)
  const nextButtonTexts = ['Next', 'Tiếp theo', 'Tiếp tục', 'Continue'];

  for (const selector of selectors) {
    const elements = document.querySelectorAll(selector);
    for (const element of elements) {
      const elementText = element.textContent.trim();
      const buttonText = element.closest('button')?.innerText.trim() || '';

      // Kiểm tra nếu text của element hoặc button chứa bất kỳ từ khóa nào
      const isNextButton = nextButtonTexts.some(text =>
        elementText === text ||
        buttonText === text ||
        elementText.includes(text) ||
        buttonText.includes(text)
      );

      if (isNextButton) {
        const buttonToClick = element.closest('button') || element;
        const result = await clickLikeHuman(buttonToClick);

        if (result) {
          console.log(`✅ Đã nhấn nút ${elementText || buttonText}`);
          return true;
        }
      }
    }
  }

  // Thử tìm nút dựa trên class đặc biệt
  const specialButtons = document.querySelectorAll('button.VfPpkd-LgbsSe-OWXEXe-k8QpJ');
  for (const button of specialButtons) {
    if (button.innerText) {
      const result = await clickLikeHuman(button);
      if (result) {
        console.log(`✅ Đã nhấn nút ${button.innerText.trim()}`);
        return true;
      }
    }
  }

  console.log('❌ Không tìm thấy nút Next/Tiếp theo');
  return false;
}

// Hàm tạo mật khẩu mạnh ngẫu nhiên
function generateStrongPassword() {
  const lowercase = 'abcdefghijkmnopqrstuvwxyz';
  const uppercase = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const numbers = '23456789';
  const symbols = '!@#$%^&*';

  // Tạo mật khẩu với ít nhất 1 ký tự từ mỗi loại
  let password = '';
  password += lowercase.charAt(Math.floor(Math.random() * lowercase.length));
  password += uppercase.charAt(Math.floor(Math.random() * uppercase.length));
  password += numbers.charAt(Math.floor(Math.random() * numbers.length));
  password += symbols.charAt(Math.floor(Math.random() * symbols.length));

  // Thêm các ký tự ngẫu nhiên cho đủ độ dài 10-16 ký tự
  const allChars = lowercase + uppercase + numbers + symbols;
  const length = randomInt(8, 12); // Tổng cộng sẽ là 12-16 ký tự

  for (let i = 0; i < length; i++) {
    password += allChars.charAt(Math.floor(Math.random() * allChars.length));
  }

  // Xáo trộn mật khẩu
  return password.split('').sort(() => 0.5 - Math.random()).join('');
}

// Hàm tạo tên người dùng Gmail ngẫu nhiên
function generateUsername(firstName, lastName) {
  const separators = ['', '.', '_'];
  const separator = random(separators);

  // Loại bỏ dấu tiếng Việt
  const normalizedFirstName = firstName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  const normalizedLastName = lastName.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

  // Tạo các biến thể tên người dùng độc đáo
  const randomSuffix = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 4; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  };

  const variants = [
    `${normalizedFirstName}${separator}${normalizedLastName}${randomSuffix()}`,
    `${normalizedLastName}${separator}${normalizedFirstName}${randomSuffix()}`,
    `${normalizedFirstName}${separator}${randomSuffix()}${randomInt(1, 99)}`,
    `${normalizedFirstName.charAt(0)}${separator}${normalizedLastName}${randomSuffix()}`,
    `${randomSuffix()}${separator}${normalizedFirstName}${randomInt(1, 999)}`,
  ];

  return random(variants);
}

// Hàm điền thông tin ngày sinh và giới tính
async function fillBirthdayAndGender() {
  // Tạo ngày sinh hợp lệ
  const currentYear = new Date().getFullYear();
  const minAge = CONFIG.minAge;
  const maxAge = CONFIG.maxAge;
  const year = randomInt(currentYear - maxAge, currentYear - minAge);
  const month = randomInt(1, 12);
  const day = randomInt(1, 28); // Để an toàn, chọn đến ngày 28 thôi

  // Lưu thông tin vào đối tượng registrationInfo
  registrationInfo.birthDay = day;
  registrationInfo.birthMonth = month;
  registrationInfo.birthYear = year;

  console.log(`📅 Ngày sinh: ${day}/${month}/${year}`);

  // Điền ngày - hỗ trợ cả tiếng Anh và tiếng Việt
  const dayInput = document.querySelector('input[aria-label="Day"], input[aria-label="Ngày"]');
  if (dayInput) {
    await typeLikeHuman(dayInput, day.toString());
    await delay(300, 700);
  }

  // Điền năm - hỗ trợ cả tiếng Anh và tiếng Việt
  const yearInput = document.querySelector('input[aria-label="Year"], input[aria-label="Năm"]');
  if (yearInput) {
    await typeLikeHuman(yearInput, year.toString());
    await delay(400, 800);
  }

  // Chọn tháng từ dropdown - hỗ trợ cả tiếng Anh và tiếng Việt
  await selectFromDropdown('#month [role="combobox"]', month - 1);
  await delay(500, 1000);

  // Chọn giới tính từ dropdown (hỗ trợ cả tiếng Anh và tiếng Việt)
  const genderOptions = {
    vi: ['Nam', 'Nữ'],
    en: ['Male', 'Female']
  };

  // Xác định giới tính dựa trên tỷ lệ nam đã cấu hình
  const isMale = Math.random() < CONFIG.maleRatio;

  // Lưu giới tính vào registrationInfo theo tiếng Việt để hiển thị log
  registrationInfo.gender = isMale ? 'Nam' : 'Nữ';

  // Tìm dropdown giới tính
  const genderDropdown = document.querySelector('#gender [role="combobox"]');
  if (!genderDropdown) {
    console.log('❌ Không tìm thấy dropdown giới tính');
    return false;
  }

  // Xác định ngôn ngữ hiện tại của form dựa trên các option có sẵn
  const dropdownText = genderDropdown.textContent.trim();
  const isEnglishForm = dropdownText.includes('Gender') ||
                       document.querySelector('#gender li[role="option"]')?.textContent.includes('Male');

  // Chọn giới tính phù hợp với ngôn ngữ của form
  const genderToSelect = isEnglishForm ?
    (isMale ? 'Male' : 'Female') :
    (isMale ? 'Nam' : 'Nữ');

  const success = await selectFromDropdown('#gender [role="combobox"]', genderToSelect);

   if (success) {
     console.log(`👤 Giới tính: ${registrationInfo.gender}`);
     return true;
   }

   console.log('❌ Không thể chọn giới tính');
   return false;
}

// Hàm điền thông tin tên người dùng và mật khẩu
async function fillUsernameAndPassword() {
  // Tạo tên người dùng Gmail
  const username = generateUsername(registrationInfo.firstName, registrationInfo.lastName);
  registrationInfo.username = username;
  console.log(`📧 Tên người dùng: ${username}`);

  // Tìm và điền vào ô tên người dùng
  const usernameInput = document.querySelector('input[name="Username"], input[aria-label="Username"]');
  if (!usernameInput) {
    console.log('❌ Không tìm thấy ô input tên người dùng');
    return false;
  }

  let maxAttempts = 5; // Số lần thử tối đa
  let attempt = 0;

  while (attempt < maxAttempts) {
    attempt++;

    // Tạo và điền username mới
    const currentUsername = attempt === 1 ? username : generateUsername(registrationInfo.firstName, registrationInfo.lastName);
    registrationInfo.username = currentUsername;
    console.log(`📧 Thử tên người dùng (lần ${attempt}): ${currentUsername}`);

    await typeLikeHuman(usernameInput, currentUsername);
    await delay(500, 1000);

    // Nhấn Next sau khi điền tên người dùng
    const nextClicked = await findAndClickNextButton();
    if (!nextClicked) {
      console.log('❌ Không thể tiếp tục sau khi điền tên người dùng');
      return false;
    }

    // Đợi trang tải
    await waitForPageLoad(CONFIG.pageLoadTimeout);

    // Kiểm tra thông báo lỗi ký tự không hợp lệ
    const invalidCharsError = document.querySelector('.bfzBdd .Ekjuhf.Jj6Lae');
    if (!invalidCharsError) {
      // Không tìm thấy lỗi ký tự không hợp lệ, kiểm tra các lỗi khác
      const errorMessage = await checkForErrors();
      if (!errorMessage) {
        console.log('✅ Tên người dùng hợp lệ');
        await delay(800, 1500);
        break;
      }
      console.log(`❌ Lỗi sau khi điền tên người dùng: ${errorMessage}`);
      return false;
    }

    console.log('⚠️ Tên người dùng chứa ký tự không hợp lệ, thử lại...');
    await delay(800, 1500);

    // Xóa nội dung ô input để thử lại
    usernameInput.value = '';
    usernameInput.dispatchEvent(new Event('input', { bubbles: true }));
    await delay(300, 600);
  }

  if (attempt >= maxAttempts) {
    console.log(`❌ Đã thử ${maxAttempts} lần nhưng không tìm được tên người dùng hợp lệ`);
    return false;
  }

  // Tạo mật khẩu mạnh
  const password = generateStrongPassword();
  registrationInfo.password = password;
  console.log(`🔑 Mật khẩu: ${password}`);

  // Tìm và điền vào các ô mật khẩu
  const passwordInputs = document.querySelectorAll('input[type="password"]');
  if (passwordInputs.length >= 2) {
    // Điền mật khẩu
    await typeLikeHuman(passwordInputs[0], password);
    await delay(500, 1000);

    // Điền xác nhận mật khẩu
    await typeLikeHuman(passwordInputs[1], password);
    await delay(400, 800);

    // Nhấn Next sau khi điền mật khẩu
    const nextClicked = await findAndClickNextButton();
    if (!nextClicked) {
      console.log('❌ Không thể tiếp tục sau khi điền mật khẩu');
      return false;
    }

    // Đợi trang tải và kiểm tra lỗi
    await waitForPageLoad(CONFIG.pageLoadTimeout);
    const errorMessage = await checkForErrors();
    if (errorMessage) {
      console.log(`❌ Lỗi sau khi điền mật khẩu: ${errorMessage}`);
      return false;
    }

    await delay(800, 1500);
  } else {
    console.log('❌ Không tìm thấy đủ ô input mật khẩu');
    return false;
  }

  return true;
}

// Hàm kiểm tra xem trang có đang hiển thị lỗi không
async function checkForErrors() {
  // Các selector phổ biến cho thông báo lỗi
  const errorSelectors = [
    '.o6cuMc', // Selector lỗi phổ biến của Google
    '.OyEIQ', // Selector lỗi khác
    '[role="alert"]',
    '.error-message',
    '.alert-error'
  ];

  for (const selector of errorSelectors) {
    const errorElements = document.querySelectorAll(selector);
    for (const element of errorElements) {
      if (element.offsetParent !== null) { // Kiểm tra xem phần tử có hiển thị không
        const errorText = element.textContent.trim();
        if (errorText) {
          console.log(`⚠️ Phát hiện lỗi: ${errorText}`);
          return errorText;
        }
      }
    }
  }

  return null;
}

// Hàm chờ trang tải xong
async function waitForPageLoad(timeout = 10000) {
  console.log('⏳ Đang chờ trang tải...');

  const startTime = Date.now();

  while (Date.now() - startTime < timeout) {
    // Kiểm tra xem có spinner loading không
    const spinners = document.querySelectorAll('.VfPpkd-JGcpL-P1ekSe, .RxsGPe');
    let isLoading = false;

    for (const spinner of spinners) {
      if (spinner.offsetParent !== null) {
        isLoading = true;
        break;
      }
    }

    if (!isLoading) {
      // Đợi thêm một chút để đảm bảo trang đã tải xong
      await delay(300, 500);
      console.log('✅ Trang đã tải xong');
      return true;
    }

    await delay(200, 300);
  }

  console.log('⚠️ Hết thời gian chờ trang tải');
  return false;
}

// Hàm lưu thông tin đăng ký vào file hoặc localStorage
function saveRegistrationInfo() {
  try {
    // Tạo chuỗi thông tin đăng ký
    const info = {
      ...registrationInfo,
      timestamp: new Date().toISOString(),
      status: 'completed'
    };

    // Lưu vào localStorage
    const savedAccounts = JSON.parse(localStorage.getItem('gmailAccounts') || '[]');
    savedAccounts.push(info);
    localStorage.setItem('gmailAccounts', JSON.stringify(savedAccounts));

    // In thông tin ra console để copy
    console.log('📋 THÔNG TIN TÀI KHOẢN ĐÃ ĐĂNG KÝ:');
    console.log(JSON.stringify(info, null, 2));

    return true;
  } catch (error) {
    console.error('❌ Lỗi khi lưu thông tin đăng ký:', error);
    return false;
  }
}

// Hàm xử lý bước xác minh số điện thoại (nếu có)
async function handlePhoneVerification() {
  // Kiểm tra xem có yêu cầu xác minh số điện thoại không
  const phoneInputs = document.querySelectorAll('input[type="tel"]');
  if (phoneInputs.length > 0) {
    console.log('⚠️ Phát hiện yêu cầu xác minh số điện thoại');
    console.log('ℹ️ Bạn cần nhập số điện thoại thủ công để tiếp tục');

    // Đợi người dùng nhập số điện thoại thủ công
    return new Promise(resolve => {
      const checkInterval = setInterval(() => {
        // Kiểm tra xem đã chuyển sang màn hình tiếp theo chưa
        if (!document.querySelector('input[type="tel"]')) {
          clearInterval(checkInterval);
          resolve(true);
        }
      }, 1000);

      // Timeout sau 5 phút
      setTimeout(() => {
        clearInterval(checkInterval);
        resolve(false);
      }, 5 * 60 * 1000);
    });
  }

  return true;
}

// Quy trình đăng ký chính
async function autoRegisterGmail() {
  try {
    console.log('🚀 Bắt đầu quy trình đăng ký Gmail...');

    // Bước 1: Điền họ và tên
    const ho = random(hoViet);
    const ten = random(tenViet);

    // Lưu thông tin vào đối tượng registrationInfo
    registrationInfo.lastName = ho;
    registrationInfo.firstName = ten;

    console.log(`👤 Tên người dùng: ${ho} ${ten}`);

    const lastNameInput = document.querySelector('#lastName');
    const firstNameInput = document.querySelector('#firstName');

    if (!lastNameInput || !firstNameInput) {
      console.log("❌ Không tìm thấy ô input họ tên.");
      return;
    }

    // Điền họ và tên với độ trễ tự nhiên
    await typeLikeHuman(lastNameInput, ho);
    await delay(400, 900);
    await typeLikeHuman(firstNameInput, ten);
    await delay(500, 1200);

    // Nhấn Next để chuyển sang form tiếp theo
    const nextClicked = await findAndClickNextButton();
    if (!nextClicked) {
      console.log('❌ Không thể tiếp tục vì không tìm thấy nút Next/Tiếp theo');
      return;
    }

    // Kiểm tra lỗi
    await waitForPageLoad(CONFIG.pageLoadTimeout);
    const errorMessage = await checkForErrors();
    if (errorMessage) {
      console.log(`❌ Quá trình đăng ký bị dừng do lỗi: ${errorMessage}`);
      return;
    }

    // Bước 2: Điền ngày sinh và giới tính
    await delay(1000, 2000); // Đợi form mới load
    await fillBirthdayAndGender();
    await delay(800, 1500);

    // Nhấn Next để tiếp tục
    const nextClicked2 = await findAndClickNextButton();
    if (!nextClicked2) {
      console.log('❌ Không thể tiếp tục vì không tìm thấy nút Next/Tiếp theo');
      return;
    }

    // Kiểm tra lỗi sau khi nhấn Next lần 2
    await waitForPageLoad(CONFIG.pageLoadTimeout);
    const errorMessage2 = await checkForErrors();
    if (errorMessage2) {
      console.log(`❌ Quá trình đăng ký bị dừng do lỗi: ${errorMessage2}`);
      return;
    }

    // Bước 3: Chọn tùy chọn "Tạo địa chỉ Gmail của riêng bạn" nếu có
    await delay(1000, 2000);
    const customGmailOption = document.querySelector('.sfqPrd input[type="radio"][value="custom"]');
    if (customGmailOption) {
      console.log('🔄 Chọn tùy chọn tạo địa chỉ Gmail tùy chỉnh...');
      await clickLikeHuman(customGmailOption);
      await delay(500, 1000);
    }

    // Điền tên người dùng và mật khẩu
    const usernamePasswordFilled = await fillUsernameAndPassword();
    if (!usernamePasswordFilled) {
      console.log('❌ Không thể hoàn thành quá trình điền thông tin đăng nhập');
      return;
    }

    // Bước 4: Xử lý xác minh số điện thoại (nếu có)
    await delay(1000, 2000);
    const phoneVerified = await handlePhoneVerification();
    if (!phoneVerified) {
      console.log('⚠️ Không thể hoàn thành xác minh số điện thoại');
      // Vẫn tiếp tục vì có thể đã đăng ký thành công
    }

    // Lưu thông tin đăng ký
    saveRegistrationInfo();

    console.log('✅ Hoàn thành quy trình đăng ký Gmail!');
    console.log(`📧 Tài khoản: ${registrationInfo.username}@gmail.com`);
    console.log(`🔑 Mật khẩu: ${registrationInfo.password}`);

  } catch (error) {
    console.error('❌ Lỗi trong quá trình đăng ký:', error);
  }
}

// Khởi chạy quy trình
autoRegisterGmail();
})();