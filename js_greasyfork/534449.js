// useKeyPress.js

function useKeyPress(targetKey, callback) {
  // 이벤트 리스너 함수
  function handleKeyPress(event) {
    if (event.key === targetKey) {
      callback(event);  // 해당 키가 눌렸을 때 콜백 호출
    }
  }

  // 'keydown' 이벤트 리스너 등록
  document.addEventListener('keydown', handleKeyPress);

  // 반환된 객체에 이벤트 리스너를 제거하는 함수 포함
  return () => {
    document.removeEventListener('keydown', handleKeyPress);
  };
}

// useKeyPress.js

function useKeysPress(targetKeys, callback) {
  // 눌린 키를 추적할 Set 객체
  const pressedKeys = new Set();

  // 'keydown' 이벤트 리스너 함수
  function handleKeyDown(event) {
    pressedKeys.add(event.key);

    // targetKeys에 있는 모든 키가 눌렸는지 확인
    if (targetKeys.every(key => pressedKeys.has(key))) {
      callback(event);  // 모든 키가 눌렸을 때 콜백 호출
    }
  }

  // 'keyup' 이벤트 리스너 함수
  function handleKeyUp(event) {
    pressedKeys.delete(event.key);
  }

  // 이벤트 리스너 등록
  document.addEventListener('keydown', handleKeyDown);
  document.addEventListener('keyup', handleKeyUp);

  // 이벤트 리스너 제거 함수 반환
  return () => {
    document.removeEventListener('keydown', handleKeyDown);
    document.removeEventListener('keyup', handleKeyUp);
  };
}