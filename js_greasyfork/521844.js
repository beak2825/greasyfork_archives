// ==UserScript==
// @name         Duolingo StreakKeeper
// @namespace    Lamduck
// @version      1.01
// @description  Tự động lấy streak hằng ngày giúp bạn, những con người lười nhưng vẫn muốn có chuỗi duolingo...
// @author       Lamduck
// @match        https://*.duolingo.com/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=duolingo.com
// @license      Non-license
// @downloadURL https://update.greasyfork.org/scripts/521844/Duolingo%20StreakKeeper.user.js
// @updateURL https://update.greasyfork.org/scripts/521844/Duolingo%20StreakKeeper.meta.js
// ==/UserScript==
//Please don't steal my code 😭😭😭
var xZ1, yT2;

const a1b2 = () => {
  var c3d4 = document.cookie.split(';');
  for (var e5f6 = 0; e5f6 < c3d4.length; e5f6++) {
    var g7h8 = c3d4[e5f6].trim();
    if (g7h8.startsWith('jwt_token=')) {
      return g7h8.substring('jwt_token='.length);
    }
  }
  return null;
}

const i9j0 = (k1l2) => {
  var m3n4 = k1l2.split('.')[1];
  var o5p6 = m3n4.replace(/-/g, '+').replace(/_/g, '/');
  var q7r8 = decodeURIComponent(atob(o5p6).split('').map(function (s9t0) {
    return '%' + ('00' + s9t0.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(q7r8);
}

const u1v2 = w3x4 => ({
  "Content-Type": "application/json",
  "Authorization": "Bearer " + w3x4,
  "User-Agent": navigator.userAgent
});

const y1z2 = async (a3b4) => {
  let c5d6 = "https://www.duolingo.com/2017-06-30/users/" + a3b4 + "?fields=fromLanguage,learningLanguage,streakData";
  let e7f8 = await fetch(c5d6, {
    method: 'GET',
    headers: yT2
  })
  return await e7f8.json();
}

const g1h2 = (i3j4) => {
  const k5l6 = new Date().toISOString().split('T')[0];
  if (!i3j4.streakData.currentStreak) {
    return false
  }
  if (k5l6 == i3j4.streakData.currentStreak.endDate) {
    return true
  } else {
    return false
  }
};

const z1a2 = async (b3c4, d5e6) => {
  const f7g8 = {
    "challengeTypes": [
      "assist", "characterIntro", "characterMatch", "characterPuzzle",
      "characterSelect", "characterTrace", "characterWrite",
      "completeReverseTranslation", "definition", "dialogue",
      "extendedMatch", "extendedListenMatch", "form", "freeResponse",
      "gapFill", "judge", "listen", "listenComplete", "listenMatch",
      "match", "name", "listenComprehension", "listenIsolation",
      "listenSpeak", "listenTap", "orderTapComplete", "partialListen",
      "partialReverseTranslate", "patternTapComplete", "radioBinary",
      "radioImageSelect", "radioListenMatch", "radioListenRecognize",
      "radioSelect", "readComprehension", "reverseAssist",
      "sameDifferent", "select", "selectPronunciation",
      "selectTranscription", "svgPuzzle", "syllableTap",
      "syllableListenTap", "speak", "tapCloze", "tapClozeTable",
      "tapComplete", "tapCompleteTable", "tapDescribe", "translate",
      "transliterate", "transliterationAssist", "typeCloze",
      "typeClozeTable", "typeComplete", "typeCompleteTable",
      "writeComprehension"
    ],
    "fromLanguage": b3c4,
    "isFinalLevel": false,
    "isV2": true,
    "juicy": true,
    "learningLanguage": d5e6,
    "smartTipsVersion": 2,
    "type": "GLOBAL_PRACTICE"
  }
  const h1i2 = "https://www.duolingo.com/2017-06-30/sessions";
  let j3k4 = await fetch(h1i2, {
    method: 'POST',
    headers: yT2,
    body: JSON.stringify(f7g8)
  })
  return await j3k4.json();
}

const l1m2 = async (n3o4) => {
  let p5q6 = new Date().getTime() / 1000;
  let r7s8 = p5q6 + 112;
  const t9u0 = {
    ...n3o4,
    "heartsLeft": 0,
    "startTime": p5q6,
    "enableBonusPoints": false,
    "endTime": r7s8,
    "failed": false,
    "maxInLessonStreak": 9,
    "shouldLearnThings": true
  }
  const v1w2 = "https://www.duolingo.com/2017-06-30/sessions/" + n3o4.id;
  let x3y4 = await fetch(v1w2, {
    method: 'PUT',
    headers: yT2,
    body: JSON.stringify(t9u0)
  })
  return await x3y4.json();
}

const a1b2Init = async () => {
  var z3a4, b5c6, d7e8;
  try {
    xZ1 = a1b2()
    yT2 = u1v2(xZ1)
    z3a4 = i9j0(xZ1).sub
  } catch (error) {
    alert(m9n0[0])
    console.error(error);
    return
  }

  try {
    b5c6 = await y1z2(z3a4)
    d7e8 = g1h2(b5c6);

    if (d7e8) {
      alert(m9n0[1])
      return
    }

    let f1g2 = await z1a2(b5c6.fromLanguage, b5c6.learningLanguage);
    let h3i4 = await l1m2(f1g2);

    if (h3i4) {
      alert(m9n0[2])
      return
    } else {
      alert(m9n0[3])
      return
    }

  } catch (error) {
    alert(m9n0[3])
    console.error(error);
    return
  }
}

const a1b2AutoRun = async () => {
  var z3a4, b5c6, d7e8;
  try {
    xZ1 = a1b2()
    yT2 = u1v2(xZ1)
    z3a4 = i9j0(xZ1).sub
  } catch (error) {
    return m9n0[4]
  }

  try {
    b5c6 = await y1z2(z3a4)
    d7e8 = g1h2(b5c6);

    if (d7e8) {
      return m9n0[5]
    }

    let f1g2 = await z1a2(b5c6.fromLanguage, b5c6.learningLanguage);
    let h3i4 = await l1m2(f1g2);

    if (h3i4) {
      return m9n0[6]
    } else {
      return m9n0[7]
    }

  } catch (error) {
    return m9n0[8]
  }

}

const m9n0 = [
  "Không lấy được thông tin người dùng, bạn đã đăng nhập chưa?\n(Reload trang nếu có lỗi)",
  "Hôm nay bạn đã có streak rồi, hãy quay lại vào ngày mai!",
  "Đã lấy streak thành công, vui lòng reload lại trang để xem thay đổi!",
  "Đã có lỗi xảy ra, hãy reload lại trang và thử lại!",
  "Chưa đăng nhập",
  "Hôm nay đã có streak",
  "Thành công, reload trang đi",
  "Thất bại, reload trang đi",
  "Lỗi, reload đi"
];

const initInterface = () => {
  const o1p2 = document.createElement('div');
  o1p2.style = "position: fixed; z-index: 9999; bottom: 80px; right: 10px; background-color: rgba(255, 255, 255, 0.1); border-radius: 10px; padding: 10px; backdrop-filter: blur(5px); box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); transition: right 0.3s ease;";

  const q1r2 = document.createElement('button');
  q1r2.style = "position: absolute; left: -30px; top: 5px; background-color: rgba(255, 255, 255, 0.1); border: none; border-radius: 50%; width: 25px; height: 25px; display: flex; align-items: center; justify-content: center; color: #fff; cursor: pointer; font-size: 12px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); backdrop-filter: blur(5px);";
  q1r2.innerText = '😏';

  const s1t2 = document.createElement('button');
  s1t2.style = "background-color: #28a745; color: #fff; border: none; border-radius: 5px; padding: 8px 15px; cursor: pointer; font-size: 14px;";
  s1t2.innerText = 'Lấy streak';

  s1t2.addEventListener('click', async () => {
    s1t2.disabled = true;
    s1t2.style.backgroundColor = 'gray';
    s1t2.innerText = 'Đang xử lí';

    try {
      await a1b2Init();
    } catch (error) {
      console.error(error);
    } finally {
      s1t2.disabled = false;
      s1t2.style.backgroundColor = '#28a745';
      s1t2.innerText = 'Lấy streak';
    }
  });

  const u3v4 = document.createElement('input');
  u3v4.type = 'checkbox';
  u3v4.id = 'autoRunCheckbox';
  u3v4.style = "margin-top: 5px; margin-inline-end: 5px;";

  const w3x4 = document.createElement('label');
  w3x4.htmlFor = 'autoRunCheckbox';
  w3x4.style = "color: white; text-shadow: 0 0 5px gray;";
  w3x4.appendChild(document.createTextNode('Auto run'));

  const y3z4 = document.createElement('div');
  y3z4.style = "display: block;";
  y3z4.appendChild(u3v4);
  y3z4.appendChild(w3x4);

  o1p2.appendChild(s1t2);
  o1p2.appendChild(q1r2);
  o1p2.appendChild(y3z4);
  document.body.appendChild(o1p2);

  let isVisible = localStorage.getItem('buttonContainerVisible') === 'true';

  if (!isVisible) {
    o1p2.style.right = `-${o1p2.offsetWidth - 10}px`;
    q1r2.innerText = '🥺';
  }

  q1r2.addEventListener('click', () => {
    isVisible = !isVisible;
    if (isVisible) {
      o1p2.style.right = '10px';
      q1r2.innerText = '😏';
    } else {
      o1p2.style.right = `-${o1p2.offsetWidth - 10}px`;
      q1r2.innerText = '🥺';
    }

    localStorage.setItem('buttonContainerVisible', String(isVisible));
  });

  let isAutoRun = localStorage.getItem('isAutoRun') === 'true';

  u3v4.addEventListener('change', (event) => {
    const checked = event.target.checked;
    localStorage.setItem('isAutoRun', String(checked));
  });

  if (isAutoRun) {
    u3v4.checked = true;
    (async () => {
      let result = await a1b2AutoRun();
      s1t2.disabled = true;
      s1t2.style.backgroundColor = 'gray';
      s1t2.innerText = result;
    })();
  }
}

initInterface();