// ==UserScript==
// @name        KoGaMa Typing Indicator
// @namespace   KoGaMa Scripts
// @match       https://*.kogama.com/*
// @match       https://kogama.com.br/*
// @sandbox     DOM
// @noframes
// @version     0.2.7
// @author      awxi
// @description Incredibly scuffed typing indicator system for KoGaMa
// @supportURL  https://discord.gg/D9JAg2FAka
// @homepageURL https://www.aethar.net/userscripts/
// @require     https://unpkg.com/socket.io-client@4.6.0/dist/socket.io.min.js#sha256-BAHeM3AfHK0W7PlSiZ0jmQtkN9CltzNVJO32vfuTJUI=
// @connect     kogama-typing-indicator-server.glitch.me
// @license     MIT
// @downloadURL https://update.greasyfork.org/scripts/471958/KoGaMa%20Typing%20Indicator.user.js
// @updateURL https://update.greasyfork.org/scripts/471958/KoGaMa%20Typing%20Indicator.meta.js
// ==/UserScript==


// Current class name for the chat header
const ChatHeaderClassName = "_2XzvN";
// Root elements
const contentRoot = document.getElementById("content");
const chatRoot = document.getElementById("chat-extended-side");

// Check if the user is currently logged in
const isAuthenticated = contentRoot.classList.contains("authenticated");

// Throw error to follow practice of returning early
if (!isAuthenticated) throw new Error("User is not authenticated");

// Retrieve page data
const pageData = parsePageData(retrieveCorrectScript());
// Retrieve current user's ID
const clientID = pageData.current_user.id;
// Retrieve KoGaMa server name
const server = location.hostname.match(/www|friends|br/)[0];

// Connect to socket
const socket = io("https://kogama-typing-indicator-server.glitch.me/");
// Retrieve cached map from localStorage
const cachedMapString = localStorage.getItem("username-to-id-map");
// Parse cached map
const cachedMapData = cachedMapString === null ? [] : JSON.parse(cachedMapString);
// Create and populate map using cached data
const usernameIDMap = new Map(cachedMapData);

// Subscribe to a personal room
socket.emit("subscribe", server, clientID);

// If the server is down, the socket will fail to connect
socket.once("connect_error", () => {
  // Log to console
  console.error("Server is unreachable");
  // Attempt to reconnect after 30 seconds
  setTimeout(() => socket.connect(), 30_000);
});

// Once the socket has connected to the server
socket.once("connect", () => {
  // Register event listener for input
  chatRoot.addEventListener("keypress", async (event) => {
    // Verify that the element receiving input is a textarea and that the socket is connected
    if (!event.target instanceof HTMLTextAreaElement || !socket.connected) return;
    // Retrieve friend username from chat header
    const friendUsername = retrieveCurrentFriend();
    // Create variable to hold friend profile ID
    let friendID = await retrieveIDFromUsername(friendUsername);
    // Check if the profile ID was successfully retrieved
    if (friendID === null) throw new Error("Friend profile ID could not be retrieved");
    // If the user has pressed enter
    if (event.keyCode === 13 && !event.shiftKey) {
      // Emit stop-typing event to friend
      socket.volatile.emit("stop-typing", friendID);
    } else {
      // Emit is-typing event to friend
      socket.volatile.emit("is-typing", friendID);
    }
  });
  // Create variable to hold typing indicator element
  let typingIndicator = null;
  // Whenever an is-typing event comes through
  socket.on("is-typing", async (chatterID) => {
    const currentFriendUsername = retrieveCurrentFriend();
    const currentFriendID = await retrieveIDFromUsername(currentFriendUsername);
    if (currentFriendID !== chatterID || typingIndicator !== null) return;
    const chatHeader = retrieveChatHeader();
    chatHeader.style.flex = "none";
    typingIndicator = createElement("span", {
      style: "flex: 1; margin-left: 4px;"
    }, [
      " is typing.."
    ]);
    chatHeader.parentElement.insertBefore(typingIndicator, chatHeader.nextElementSibling);
  });
  // Whenever a stop-typing event comes through
  socket.on("stop-typing", async(chatterID) => {
    if (typingIndicator === null) return;
    const chatHeader = retrieveChatHeader();
    chatHeader.style.flex = "1";
    typingIndicator.remove();
    typingIndicator = null;
  });
});

function retrieveChatHeader() {
  // Search for the chat header using the supplied class name
  const headerSearchResults = chatRoot.getElementsByClassName(ChatHeaderClassName);
  // Verify that the chat header exists
  if (headerSearchResults.length === 0) throw new Error("ChatHeaderClassName has changed");
  // Assign header to variable for ease of use
  const chatHeader = headerSearchResults[0];
  // Return chat header
  return chatHeader;
}

function retrieveCurrentFriend() {
  // Retrieve chat header
  const chatHeader = retrieveChatHeader();
  // Retrieve the friend username from header
  const friendUsername = chatHeader.firstChild.data;
  // Return username
  return friendUsername;
}

async function retrieveIDFromUsername(friendUsername) {
  let friendID = null;
  // Check if the username-to-id map has the username
  if (usernameIDMap.has(friendUsername)) {
    // Retrieve the profile ID from the map
    friendID = usernameIDMap.get(friendUsername);
  } else {
    // Retrieve profile ID manually
    try {
      // Search for the friend in the current server
      const friendSearchResponse = await fetch(`/user/?q=${encodeURIComponent(friendUsername)}`);
      // If an HTTP error has occured, throw an exception
      if (!friendSearchResponse.ok) throw new Error(`HTTP ${friendSearchResponse.status} - ${friendSearchResponse.statusText}`);
      // Retrieve the JSON response
      const friendSearchData = await friendSearchResponse.json();
      // Verify that the search results contain data
      if (friendSearchData.data.length === 0) throw new Error("Friend not found");
      // Retrieve friend profile ID from data
      friendID = friendSearchData.data[0].id;
      // Store the username and ID in map
      usernameIDMap.set(friendUsername, friendID);
      // Cache the map for later use
      localStorage.setItem("username-to-id-map", JSON.stringify(Array.from(usernameIDMap)));
    } catch(error) {
      // Log error to console
      console.error("Encountered error while retrieving friend ID", error);
    }
  }
  // Return profile ID
  return friendID;
}

// parsePageData: Accepts page body as string; Returns object with data from options.bootstrap
function parsePageData(body) {
  const firstIndex = body.indexOf("options.bootstrap = {") + 20;
  const lastIndex = body.indexOf("};", firstIndex) + 1;
  const data = body.substring(firstIndex, lastIndex);
  return JSON.parse(data);
}

// retrieveCorrectScript: Retrieves the script element containing the page data
function retrieveCorrectScript() {
	return [...document.getElementsByTagName("script")]
		.find(script => script.innerText.includes("options.bootstrap"))
		.innerText;
}

/**
 * awoi's createElement function - inspired by React's createElement(), Vue's h(), and Hyperscript's h()
 * Simple implementation, minimal error checking
 * > createElement(tag: string, attributes?: object, children?: Array<HTMLElement>|string): HTMLElement
 */
function createElement(tag, ...args) {
  const [tagName, ...tagAttributeMatches] = tag.split(/(?=[\.#])/);
  const element = document.createElement(tagName);
  const tagAttributes = tagAttributeMatches.reduce((object, value) => {
    if (value[0] === ".") {
      if (!object.class) object.class = value.slice(1);
      else object.class += value.replace(".", " ");
    } else object.id = value.slice(1);
    return object;
  }, {});
  const argAttributes = (typeof args[0] === "object" && !Array.isArray(args[0]))
    ? args.shift()
    : {};
  const children = (Array.isArray(args[0]) || typeof args[0] === "string")
    ? args.shift()
    : [];
  const attributes = ({ ...tagAttributes, ...argAttributes });
  for (const name of Object.keys(attributes)) {
    if (name.startsWith("on")) {
      const event = name.slice(2).toLowerCase();
      const handler = attributes[name];
      element.addEventListener(event, handler.bind(element));
    } else {
      element.setAttribute(name, attributes[name]);
    }
  }
  typeof children === "string"
    ? element.appendChild(document.createTextNode(children))
    : element.append(...children);
  return element;
};
