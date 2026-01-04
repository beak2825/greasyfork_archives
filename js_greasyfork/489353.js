// ==UserScript==
// @name     Add banner to github PRs for easier copying of the PR's head ref
// @description What the title says
// @namespace ahappyviking
// @version  1
// @match 	 https://github.com/*
// @require  https://unpkg.com/bundled-github-url-detector@1.0.0/index.js
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/489353/Add%20banner%20to%20github%20PRs%20for%20easier%20copying%20of%20the%20PR%27s%20head%20ref.user.js
// @updateURL https://update.greasyfork.org/scripts/489353/Add%20banner%20to%20github%20PRs%20for%20easier%20copying%20of%20the%20PR%27s%20head%20ref.meta.js
// ==/UserScript==

const gh = githubUrlDetection

const ELEMENT_ID = "head-ref-banner"


const main = () => {
  const preExistingElement = document.getElementById(ELEMENT_ID)
  if (preExistingElement){
    preExistingElement.remove()
  }

  if (!gh.isPR() && !gh.isActionRun()) return
  const baseRefNameParent = document.querySelector(".commit-ref.css-truncate.user-select-contain.head-ref")
  const textContent = baseRefNameParent?.querySelector("span")
  let baseRefName = textContent?.textContent
  if (!baseRefName) baseRefName = "[UNKNOWN]"

  const urlTokens = window.location.href.split("/")

  let baseUrl = ""
  if (gh.isPR()){
    baseUrl = urlTokens.slice(0, urlTokens.indexOf("pull") + 2).join("/")
  }else{
    const searchParams = (new URL(window.location)).searchParams;
    let prNumber = searchParams.get("pr");
    if (!prNumber) return
    baseUrl = urlTokens.slice(0, urlTokens.indexOf("actions")).join("/") + `/pull/${prNumber}`
  }
  console.log(baseUrl)

  const parent = document.createElement('div')
  parent.id = ELEMENT_ID
  parent.style.position = "fixed"
  parent.style.top = 0
  parent.style.left = "50%"
  parent.style.translate = "translateX(-50%)"
  parent.style.webkitTransform = "translateX(-50%)"
  parent.style.display = "flex"
  parent.style.flexDirection = "row"

  const baseStyle = {
    width: "fit-content",
    height: "14px",
    fontSize: "10px",
    cursor: "pointer",
    fontWeight: "bold",
    textAlign: "center",
    color: "white",
    paddingLeft: "16px",
    paddingRight: "16px",
  }

  const headRefEle = document.createElement("div")
  for (const [property, value] of Object.entries(baseStyle)) headRefEle.style[property] = value;
  headRefEle.style.background = "#3f5e18"
  headRefEle.textContent = baseRefName
  headRefEle.addEventListener("click", () => navigator.clipboard.writeText(baseRefName))

  const convoEle = document.createElement("div")
  for (const [property, value] of Object.entries(baseStyle)) convoEle.style[property] = value;
  convoEle.style.background = "#5c286c"
  convoEle.textContent = "Conversation"
  const convoEleParent = document.createElement("a")
  convoEleParent.href = baseUrl
  convoEleParent.appendChild(convoEle)

  const filesEle = document.createElement("div")
  for (const [property, value] of Object.entries(baseStyle)) filesEle.style[property] = value;
  filesEle.style.background = "#5c286c"
  filesEle.textContent = "Review"
  const filesEleParent = document.createElement("a")
  filesEleParent.href = baseUrl + "/files"
  filesEleParent.appendChild(filesEle)


  parent.appendChild(convoEleParent)
  parent.appendChild(headRefEle)
  parent.appendChild(filesEleParent)
  document.body.appendChild(parent)
}

main()
document.addEventListener("soft-nav:end", main);
document.addEventListener("navigation:end", main);
