function getRandomNum(min, max) {
  if (min >= max) {
    throw new Error("Min must be less than max");
  }
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * 模拟用户输入填充input元素
 * @param {HTMLInputElement} inputElement - 输入框元素
 * @param {string|number} value - 要填充的值
 */
function fillFormInput(inputElement, value) {
  let index = 0;
  value = value.toString();
  inputElement.value = "";

  // 使用文档片段减少DOM操作
  const docFragment = document.createDocumentFragment();
  const intervalId = setInterval(() => {
    if (index < value.length) {
      docFragment.textContent += value[index];
      inputElement.value = docFragment.textContent;
      const inputEvent = new Event("input", { bubbles: true });
      inputElement.dispatchEvent(inputEvent);
      index++;
    } else {
      clearInterval(intervalId);
    }
  }, 100);
}

function getRandomCharFrom(str) {
  const randomIndex = Math.floor(Math.random() * str.length);
  return str.charAt(randomIndex);
}

const leftKeyboardChars = "1234567890qwertyuiop[]asdfghjkl;'zxcvbnm,./";

function getRandomLeftKeyboardChar() {
  return getRandomCharFrom(leftKeyboardChars);
}
