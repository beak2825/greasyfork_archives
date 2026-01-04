// ==UserScript==
// @name         Misstter for TweetDeck
// @namespace    https://github.com/AranoYuki1
// @version      1.0.7
// @description  TweetDeckからMisskeyに投稿できる拡張機能です！
// @author       AranoYuki
// @match        https://tweetdeck.com/*
// @icon         https://lh3.googleusercontent.com/d/1bG16Aj1geU3sfOx1Wtfh7-vJY5coRRib
// @grant        none
// @sandbox      DOM
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/527079/Misstter%20for%20TweetDeck.user.js
// @updateURL https://update.greasyfork.org/scripts/527079/Misstter%20for%20TweetDeck.meta.js
// ==/UserScript==

/**
 * WebExtensionの代わり
 * addListenerで実行する関数を定義して、sendMessageで実行
 * getURLで拡張機能の画像の代わりにGoogleドライブの画像を使用
 * storage.syncの代わりにローカルストレージを使用
 */
let browser = {
	runtime: {
		onMessage: {
			addListener(func) {
				browser.runtime.onMessage.run = func;
			}
		},
		url: {
			"misskey_icon.png": "https://lh3.googleusercontent.com/d/1bAuXKE8UoSRkJ-vlX3PoT6SVLGR2kDVx"
		},
		getURL(url) {
			return browser.runtime.url[url];
		},
		sendMessage(postMessage) {
			return browser.runtime.onMessage.run(postMessage, "", "");
		}
	},
	storage: {
		sync: {
			get(keys) {
				let data = {};
				for (let i = 0; i < keys.length; i++) {
					let d = localStorage.getItem(keys[i]);
					if (/^(true|false)$/.test(d)) d = d == "true";
					else if (/^\d+$/.test(d)) d = Number(d);
					data[keys[i]] = d;
				}
				return new Promise((resolve, reject) => {
					resolve(data);
				});
			},
			set(data) {
				for (let i in data) {
					localStorage.setItem(i, data[i]);
				}
			}
		}
	}
};

/**
 * common/browser.ts
 */
const getBrowserName = () => {
  const ua = navigator.userAgent
  const isIE = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1
  const isEdge = ua.indexOf("Edge/") > -1
  const isChrome = ua.indexOf("Chrome/") > -1
  const isFirefox = ua.indexOf("Firefox/") > -1
  const isSafari = ua.indexOf("Safari/") > -1 && !isChrome
  const isOpera = ua.indexOf("Opera/") > -1 || ua.indexOf("OPR/") > -1
  const isBlink = isChrome && !!window.chrome
  if (isIE) {
    return "IE"
  } else if (isEdge) {
    return "Edge"
  } else if (isChrome) {
    return "Chrome"
  } else if (isFirefox) {
    return "Firefox"
  } else if (isSafari) {
    return "Safari"
  } else if (isOpera) {
    return "Opera"
  } else if (isBlink) {
    return "Blink"
  } else {
    return "Unknown"
  }
}

/**
 * common/CommonType.ts
 */

/**
 * common/constants.ts
 */
const DEFAULT_INSTANCE_URL = "https://misskey.io"

/**
 * リプライボタンの文字列一覧
 */
const REPLY_BUTTON_LABELS = [
  "返信",
  "Reply",
  "답글",
  "回复",
  "回覆",
  "Répondre",
  "Responder",
  "Antworten",
  "Rispondi",
  "Responder",
  "Responder",
  "Antwoorden",
  "Svara",
  "Svar"
]

/**
 * background/background.ts
 */
browser.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type == "post") {
    const postMessage = message
    return postToMisskeyB(
      postMessage.text,
      postMessage.attachments,
      postMessage.options
    )
  }
})

/**
 * background/MisskeyAPI.ts
 */
const uploadAttachment = async (attachment, options) => {
  const blob = await (await fetch(attachment.data)).blob()
  if (blob instanceof Blob == false) {
    console.error("blob is not Blob")
    return
  }
  const formData = new FormData()
  // create UUID
  const filename = `${Date.now()}.png`
  formData.append("file", blob, filename)
  formData.append("i", options.token)
  formData.append("name", filename)

  if (options.sensitive || attachment.isSensitive) {
    formData.append("isSensitive", "true")
  }

  const res = await fetch(`${options.server}/api/drive/files/create`, {
    method: "POST",
    body: formData
  })

  const resJson = await res.json()
  const fileID = resJson["id"]

  return fileID
}

// postToMisskeyと名前が重複するのでbackground.tsのほうにBをつけた
const postToMisskeyB = async (text, attachments, options) => {
  let fileIDs = []
  if (attachments.length != 0) {
    fileIDs = await Promise.all(
      attachments.map(attachment => uploadAttachment(attachment, options))
    )
  }

  const body = { i: options.token }
  if (text) {
    body["text"] = text
  }
  if (fileIDs.length > 0) {
    body["fileIds"] = fileIDs
  }
  if (options.cw) {
    body["cw"] = ""
  }
  if (options.scope) {
    body["visibility"] = options.scope
  }
  if (options.localOnly) {
    body["localOnly"] = options.localOnly
  }

  const res = await fetch(`${options.server}/api/notes/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body)
  })
  if (res.status != 200) {
    const errorRes = await res.json()
    const message = errorRes["error"]["message"]
    throw new Error(message)
  }
}

/**
 * content_script/Clients/tweetdeck.ts
 */
// ミスキーへの投稿ボタンを追加する
const addMisskeyPostButton = (tweetButton, tweetBox) => {
  // すでにボタンがある場合は何もしない
  if (tweetBox.querySelector(`.${misskeyButtonClassName}`)) return

  const misskeybutton = createMisskeyPostButton(tweetToMisskey, tweetButton)
  misskeybutton.style.width = "40px"
  misskeybutton.style.height = "30px"
  misskeybutton.style.marginLeft = "8px"
  tweetBox.appendChild(misskeybutton)
  syncDisableState(tweetButton, misskeybutton)
}

// スコープボタンを作成する
const addScopeButton = iconBox => {
  // すでにボタンがある場合は何もしない
  if (iconBox.querySelector(`.${scopeButtonClassName}`)) return
  const scopeButton = createScopeButton()
  iconBox.appendChild(scopeButton)
}

// 連合なしボタンを作成する
const addLocalOnlyButton = iconBox => {
  if (iconBox.querySelector(`.${localOnlyButtonClassName}`)) return
  const localOnlyButton = createLocalOnlyButton()
  iconBox.appendChild(localOnlyButton)
}

// ミスキーへのセンシティブ設定ボタンを追加する
const addMisskeyImageOptionButton = (editButton, attachmentsImage) => {
  const misskeybutton = createMisskeyImageOptionButton()
  editButton.parentElement.insertBefore(misskeybutton, editButton)
}

const foundTweetButtonHandler = tweetButton => {
  if (!tweetButton) return

  // リプライボタンの場合は後続の処理を行わない
  const isReplyButton =
    REPLY_BUTTON_LABELS.indexOf(tweetButton.innerText) !== -1
  if (isReplyButton) return

  // add misskey post button
  const tweetBox = tweetButton.parentElement?.parentElement
  if (tweetBox) {
    addMisskeyPostButton(tweetButton, tweetBox)
  }

  // // add scope button and local only button
  const iconsBlock = document.querySelector(gifButtonSelector)?.parentElement
  if (iconsBlock) {
    addScopeButton(iconsBlock)
    addLocalOnlyButton(iconsBlock)
  }
}

const foundAttachmentsImageHandler = attachmentsImage => {
  // すでにボタンがある場合は何もしない
  if (attachmentsImage.getAttribute("data-has-flag-button")) return
  attachmentsImage.setAttribute("data-has-flag-button", "true")

  const editButton = Array.from(
    attachmentsImage.querySelectorAll("div[role='button']")
  )[1]
  if (!editButton) return
  addMisskeyImageOptionButton(editButton, attachmentsImage)
}

const gifButtonSelector = 'div[data-testid="gifSearchButton"]'
const buttonSelector =
  '//*[@id="react-root"]/div/div/div[3]/div/div[2]/div/div/div[1]/div/div/div/div[3]/div'
const attachmentsImageSelector =
  'div[data-testid="attachments"] div[role="group"]'

const observer = new MutationObserver(mutations => {
  mutations.forEach(mutation => {
    if (mutation.type !== "childList") return
    mutation.addedNodes.forEach(node => {
      if (node.nodeType !== Node.ELEMENT_NODE) return

      // select with xpath
      const tweetButton = node.ownerDocument.evaluate(
        buttonSelector,
        node,
        null,
        XPathResult.FIRST_ORDERED_NODE_TYPE,
        null
      ).singleNodeValue
      if (tweetButton) {
        foundTweetButtonHandler(tweetButton)
      }

      const attachmentsImages = document.querySelectorAll(
        attachmentsImageSelector
      )
      if (attachmentsImages) {
        attachmentsImages.forEach(attachmentsImage => {
          foundAttachmentsImageHandler(attachmentsImage)
        })
      }
    })
  })
})

observer.observe(document.body, { childList: true, subtree: true })

/**
 * content_script/System/PostAPI.ts
 */
const blobToBase64 = blob => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onloadend = () => {
      const base64 = reader.result
      if (base64) {
        resolve(base64.toString())
      } else {
        reject(new Error("Failed to convert blob to base64"))
      }
    }
    reader.readAsDataURL(blob)
  })
}

const makeAttachmentData = async image => {
  const base64 = await blobToBase64(image.blob)
  return { data: base64, isSensitive: image.isSensitive }
}

const postToMisskey = async (text, images, video, options) => {
  const imageData = await Promise.all(
    images.map(async image => {
      return await makeAttachmentData(image)
    })
  )
  const videoData = video ? await makeAttachmentData(video) : undefined

  let uploadNotification = undefined
  if (imageData.length != 0) {
    uploadNotification = showNotification(
      "画像をアップロードしています...",
      "success",
      1000_0000
    )
  }

  if (videoData) {
    uploadNotification = showNotification(
      "動画をアップロードしています...",
      "success",
      1000_0000
    )
  }

  const attachments = imageData
  if (videoData) {
    attachments.push(videoData)
  }

  const postMessage = {
    type: "post",
    text: text,
    options: options,
    attachments
  }

  try {
    uploadNotification?.close()
    await browser.runtime.sendMessage(postMessage)
    showNotification("Misskeyへの投稿に成功しました", "success")
  } catch (error) {
    showNotification(error.message, "error")
  }
}

/**
 * content_script/System/StorageReader.ts
 */
const getToken = async () => {
  return await new Promise((resolve, reject) => {
    browser.storage.sync.get(["misskey_token"]).then(result => {
      const token = result?.misskey_token
      if (!token) {
        showNotification("Tokenが設定されていません。", "error")
        reject()
      } else {
        resolve(token)
      }
    })
  })
}

const getServer = async () => {
  return await new Promise((resolve, reject) => {
    browser.storage.sync.get(["misskey_server"]).then(result => {
      let server = result?.misskey_server ?? DEFAULT_INSTANCE_URL
      if (server.endsWith("/")) {
        server = server.slice(0, -1)
      }
      resolve(server)
    })
  })
}

const getCW = async () => {
  return await new Promise((resolve, reject) => {
    browser.storage.sync.get(["misskey_cw"]).then(result => {
      resolve(result?.misskey_cw ?? false)
    })
  })
}

const getSensitive = async () => {
  return await new Promise((resolve, reject) => {
    browser.storage.sync.get(["misskey_sensitive"]).then(result => {
      resolve(result?.misskey_sensitive ?? false)
    })
  })
}

const getScope = async () => {
  return await new Promise((resolve, reject) => {
    browser.storage.sync.get(["misskey_scope"]).then(result => {
      resolve(result?.misskey_scope ?? "public")
    })
  })
}

const getLocalOnly = async () => {
  return await new Promise((resolve, reject) => {
    browser.storage.sync.get(["misskey_local_only"]).then(result => {
      resolve(result?.misskey_local_only ?? false)
    })
  })
}

/**
 * content_script/System/TwitterCrawler.ts
 */
const getTweetText = () => {
  let textContents = document.querySelectorAll(
    'div[data-testid="tweetTextarea_0"] div[data-block="true"]'
  )
  //スマホに対応
  let text
  if (textContents.length > 0) {
    text = Array.from(textContents)
      .map(textContent => {
        return textContent.textContent
      })
      .join("\n")
  }
  else {
    textContents = document.querySelector('textarea[data-testid="tweetTextarea_0"]')
    if (!textContents) return
    text = textContents.value
  }

  return text
}

const getTweetVideo = async () => {
  const video = document.querySelector(
    "div[data-testid='attachments'] video > source"
  )
  if (!video) return null
  const videoRoot = video.parentElement?.parentElement
  const flagButton = videoRoot?.querySelector(`.${misskeyFlagClassName}`)
  const isFlagged =
    flagButton?.getAttribute(misskeyFlagAttribute) === "true" ?? false
  const url = video.getAttribute("src")
  if (!url) return null
  if (!url.startsWith("blob:")) return null
  const blob = await fetch(url).then(res => res.blob())
  return { blob: blob, isSensitive: isFlagged }
}

const getTweetImages = async () => {
  const images = document.querySelectorAll("div[data-testid='attachments'] img")

  const res = []

  for (const image of images) {
    const imageRoot =
      image.parentElement?.parentElement?.parentElement?.parentElement
    const flagButton = imageRoot?.querySelector(`.${misskeyFlagClassName}`)
    const isFlagged =
      flagButton?.getAttribute(misskeyFlagAttribute) === "true" ?? false
    const url = image.getAttribute("src")
    if (!url) continue
    if (!url.startsWith("blob:")) continue
    const blob = await (await fetch(url)).blob()
    res.push({ blob: blob, isSensitive: isFlagged })
  }

  return res
}

const tweetToMisskey = async () => {
  try {
    const text = getTweetText()
    const images = await getTweetImages()
    const video = await getTweetVideo()

    if (!text && images.length == 0 && !video) {
      showNotification("Misskeyへの投稿内容がありません", "error")
      return
    }

    const [token, server, cw, sensitive, scope, localOnly] = await Promise.all([
      getToken(),
      getServer(),
      getCW(),
      getSensitive(),
      getScope(),
      getLocalOnly()
    ])

    const options = { cw, token, server, sensitive, scope: scope, localOnly }
    await postToMisskey(text ?? "", images, video, options)
  } catch (e) {
    console.error(e)
    showNotification("Misskeyへの投稿に失敗しました", "error")
  }
}

/**
 * content_script/UI/Icons.ts
 */
const public_scope_icon = `
<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
<g>
    <path d="M12.0722199,21.2375183 C13.2699128,21.2375183 14.3956223,21.0092316 15.4493485,20.5526581 C16.5030747,20.0960846 17.4323121,19.4668884 18.2370606,18.6650696 C19.0418092,17.8632507 19.6716233,16.9348373 20.1265031,15.8798294 C20.5813828,14.8248215 20.8088227,13.6984711 20.8088227,12.5007782 C20.8088227,11.3030853 20.580536,10.1767578 20.1239625,9.12179565 C19.667389,8.0668335 19.036728,7.13759613 18.2319794,6.33408356 C17.4272309,5.53057098 16.4979935,4.90137482 15.4442673,4.44649506 C14.3905412,3.9916153 13.2635957,3.76417542 12.0634309,3.76417542 C10.8690339,3.76417542 9.7449723,3.9916153 8.69124611,4.44649506 C7.63751991,4.90137482 6.70828255,5.53057098 5.90353401,6.33408356 C5.09878547,7.13759613 4.46897133,8.0668335 4.01409157,9.12179565 C3.55921181,10.1767578 3.33177193,11.3030853 3.33177193,12.5007782 C3.33177193,13.6984711 3.56005867,14.8248215 4.01663215,15.8798294 C4.47320564,16.9348373 5.10301979,17.8632507 5.9060746,18.6650696 C6.70912941,19.4668884 7.63751991,20.0960846 8.69124611,20.5526581 C9.7449723,21.0092316 10.8719636,21.2375183 12.0722199,21.2375183 Z M8.475,8.154 L8.46006019,8.14841122 C7.91150673,7.9745458 7.44782265,7.76130252 7.06900795,7.5086814 L7.032,7.483 L7.04302223,7.47171783 L7.04302223,7.47171783 C7.69849403,6.81624603 8.45547493,6.30286407 9.31396492,5.93157196 C9.52858742,5.83874893 9.74683483,5.75752878 9.96870716,5.68791151 L9.973,5.687 L9.82891686,5.833372 C9.53247912,6.15176451 9.26080711,6.53123093 9.01390083,6.97177124 C8.84459367,7.27385603 8.69119846,7.59808723 8.55371522,7.94446486 L8.475,8.154 Z M15.669,8.155 L15.591131,7.94446486 C15.453233,7.59808723 15.2992674,7.27385603 15.1292344,6.97177124 C14.8812695,6.53123093 14.6088697,6.15176451 14.312035,5.833372 L14.17,5.689 L14.4967609,5.80103958 C14.6059747,5.84164965 14.7142373,5.88516045 14.8215485,5.93157196 C15.6800385,6.30286407 16.4385072,6.81624603 17.0969544,7.47171783 L17.109,7.486 L17.0761092,7.5086814 C16.6988441,7.76130252 16.2362316,7.9745458 15.6882715,8.14841122 L15.669,8.155 Z M12.699,8.629 L12.699,6.081 L12.7934767,6.13055325 C12.9338012,6.21423817 13.0717698,6.32302856 13.2073823,6.45692444 C13.5690156,6.8139801 13.892746,7.30081177 14.1785737,7.91741943 L14.316536,8.23299789 L14.316536,8.23299789 L14.402,8.456 L14.046476,8.51154268 C13.6764513,8.56343806 13.2915307,8.59976482 12.8917142,8.62052298 L12.699,8.629 Z M11.44,8.628 L11.25485,8.62052298 C10.8559218,8.59976482 10.4716289,8.56343806 10.1019711,8.51154268 L9.738,8.455 L9.82411011,8.23299789 C9.86841273,8.1253802 9.91438301,8.02018738 9.96202095,7.91741943 C10.2478486,7.30081177 10.5730439,6.8139801 10.9376069,6.45692444 C11.074318,6.32302856 11.2129474,6.21423817 11.3534952,6.13055325 L11.44,6.085 L11.44,8.628 Z M7.77,11.866 L4.971,11.866 L4.97715481,11.7805729 C5.04700382,11.0709591 5.22162636,10.3931198 5.50102241,9.74705505 C5.68728645,9.31634521 5.90891846,8.91137886 6.16591842,8.53215599 L6.238,8.431 L6.28167109,8.46426111 C6.6014704,8.69709466 6.98390859,8.90633937 7.42898567,9.09199524 C7.63668831,9.17863464 7.85394549,9.25864665 8.08075722,9.33203125 L8.115,9.343 L8.08864601,9.4480896 L8.08864601,9.4480896 C7.93022708,10.1238142 7.82838634,10.838402 7.78312379,11.5918529 L7.77,11.866 Z M19.169,11.866 L16.374,11.866 L16.362552,11.5918529 C16.3172895,10.838402 16.2154487,10.1238142 16.0570298,9.4480896 L16.03,9.342 L16.0612412,9.33203125 C16.2882462,9.25864665 16.5058823,9.17863464 16.7141495,9.09199524 C17.1604364,8.90633937 17.5428116,8.69709466 17.8612749,8.46426111 L17.904,8.432 L17.976925,8.53215599 C18.2343484,8.91137886 18.4558717,9.31634521 18.6414948,9.74705505 C18.9199296,10.3931198 19.0939513,11.0709591 19.16356,11.7805729 L19.169,11.866 Z M11.44,11.866 L9.053,11.866 L9.06363685,11.6612701 C9.10047157,11.1006419 9.174141,10.5565948 9.28464515,10.029129 L9.368,9.657 L9.55628212,9.69281006 L9.55628212,9.69281006 C10.033336,9.77718506 10.52607,9.83624756 11.0344843,9.86999756 L11.44,9.891 L11.44,11.866 Z M15.09,11.866 L12.699,11.866 L12.699,9.891 L13.1102631,9.86999756 C13.6185456,9.83624756 14.1107194,9.77718506 14.5867844,9.69281006 L14.773,9.657 L14.8578034,10.029129 L14.8578034,10.029129 C14.9691315,10.5565948 15.0433503,11.1006419 15.0804597,11.6612701 L15.09,11.866 Z M6.25,16.59 L6.16591842,16.4695377 C5.90891846,16.0903149 5.68728645,15.6853485 5.50102241,15.2546387 C5.22162636,14.6085739 5.04700382,13.9307089 4.97715481,13.2210436 L4.97,13.129 L7.769,13.129 L7.78312379,13.4368778 C7.82838634,14.1893852 7.93022708,14.90185 8.08864601,15.5742722 L8.118,15.693 L8.08075722,15.7038193 C7.85394549,15.776741 7.63668831,15.8560333 7.42898567,15.9416962 C6.98390859,16.1252594 6.6014704,16.3331588 6.28167109,16.5653945 L6.25,16.59 Z M9.374,15.378 C9.34205614,15.2469615 9.31227119,15.1157532 9.28464515,14.984375 C9.174141,14.4588623 9.10047157,13.917806 9.06363685,13.3612061 L9.051,13.129 L11.44,13.129 L11.44,15.143 L11.0344843,15.1634137 C10.52607,15.1975702 10.033336,15.2573441 9.55628212,15.3427353 L9.374,15.378 Z M14.766,15.378 L14.5867844,15.3427353 L14.5867844,15.3427353 C14.1107194,15.2573441 13.6185456,15.1975702 13.1102631,15.1634137 L12.699,15.143 L12.699,13.129 L15.092,13.129 L15.0804597,13.3589401 C15.0433503,13.9141668 14.9691315,14.4541245 14.8578034,14.9788132 L14.7693558,15.3652287 L14.7693558,15.3652287 L14.766,15.378 Z M17.892,16.59 L17.8612749,16.5653945 C17.5428116,16.3331588 17.1604364,16.1252594 16.7141495,15.9416962 C16.5058823,15.8560333 16.2882462,15.776741 16.0612412,15.7038193 L16.024,15.693 L16.0544892,15.5742722 L16.0544892,15.5742722 C16.2141179,14.90185 16.3167364,14.1893852 16.3623446,13.4368778 L16.376,13.129 L19.17,13.129 L19.16356,13.2210436 C19.0939513,13.9307089 18.9199296,14.6085739 18.6414948,15.2546387 C18.4558717,15.6853485 18.2345601,16.0903149 17.9775601,16.4695377 L17.892,16.59 Z M11.44,18.923 L11.3534952,18.8758429 C11.2129474,18.7920614 11.074318,18.6831455 10.9376069,18.5490952 C10.5730439,18.1916275 10.2478486,17.7052078 9.96202095,17.0898361 L9.82411011,16.7749462 L9.82411011,16.7749462 L9.746,16.575 L10.0979692,16.5187466 C10.4682664,16.4664543 10.8532954,16.4298496 11.2530561,16.4089327 L11.44,16.402 L11.44,18.923 Z M12.699,16.402 L12.8917142,16.4089327 C13.2915307,16.4298496 13.6764513,16.4664543 14.046476,16.5187466 L14.392,16.574 L14.316536,16.7688694 C14.2721991,16.8763714 14.2262116,16.9815063 14.1785737,17.0842743 C13.892746,17.700882 13.5690156,18.1885376 13.2073823,18.5472412 C13.0717698,18.6817551 12.9338012,18.7910476 12.7934767,18.8751187 L12.699,18.926 L12.699,16.402 Z M9.962,19.311 L9.64181133,19.2006541 C9.53246374,19.1600441 9.42402847,19.1165333 9.31650551,19.0701218 C8.56384476,18.7452412 7.88955028,18.311573 7.29362209,17.7691174 L7.053,17.539 L7.06747359,17.528595 C7.44344676,17.2743835 7.90565244,17.0597229 8.45409062,16.884613 L8.48,16.877 L8.55371522,17.0714284 C8.69119846,17.4165533 8.84459367,17.7398049 9.01390083,18.0411835 C9.26080711,18.4806938 9.53280993,18.8592107 9.82990928,19.1767342 L9.962,19.311 Z M14.179,19.31 L14.3116778,19.1767342 C14.6081155,18.8592107 14.8797875,18.4806938 15.1266938,18.0411835 C15.296001,17.7398049 15.4495517,17.4165533 15.5873461,17.0714284 L15.66,16.877 L15.6882715,16.884613 C16.2362316,17.0597229 16.6988441,17.2743835 17.0761092,17.528595 L17.09,17.539 L16.8484445,17.7691174 C16.251535,18.311573 15.5767499,18.7452412 14.8240891,19.0701218 L14.4988434,19.2006541 L14.4988434,19.2006541 L14.179,19.31 Z"></path>
</g>
</svg>
`

const home_scope_icon = `
<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
        <path d="M17.3242308,20.6333008 C17.9349434,20.6333008 18.4110711,20.4656423 18.7526136,20.1303253 C19.0941562,19.7950083 19.2649275,19.3305105 19.2649275,18.7368317 L19.264,11.463 L20.1624494,12.2164383 C20.2656039,12.3001378 20.3750489,12.3714943 20.4907843,12.4305077 C20.6065196,12.489521 20.7283725,12.5190277 20.8563429,12.5190277 C21.0979302,12.5190277 21.2999375,12.4481901 21.4623648,12.3065147 C21.624792,12.1648394 21.7060057,11.9725596 21.7060057,11.7296753 C21.7060057,11.4522044 21.5977064,11.2212957 21.3811079,11.0369492 L19.264,9.26 L19.2649275,5.88631439 C19.2649275,5.70905813 19.2119451,5.56742605 19.1059805,5.46141815 C19.0000158,5.35541026 18.8583621,5.30240631 18.6810194,5.30240631 L17.5275999,5.30240631 C17.3488737,5.30240631 17.2051448,5.35541026 17.0964132,5.46141815 C16.9876816,5.56742605 16.9333158,5.70905813 16.9333158,5.88631439 L16.933,7.303 L13.2070433,4.17440796 C12.8545195,3.87212118 12.4673874,3.72097778 12.0456472,3.72097778 C11.623907,3.72097778 11.2319761,3.87212118 10.8698545,4.17440796 L2.69150981,11.0391541 C2.46669699,11.2235006 2.35429057,11.4475352 2.35429057,11.7112579 C2.35429057,11.9321798 2.43206716,12.1220385 2.58762035,12.2808342 C2.74317353,12.4396299 2.95341675,12.5190277 3.21835002,12.5190277 C3.34485047,12.5190277 3.46599,12.489521 3.5817686,12.4305077 C3.69754721,12.3714943 3.80493856,12.3001378 3.90394267,12.2164383 L4.756,11.502 L4.75632915,18.7368317 C4.75632915,19.3305105 4.92710043,19.7950083 5.26864299,20.1303253 C5.61018555,20.4656423 6.08631318,20.6333008 6.69702586,20.6333008 L17.3242308,20.6333008 Z M16.8579603,18.9683456 L14.287,18.969 L14.2875715,13.8650513 C14.2875715,13.6794942 14.2325356,13.5317014 14.1224638,13.4216728 C14.012392,13.3116442 13.863929,13.2566299 13.677075,13.2566299 L10.391522,13.2566299 C10.2045815,13.2566299 10.0546919,13.3116442 9.94185313,13.4216728 C9.82901439,13.5317014 9.77259502,13.6794942 9.77259502,13.8650513 L9.772,18.969 L7.16329631,18.9683456 C6.92291952,18.9683456 6.73811905,18.9027176 6.60889491,18.7714615 C6.47967077,18.6402054 6.415,18.451622 6.415,18.2057114 L6.415,10.111 L11.6825529,5.69500732 C11.7928841,5.59453328 11.9111486,5.54429626 12.0373465,5.54429626 C12.1635443,5.54429626 12.2845757,5.59453328 12.4004408,5.69500732 L17.606,10.07 L17.6061979,18.2057114 C17.6061979,18.451622 17.5415859,18.6402054 17.4123617,18.7714615 C17.2831376,18.9027176 17.0983371,18.9683456 16.8579603,18.9683456 Z" id="home"></path>
    </g>
</svg>
`

const lock_scope_icon = `
<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
        <path d="M16.0018571,20.6163788 C16.6460221,20.6163788 17.1316407,20.4465942 17.4587129,20.1070251 C17.785785,19.7674561 17.9493211,19.2491302 17.9493211,18.5520477 L17.9493211,12.5907288 C17.9493211,11.905365 17.785785,11.3918228 17.4587129,11.0501022 C17.2043234,10.7843196 16.8540232,10.6218968 16.4078121,10.562834 L16.404,10.563 L16.4054673,8.60145569 C16.4054673,7.5874176 16.2047837,6.7349472 15.8034166,6.04404449 C15.4020494,5.35314178 14.8718446,4.83092499 14.2128022,4.4773941 C13.5537599,4.12386322 12.8388932,3.94709778 12.0682023,3.94709778 C11.300258,3.94709778 10.5871766,4.12386322 9.92895824,4.4773941 C9.27073986,4.83092499 8.74202282,5.35314178 8.34280712,6.04404449 C7.94359142,6.7349472 7.74398357,7.5874176 7.74398357,8.60145569 L7.742,10.562 L7.72980985,10.562834 C7.28700884,10.6218968 6.93811097,10.7843196 6.68311626,11.0501022 C6.35526592,11.3918228 6.19134075,11.905365 6.19134075,12.5907288 L6.19134075,18.5520477 C6.19134075,19.2491302 6.35526592,19.7674561 6.68311626,20.1070251 C7.0109666,20.4465942 7.49404461,20.6163788 8.13235027,20.6163788 L16.0018571,20.6163788 Z M14.745,10.538 L9.401,10.538 L9.40278179,8.46673584 C9.40278179,7.84106445 9.52390606,7.31003571 9.76615459,6.8736496 C10.0084031,6.43726349 10.3317216,6.10623169 10.73611,5.8805542 C11.1404985,5.65487671 11.5845292,5.54203796 12.0682023,5.54203796 C12.554622,5.54203796 13.0000489,5.65487671 13.4044831,5.8805542 C13.8089173,6.10623169 14.1337236,6.43726349 14.3789018,6.8736496 C14.62408,7.31003571 14.7466691,7.84106445 14.7466691,8.46673584 L14.745,10.538 Z M15.6855882,19.0302277 L8.46372539,19.0302277 C8.29279644,19.0302277 8.1609605,18.9787521 8.06821758,18.8758011 C7.97547466,18.77285 7.9291032,18.6241455 7.9291032,18.4296875 L7.9291032,12.7154236 C7.9291032,12.5209656 7.97547466,12.3751907 8.06821758,12.2780991 C8.1609605,12.1810074 8.29279644,12.1324615 8.46372539,12.1324615 L15.6855882,12.1324615 C15.8580735,12.1324615 15.9892457,12.1810074 16.0791047,12.2780991 C16.1689637,12.3751907 16.2138932,12.5209656 16.2138932,12.7154236 L16.2138932,18.4296875 C16.2138932,18.6241455 16.1689637,18.77285 16.0791047,18.8758011 C15.9892457,18.9787521 15.8580735,19.0302277 15.6855882,19.0302277 Z" id="lock"></path>
    </g>
</svg>
`

const flag_icon = `
<svg width="24px" height="24px" viewBox="0 0 24 24" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
    <g>
        <path d="M6.60523225,20.1499023 C6.82010143,20.1499023 7.00332389,20.0748278 7.15489961,19.9246788 C7.30647533,19.7745298 7.3822632,19.5905507 7.3822632,19.3727417 L7.3822632,15.1058807 C7.49605307,15.0659332 7.70767976,15.0062065 8.01714326,14.9267006 C8.32660676,14.8471947 8.71946718,14.8074417 9.1957245,14.8074417 C9.90751649,14.8074417 10.5723356,14.8787333 11.1901817,15.0213165 C11.8080279,15.1638997 12.4108289,15.3299802 12.9985848,15.519558 C13.5863406,15.7091357 14.18551,15.8762321 14.796093,16.0208473 C15.406676,16.1654625 16.0558014,16.2377701 16.7434693,16.2377701 C17.346227,16.2377701 17.8216629,16.1998761 18.1697769,16.1240883 C18.5178909,16.0483004 18.8442586,15.9404119 19.14888,15.8004227 C19.4303284,15.6700312 19.6487211,15.4840418 19.8040581,15.2424545 C19.9593951,15.0008672 20.0370636,14.6973267 20.0370636,14.3318329 L20.0370636,6.55944824 C20.0370636,6.28733826 19.9459712,6.0695076 19.7637863,5.90595627 C19.5816015,5.74240494 19.3511683,5.66062927 19.0724869,5.66062927 C18.8385086,5.66062927 18.5335846,5.70948283 18.1577149,5.80718994 C17.7818451,5.90489705 17.2871704,5.95375061 16.6736908,5.95375061 C15.9934591,5.95375061 15.3491326,5.88144302 14.7407112,5.73682785 C14.1322899,5.59221268 13.5320397,5.4261322 12.9399605,5.23858643 C12.3478813,5.05104065 11.7411245,4.88498179 11.11969,4.74040985 C10.4982554,4.59583791 9.83164216,4.52355194 9.11985017,4.52355194 C8.52859244,4.52355194 8.06353252,4.56071091 7.72467042,4.63502884 C7.38580832,4.70934677 7.05399324,4.81939697 6.72922517,4.96517944 C6.44656628,5.09410095 6.22540666,5.26647186 6.06574632,5.48229218 C5.90608598,5.69811249 5.82625581,5.9858729 5.82625581,6.34557343 L5.82625581,19.3727417 C5.82625581,19.5850169 5.90336229,19.7676125 6.05757524,19.9205284 C6.21178819,20.0734444 6.39434053,20.1499023 6.60523225,20.1499023 Z M16.7067642,14.6536179 C16.07945,14.6536179 15.4728012,14.5816778 14.8868179,14.4377975 C14.3008347,14.2939173 13.7146785,14.1279017 13.1283493,13.9397507 C12.5420202,13.7515996 11.9302483,13.5862541 11.2930336,13.4437141 C10.655819,13.3011742 9.96748099,13.2299042 9.22801973,13.2299042 C8.86529288,13.2299042 8.52550126,13.2494672 8.20864488,13.2885933 C7.8917885,13.3277194 7.63145957,13.3864085 7.42765809,13.4646606 L7.42765809,6.60315704 C7.50305686,6.49455516 7.68273418,6.38372676 7.96669008,6.27067184 C8.25064597,6.15761693 8.64579774,6.10108948 9.1521454,6.10108948 C9.81655376,6.10108948 10.4486237,6.17302958 11.0483551,6.31690979 C11.6480866,6.46079 12.2414627,6.62578964 12.8284836,6.81190872 C13.4155045,6.9980278 14.0204023,7.16337331 14.643177,7.30794525 C15.2659518,7.45251719 15.9305547,7.52480316 16.6369858,7.52480316 C16.9984156,7.52480316 17.3314413,7.50632095 17.6360626,7.46935654 C17.940684,7.43239212 18.2079519,7.38096619 18.4378662,7.31507874 L18.4378662,14.1541443 C18.3652344,14.2612762 18.1851463,14.3713048 17.8976021,14.48423 C17.6100578,14.5971553 17.2131119,14.6536179 16.7067642,14.6536179 Z"></path>
    </g>
</svg>
`

const modal_pin_icon = `
<svg viewBox="0 0 24 24"><g><path d="M22 17H2L12 6l10 11z"></path></g></svg>
`

const global_icon = `
<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-rocket" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#86ad00" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M4 13a8 8 0 0 1 7 7a6 6 0 0 0 3 -5a9 9 0 0 0 6 -8a3 3 0 0 0 -3 -3a9 9 0 0 0 -8 6a6 6 0 0 0 -5 3" />
    <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
    <path d="M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
</svg>
`

const local_only_icon = `
<svg xmlns="http://www.w3.org/2000/svg" class="icon icon-tabler icon-tabler-rocket-off" width="24" height="24" viewBox="0 0 24 24" stroke-width="1.5" stroke="#D24728" fill="none" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M9.29 9.275a9.03 9.03 0 0 0 -.29 .725a6 6 0 0 0 -5 3a8 8 0 0 1 7 7a6 6 0 0 0 3 -5c.241 -.085 .478 -.18 .708 -.283m2.428 -1.61a9 9 0 0 0 2.864 -6.107a3 3 0 0 0 -3 -3a9 9 0 0 0 -6.107 2.864" />
    <path d="M7 14a6 6 0 0 0 -3 6a6 6 0 0 0 6 -3" />
    <path d="M15 9m-1 0a1 1 0 1 0 2 0a1 1 0 1 0 -2 0" />
    <path d="M3 3l18 18" />
</svg>
`

/**
 * content_script/UI/ImageFlagButton.ts
 */
const misskeyFlagClassName = "misskey-flag"
const misskeyFlagAttribute = "data-misskey-flag"

const createMisskeyImageOptionButton = () => {
  const misskeybutton = document.createElement("button")
  misskeybutton.innerHTML = flag_icon
  misskeybutton.style.fill = "rgb(255, 255, 255)"
  misskeybutton.className = misskeyFlagClassName
  misskeybutton.style.backgroundColor = "rgba(15, 20, 25, 0.75)"
  // @ts-ignore
  misskeybutton.style.backdropFilter = "blur(4px)"
  misskeybutton.style.borderRadius = "9999px"
  misskeybutton.style.height = "32px"
  misskeybutton.style.width = "32px"
  misskeybutton.style.marginLeft = "8px"
  misskeybutton.style.marginRight = "8px"
  misskeybutton.style.outline = "none"
  misskeybutton.style.display = "flex"
  misskeybutton.style.alignItems = "center"
  misskeybutton.style.justifyContent = "center"
  misskeybutton.style.cursor = "pointer"
  misskeybutton.style.border = "solid 1px rgb(134, 179, 0)"

  misskeybutton.onclick = () => {
    if (misskeybutton.getAttribute(misskeyFlagAttribute) === "true") {
      misskeybutton.setAttribute(misskeyFlagAttribute, "false")
      misskeybutton.style.backgroundColor = "rgba(15, 20, 25, 0.75)"
    } else {
      misskeybutton.setAttribute(misskeyFlagAttribute, "true")
      misskeybutton.style.backgroundColor = "rgb(134, 179, 0)"
    }
  }

  misskeybutton.style.transition = "background-color 0.2s ease-in-out"

  misskeybutton.onmouseover = () => {
    if (misskeybutton.getAttribute(misskeyFlagAttribute) === "true") return
    misskeybutton.style.backgroundColor = "rgba(39, 44, 48, 0.75)"
  }

  misskeybutton.onmouseout = () => {
    if (misskeybutton.getAttribute(misskeyFlagAttribute) === "true") return
    misskeybutton.style.backgroundColor = "rgba(15, 20, 25, 0.75)"
  }

  return misskeybutton
}

/**
 * content_script/UI/LocalOnlyButton.ts
 */
const localOnlyButtonClassName = "misskey-local-only-button"

const createLocalOnlyButton = () => {
  const localOnlyButton = document.createElement("div")

  const updateLocalOnlyIcon = () =>
    browser.storage.sync.get(["misskey_local_only"]).then(result => {
      const localOnly = result?.misskey_local_only ?? false
      updateLocalOnlyButton(localOnlyButton, localOnly)
    })

  setInterval(() => {
    updateLocalOnlyIcon()
  }, 2000)

  updateLocalOnlyIcon()

  browser.storage.sync.get(["misskey_show_local_only"]).then(result => {
    const showLocalOnly = result?.misskey_show_local_only ?? true
    if (!showLocalOnly) {
      localOnlyButton.style.display = "none"
    }
  })
  localOnlyButton.className = localOnlyButtonClassName

  localOnlyButton.style.minWidth = "34px"
  localOnlyButton.style.width = "34px"
  localOnlyButton.style.maxWidth = "34px"

  localOnlyButton.style.minHeight = "34px"
  localOnlyButton.style.height = "34px"
  localOnlyButton.style.maxHeight = "34px"

  localOnlyButton.style.backgroundColor = "transparent"
  localOnlyButton.style.display = "flex"
  localOnlyButton.style.alignItems = "center"
  localOnlyButton.style.justifyContent = "center"
  localOnlyButton.style.borderRadius = "9999px"
  localOnlyButton.style.cursor = "pointer"
  localOnlyButton.style.transition = "background-color 0.2s ease-in-out"
  localOnlyButton.onmouseover = () => {
    localOnlyButton.style.backgroundColor = "rgba(134, 179, 0, 0.1)"
  }
  localOnlyButton.onmouseout = () => {
    localOnlyButton.style.backgroundColor = "transparent"
  }

  localOnlyButton.onclick = () => {
    browser.storage.sync.get(["misskey_local_only"]).then(result => {
      const localOnly = result?.misskey_local_only ?? false
      browser.storage.sync.set({ misskey_local_only: !localOnly })
      updateLocalOnlyIcon()
    })
  }

  return localOnlyButton
}

const updateLocalOnlyButton = (localOnlyButton, localOnly) => {
  if (localOnly) {
    localOnlyButton.innerHTML = local_only_icon
  } else {
    localOnlyButton.innerHTML = global_icon
  }
}

/**
 * content_script/UI/MisskeyPostButton.ts
 */
const misskeyButtonClassName = "misskey-button"

const createMisskeyPostButton = (tweetToMisskeyFunc, tweetButton) => {
  const misskeyIcon = document.createElement("img")
  misskeyIcon.src = browser.runtime.getURL("misskey_icon.png")
  misskeyIcon.style.width = "24px"
  misskeyIcon.style.height = "24px"
  misskeyIcon.style.verticalAlign = "middle"
  misskeyIcon.style.display = "inline-block"
  misskeyIcon.style.userSelect = "none"

  const misskeybutton = document.createElement("button")
  misskeybutton.appendChild(misskeyIcon)
  misskeybutton.className = misskeyButtonClassName
  misskeybutton.style.backgroundColor = "rgb(134, 179, 0)"
  misskeybutton.style.borderRadius = "9999px"
  misskeybutton.style.height = "36px"
  misskeybutton.style.width = "36px"
  misskeybutton.style.marginLeft = "8px"
  misskeybutton.style.marginRight = "8px"
  misskeybutton.style.outline = "none"
  misskeybutton.style.display = "flex"
  misskeybutton.style.alignItems = "center"
  misskeybutton.style.justifyContent = "center"
  misskeybutton.style.border = "none"

  misskeybutton.onmouseover = () => {
    misskeybutton.style.backgroundColor = "rgb(100, 134, 0)"
  }
  misskeybutton.onmouseout = () => {
    misskeybutton.style.backgroundColor = "rgb(134, 179, 0)"
  }
  misskeybutton.style.transition = "background-color 0.2s ease-in-out"

  misskeybutton.onclick = () => {
    misskeybutton.disabled = true
    misskeybutton.style.opacity = "0.5"
    tweetToMisskeyFunc().then(() => {
      misskeybutton.style.opacity = "1"
      misskeybutton.disabled = false
      browser.storage.sync.get(["misskey_auto_tweet"]).then(result => {
        const autoTweet = result?.misskey_auto_tweet ?? false
        if (autoTweet) tweetButton.click()
      })
    })
  }

  return misskeybutton
}

const syncDisableState = (tweetButton, misskeybutton) => {
  const syncOpacity = () => {
    const isDisabled =
      parseFloat(window.getComputedStyle(tweetButton).opacity) != 1
    if (isDisabled) {
      misskeybutton.disabled = true
      misskeybutton.style.opacity = "0.5"
      misskeybutton.style.cursor = "default"
    } else {
      misskeybutton.disabled = false
      misskeybutton.style.opacity = "1"
      misskeybutton.style.cursor = "pointer"
    }
  }

  const observer = new MutationObserver(mutations => {
    mutations.forEach(mutation => {
      if (mutation.type !== "attributes") return
      if (mutation.attributeName !== "class") return
      syncOpacity()
    })
  })

  syncOpacity()

  observer.observe(tweetButton, { attributes: true })
}

/**
 * content_script/UI/Notification.ts
 */
class Notification {
  close() {
    console.log("close", this)
    this._close()
  }

  constructor(text, type, duration) {
    this.text = text
    this.type = type
    this.duration = duration
    this._closePromise = new Promise(resolve => {
      this._close = resolve
    })
  }
}

const notificationStack = []

let currentNotification = null

const _showNotification = notification => {
  if (currentNotification) {
    notificationStack.push(notification)
    return
  }

  currentNotification = notification

  const notificationBar = document.createElement("div")
  notificationBar.textContent = notification.text
  notificationBar.style.position = "fixed"
  notificationBar.style.top = "0"
  notificationBar.style.left = "0"
  notificationBar.style.right = "0"
  if (notification.type === "success") {
    notificationBar.style.backgroundColor = "rgb(134, 179, 0)"
  } else if (notification.type === "error") {
    notificationBar.style.backgroundColor = "rgb(211, 30, 30)"
  }

  notificationBar.style.color = "white"
  notificationBar.style.padding = "8px"
  notificationBar.style.zIndex = "9999"
  notificationBar.style.fontSize = "16px"
  notificationBar.style.textAlign = "center"
  notificationBar.style.fontFamily = "sans-serif"
  notificationBar.style.userSelect = "none"
  notificationBar.style.pointerEvents = "none"

  // show animation
  notificationBar.style.transition = "opacity 0.2s ease-in-out"
  notificationBar.style.opacity = "0"
  setTimeout(() => {
    notificationBar.style.opacity = "1"
  }, 0)

  document.body.appendChild(notificationBar)

  notification._closePromise.then(() => {
    notificationBar.style.opacity = "0"

    setTimeout(() => {
      document.body.removeChild(notificationBar)
    }, 2000)

    currentNotification = null
    const nextNotification = notificationStack.shift()

    if (nextNotification) {
      _showNotification(nextNotification)
    }
  })

  setTimeout(() => {
    notification.close()
  }, notification.duration)
}

const showNotification = (text, type, duration = 2000) => {
  const notification = new Notification(text, type, duration)

  _showNotification(notification)

  return notification
}

/**
 * content_script/UI/ScopeButton.ts
 */
const scopeButtonClassName = "misskey-scope-button"

const createScopeButton = () => {
  const scopeButton = document.createElement("div")

  const updateScopeIcon = () =>
    browser.storage.sync.get(["misskey_scope"]).then(result => {
      const scope = result?.misskey_scope ?? "public"
      updateScopeButton(scopeButton, scope)
    })

  setInterval(() => {
    updateScopeIcon()
  }, 2000)

  updateScopeIcon()

  browser.storage.sync.get(["misskey_access"]).then(result => {
    const access = result?.misskey_access ?? true
    if (!access) {
      scopeButton.style.display = "none"
    }
  })
  scopeButton.className = scopeButtonClassName

  scopeButton.style.minWidth = "34px"
  scopeButton.style.width = "34px"
  scopeButton.style.maxWidth = "34px"

  scopeButton.style.minHeight = "34px"
  scopeButton.style.height = "34px"
  scopeButton.style.maxHeight = "34px"

  scopeButton.style.backgroundColor = "transparent"
  scopeButton.style.display = "flex"
  scopeButton.style.alignItems = "center"
  scopeButton.style.justifyContent = "center"
  scopeButton.style.borderRadius = "9999px"
  scopeButton.style.cursor = "pointer"
  scopeButton.style.transition = "background-color 0.2s ease-in-out"
  scopeButton.onmouseover = () => {
    scopeButton.style.backgroundColor = "rgba(134, 179, 0, 0.1)"
  }
  scopeButton.onmouseout = () => {
    scopeButton.style.backgroundColor = "transparent"
  }

  scopeButton.onclick = () => {
    if (isShowingScopeModal()) {
      closeScopeModal()
    } else {
      showScopeModal(scopeButton)
    }
  }

  return scopeButton
}

/**
 * content_script/UI/ScopeModal.ts
 */
const createScopeModal = callback => {
  const modal = document.createElement("div")
  modal.style.fontFamily = "sans-serif"
  modal.style.position = "absolute"
  modal.style.width = "200px"
  modal.style.minWidth = "200px"
  modal.style.top = "45px"
  modal.style.backgroundColor = "white"
  modal.style.borderRadius = "10px"
  modal.style.boxShadow =
    "rgba(101, 119, 134, 0.2) 0px 0px 15px, rgba(101, 119, 134, 0.15) 0px 0px 3px 1px"
  // transition on opacity
  modal.style.transition = "opacity 0.2s ease 0s"

  // place pin at top center
  const modal_pin = document.createElement("div")
  modal_pin.innerHTML = modal_pin_icon
  modal_pin.style.fill = "white"
  modal_pin.style.width = "24px"
  modal_pin.style.height = "24px"
  modal_pin.style.position = "absolute"
  modal_pin.style.top = "-12px"
  modal_pin.style.left = "calc(50% - 12px)"
  modal.appendChild(modal_pin)

  const html = `
  <style>
    .misskey_access_scope {
      list-style: none;
      padding: 0;
      margin: 0;
    }

    .misskey_access_scope h5 {
      margin: 0;
      padding: 8px;
      padding-left: 16px;
      font-size: 14px;
      font-weight: bold;
      border-bottom: 1px solid rgb(230, 236, 240);
    }

    .misskey_access_scope li {
      display: flex;
      align-items: center;
      padding: 8px;
      cursor: pointer;
      transition: background-color 0.1s ease 0s;
    }

    .misskey_access_scope li:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }

    .misskey_access_scope li span {
      font-size: 14px;
      margin-left: 8px;
      color: rgb(101, 119, 134);
    }

    .misskey_access_scope li[selcted] span {
      font-weight: bold;
      color: rgb(134, 179, 0);
    }

    .misskey_access_scope li svg {
      fill: rgb(101, 119, 134);
      width: 24px;
      height: 24px;
    }

    .misskey_access_scope li[selcted] svg {
      fill: rgb(134, 179, 0);
    }


  </style>

  <ul class='misskey_access_scope'>
    <h5>
      公開範囲 <span style='font-size: 12px; color: rgb(101, 119, 134);'> (Misskey) </span>
    </h5>

    <li selcted>
      ${public_scope_icon}
      <span>パブリック</span>
    </li>
    <li>
      ${home_scope_icon}
      <span>ホーム</span>
    </li>
    <li>
      ${lock_scope_icon}
      <span>フォロワー</span>
    </li>
    <hr>
    <li class='misstter_setup'>
      <span>Misstterの設定</span>
    </li>
  </ul>
  `

  const modal_content = document.createElement("div")
  modal_content.innerHTML = html

  const liElements = Array.from(modal_content.querySelectorAll("ul li:not([id])"))

  liElements.forEach((li, i) => {
    li.addEventListener("click", () => {
      setModalSelection(i)
      if (i === 0) {
        callback("public")
      } else if (i === 1) {
        callback("home")
      } else if (i === 2) {
        callback("followers")
      }
    })
  })

  // Misstterの設定項目を投稿の公開範囲設定ボタンに追加
  const misstterSetup = modal_content.querySelector(".misstter_setup")
  misstterSetup.addEventListener("click", () => {
    showSetupModal()
  })

  const setModalSelection = index => {
    liElements.forEach((li, i) => {
      if (i === index) {
        li.attributes.setNamedItem(document.createAttribute("selcted"))
      } else if (li.attributes.getNamedItem("selcted")) {
        li.attributes.removeNamedItem("selcted")
      }
    })
  }

  const updateSelection = () =>
    browser.storage.sync.get(["misskey_scope"]).then(result => {
      const scope = result?.misskey_scope ?? "public"
      if (scope === "public") {
        setModalSelection(0)
      } else if (scope === "home") {
        setModalSelection(1)
      } else if (scope === "followers") {
        setModalSelection(2)
      }
    })

  const checkID = setInterval(() => {
    try {
      updateSelection()
    } catch (e) {
      clearInterval(checkID)
    }
  }, 2000)
  updateSelection()

  modal.appendChild(modal_content)
  return modal
}

const scopeModelHandler = scope => {
  browser.storage.sync.set({ misskey_scope: scope })
  document.querySelectorAll(".misskey-scope-button").forEach(button => {
    updateScopeButton(button, scope)
  })
}

// Global scope modal
const scopeModel = createScopeModal(scopeModelHandler)

const showScopeModal = scopeButton => {
  if (!isShowingScopeModal()) {
    document.body.appendChild(scopeModel)
  }

  // set position of modal
  const rect = scopeButton.getBoundingClientRect()
  scopeModel.style.top = `${rect.top + window.scrollY + 40}px`
  scopeModel.style.left = `${rect.left + window.scrollX - 83}px`
}

const isShowingScopeModal = () => {
  return document.body.contains(scopeModel)
}

const handleDocumentClick = e => {
  let target = e.target
  while (target) {
    if (target.className === "misskey-scope-button") return
    target = target.parentNode
  }
  closeScopeModal()
}

window.addEventListener("click", handleDocumentClick)

const closeScopeModal = () => {
  if (!isShowingScopeModal()) return

  // animation
  scopeModel.style.opacity = "0"
  setTimeout(() => {
    scopeModel.style.opacity = "1"
    // remove modal
    scopeModel.remove()
  }, 200)
}

const updateScopeButton = (scopeButton, scope) => {
  if (scope === "public") {
    scopeButton.innerHTML = public_scope_icon
  } else if (scope === "home") {
    scopeButton.innerHTML = home_scope_icon
  } else {
    scopeButton.innerHTML = lock_scope_icon
  }
  scopeButton.children[0].style.fill = "rgb(134, 179, 0)"
}

/**
 * 設定
 * popup/Popup.tsxを参考に作成
 */
const close_icon = `
<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon icon-tabler icons-tabler-outline icon-tabler-x">
    <path stroke="none" d="M0 0h24v24H0z" fill="none"/>
    <path d="M18 6l-12 12" />
    <path d="M6 6l12 12" />
</svg>
`

const createSetupModal = () => {
  let misskey_server = localStorage.getItem("misskey_server") ?? DEFAULT_INSTANCE_URL
  let misskey_token = localStorage.getItem("misskey_token") ?? "xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
  let misskey_cw = (localStorage.getItem("misskey_cw") ?? "false") == "true"
  let misskey_sensitive = (localStorage.getItem("misskey_sensitive") ?? "false") == "true"
  let misskey_access = (localStorage.getItem("misskey_access") ?? "true") == "true"
  let misskey_show_local_only = (localStorage.getItem("misskey_show_local_only") ?? "true") == "true"
  let misskey_auto_tweet = (localStorage.getItem("misskey_auto_tweet") ?? "false") == "true"

  const modal = document.createElement("div")
  modal.style.display = "flex"
  modal.style.justifyContent = "center"
  modal.style.alignItems = "center"
  modal.style.position = "fixed"
  modal.style.top = "0"
  modal.style.left = "0"
  modal.style.width = "100%"
  modal.style.height = "100%"
  modal.style.backgroundColor = "rgba(0, 0, 0, 0.5)"
  // transition on opacity
  modal.style.transition = "opacity 0.2s ease 0s"

  const html = `
  <style>
    .setup-modal {
      max-width: 400px;
      max-height: 100%;
      overflow: auto;
      font-size: 16px;
      font-family: Roboto, Helvetica, Arial, sans-serif;
      color: black;
      background-color: white;
    }
    .setup-modal h6 {
      box-shadow: rgba(0, 0, 0, 0.2) 0px 2px 4px -1px,
                  rgba(0, 0, 0, 0.14) 0px 4px 5px 0px,
                  rgba(0, 0, 0, 0.12) 0px 1px 10px 0px;
      margin: 0;
      padding-left: 16px;
      min-height: 48px;
      font-weight: 500;
      font-size: 20px;
      line-height: 48px;
      color: white;
      background-color: #1976d2;
    }
    .setup-modal .close-button-wrapper {
      width: 48px;
      height: 48px;
      display: flex;
      justify-content: center;
      align-items: center;
      float: right;
    }
    .setup-modal .close-button {
      width: 24px;
      height: 24px;
      line-height: 24px;
      cursor: pointer;
    }
    .setup-modal>div {
      margin: 16px auto;
      padding: 0 16px;
    }
    .setup-modal .small-text {
      font-size: 10px;
    }
    .setup-modal label {
      font-size: 15px;
    }
    .setup-modal label:has(input:disabled) {
      color: gray;
    }
    .setup-modal input {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
    }
    .setup-modal input[type="text"] {
      padding: 8.5px 14px;
      width: 100%;
      box-sizing: border-box;
      font-size: 16px;
      color: black;
      background-color: white;
      border: 1px solid rgba(0, 0, 0, 0.23);
      border-radius: 4px;
    }
    .setup-modal input[type="text"]:hover {
      border: 1px solid black;
    }
    .setup-modal input[type="text"]:focus {
      border: 1px solid #1976d2;
      outline: 1px solid #1976d2;
    }
    .setup-modal p label {
      display: flex;
      align-items: center;
      cursor: pointer;
    }
    .setup-modal p label:has(input:disabled) {
      cursor: not-allowed;
    }
    .setup-modal input[type="checkbox"] {
      margin: 0;
      margin-right: 12px;
      position: relative;
      width: 18px;
      height: 18px;
      vertical-align: middle;
      border: 2px solid #000;
      border-radius: 2px;
      cursor: pointer;
    }
    .setup-modal input[type="checkbox"]:checked {
      border: 0;
      background-color: #1976d2;
    }
    .setup-modal input[type="checkbox"]:checked:before {
      content: "";
      position: absolute;
      top: 0;
      left: 5px;
      transform: rotate(45deg);
      width: 6px;
      height: 12px;
      border-right: 2px solid white;
      border-bottom: 2px solid white;
    }
    .setup-modal input[type="checkbox"]:disabled {
      background-color: gray;
      cursor: not-allowed;
    }
    .setup-modal .donation {
      display: block;
      color: #1976d2;
      text-decoration: none;
    }
    .setup-modal .donation:hover {
      text-decoration: underline;
    }
  </style>
  <h6>Misstter<div class='close-button-wrapper'><div class='close-button'>${close_icon}</div></div></h6>
  <div>
    <p class='small-text'>サーバーのURLを入力してください。デフォルトではmisskey.ioが設定されています。</p>
    <label>
      Server URL<br>
      <input type='text' class='misskey_server' placeholder='${DEFAULT_INSTANCE_URL}' value='${misskey_server}'>
    </label>
    <p class='small-text'>
      Tokenはお使いのMisskeyサーバーの 「設定 &#62; API」の画面から取得できます。<br>
      投稿権限とファイルアップロード権限が必要です。(全てを許可すると自動で設定されます)
    </p>
    <label>
      Token<br>
      <input type='text' class='misskey_token' placeholder='xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx' value='${misskey_token}'>
    </label>
    <p><label><input type='checkbox' class='misskey_cw'${misskey_cw ? " checked" : ""}>Misskeyへの投稿にCWを設定する。</label></p>
    <p><label><input type='checkbox' class='misskey_sensitive'${misskey_sensitive ? " checked" : ""}>投稿する全ての画像にNSFWを設定する。</label></p>
    <p><label><input type='checkbox' class='misskey_access'${misskey_access ? " checked" : ""} disabled>投稿の公開範囲設定ボタンを表示する。</label></p>
    <p><label><input type='checkbox' class='misskey_show_local_only'${misskey_show_local_only ? " checked" : ""}>投稿の連合なし設定ボタンを表示する。</label></p>
    <p><label><input type='checkbox' class='misskey_auto_tweet'${misskey_auto_tweet ? " checked" : ""}>Misskeyへの投稿後自動的にツイートする。</label></p>

    <p class='donation'>開発の支援をお願いします！ / Donation</p>
  </div>
  `

  const modal_content = document.createElement("div")
  modal_content.innerHTML = html
  modal_content.className = "setup-modal"

  const closeButton = modal_content.querySelector(".close-button")
  closeButton.addEventListener("click", () => {
    closeSetupModal()
  })

  const misskeyServer = modal_content.querySelector(".misskey_server")
  misskeyServer.addEventListener("change", () => {
    let server = misskeyServer.value
    if (!server.startsWith('https://')) { server = 'https://' + server }
    if (server.endsWith('/')) { server = server.slice(0, -1) }
    localStorage.setItem("misskey_server", server)
  })

  const misskeyToken = modal_content.querySelector(".misskey_token")
  misskeyToken.addEventListener("change", () => {
    localStorage.setItem("misskey_token", misskeyToken.value)
  })

  const checkboxElements = Array.from(modal_content.querySelectorAll('input[type="checkbox"]'))

  checkboxElements.forEach((checkbox, i) => {
    checkbox.addEventListener("change", () => {
      localStorage.setItem(checkbox.className, checkbox.checked)
    })
  })

  const donation = modal_content.querySelector(".donation")
  donation.addEventListener("click", () => {
    window.open(
      "https://pielotopica.booth.pm/items/4955538",
      "_blank",
      "noreferrer"
    );
  })

  modal.appendChild(modal_content)
  return modal
}

// Global setup modal
const setupModel = createSetupModal()

const showSetupModal = () => {
  if (!isShowingSetupModal()) {
    document.body.appendChild(setupModel)
  }
}

const isShowingSetupModal = () => {
  return document.body.contains(setupModel)
}

const handleDocumentClickSetup = e => {
  let target = e.target
  while (target) {
    if (target.className === "misstter_setup" ||
        target.className === "setup-modal") return
    target = target.parentNode
  }
  closeSetupModal()
}

window.addEventListener("click", handleDocumentClickSetup)

const closeSetupModal = () => {
  if (!isShowingSetupModal()) return

  // animation
  setupModel.style.opacity = "0"
  setTimeout(() => {
    setupModel.style.opacity = "1"
    // remove modal
    setupModel.remove()
  }, 200)
}

(() => {
	if (localStorage.getItem("misskey_token") == null) showSetupModal();
})();