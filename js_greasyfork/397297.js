// ==UserScript==
// @name         Freyja
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Love will keep us together
// @icon         https://image.flaticon.com/icons/svg/2384/2384599.svg
// @author       Patrick Pang
// @include      *://www.bilibili.com/video/av*
// @include      *://www.bilibili.com/bangumi/play/ep*
// @include      *://www.bilibili.com/bangumi/play/ss*
// @include      *://m.bilibili.com/bangumi/play/ep*
// @include      *://m.bilibili.com/bangumi/play/ss*
// @include      *://bangumi.bilibili.com/anime/*
// @include      *://bangumi.bilibili.com/movie/*
// @include      *://www.bilibili.com/bangumi/media/md*
// @include      *://www.bilibili.com/blackboard/html5player.html*
// @require      https://unpkg.com/peerjs@1.2.0/dist/peerjs.min.js
// @require      https://unpkg.com/lodash@4.17.15/lodash.min.js
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/397297/Freyja.user.js
// @updateURL https://update.greasyfork.org/scripts/397297/Freyja.meta.js
// ==/UserScript==

// Connection metadata
// const me = "freyja-patrick-7264";
// const you = "freyja-suyi-7894";
const me = "freyja-suyi-7894";
const you = "freyja-patrick-7264";

// Panel template
const template = `
  <div class="freyja-panel">
    <button class="freyja-button">❤</button>

    <style>
      .freyja-panel {
        position: fixed;
        right: 30px;
        bottom: 30px;

        visibility: hidden;
      }

      .freyja-button {
        outline: none;
        border: none;
        cursor: pointer;

        background: transparent;
        color: pink;

        padding: 10px;
        font-size: 32px;

        text-shadow: none;
        transition-duration: 0.5s;
      }

      .freyja-button:hover {
        text-shadow: 0 0 16px tomato;
        transform: scale(1.2);
      }

      .freyja-button:active {
        transform: scale(1);
        transition-duration: 0.1s;
      }

      .freyja-button.glow {
        text-shadow: 0 0 16px tomato;
        transition-duration: 0.1s;
      }

      .freyja-button.connected {
        color: tomato;
      }
    </style>
  </div>
`;

// Connect to PeerJS server early
const peer = new Peer(me, { host: "freyja-server.glitch.me", secure: true });
// Only one active connection
// => only one to one sync
// => expect only one peer is initiator
let conn;
// Last state synchronized between peers
// [paused: Boolean, time: Number]
let state;

// Insert panel into document
const panel = document.createElement("div");
document.body.append(panel);
panel.outerHTML = template;

// Show panel after connected to PeerJS server
peer.on("open", () => {
  console.log("Connected to PeerJS server");
  const panel = document.querySelector(".freyja-panel");
  panel.style.visibility = "visible";
});

// Initiator: press button to connect
const initiateEvent = document
  .querySelector("button.freyja-button")
  .addEventListener(
    "click",
    e => {
      // Update global connection
      conn = peer.connect(you);

      console.log("Connection:", conn);
      console.log("Sent connection");

      // After connected, sync my progress, start watching mode
      conn.on("open", () => {
        sync();
        start();
      });
      // Handle incoming events
      conn.on("data", handle);
    },
    { once: true } // Can initiate once only
  );

// Receiver: wait for incoming connection
peer.on("connection", in_conn => {
  console.log("Received connection");

  // Disable connection initiation
  document
    .querySelector("button.freyja-button")
    .removeEventListener("click", initiateEvent);

  // Update global connection
  conn = in_conn;
  // Handle incoming events
  conn.on("data", handle);
  // Start watching mode
  start();
});

peer.on("close", () => console.log("Peer Closed"));
peer.on("disconnected", () => console.log("Disconnected From PeerJS server"));
peer.on("error", err => console.error(err));

// Watching Mode: listen events from player & refresh button
function start() {
  console.log("Started watching mode");

  connected();
  glow();

  const player = document.querySelector("video");

  player.addEventListener("play", sync);
  player.addEventListener("pause", sync);
  player.addEventListener("seeked", sync);

  document
    .querySelector("button.freyja-button")
    .addEventListener("click", sync);

  peer.on("close", () => console.log("Connection Closed"));
  peer.on("error", err => console.error(err));
}

// Handle incoming events
function handle(newState) {
  // Return if the state is unchanged
  if (_.isEqual(state, newState)) return;

  glow();

  const player = document.querySelector("video");
  const [paused, time] = newState;
  state = newState;

  console.log("Receive:", newState);

  // Sync time
  player.currentTime = time;

  // Sync paused
  if (paused) player.pause();
  else player.play();
}

// Sync state
function _sync() {
  if (!conn) return;

  const player = document.querySelector("video");
  // Return if the state is unchanged
  // Round time to seconds exclude roundtrip delay
  const newState = [player.paused, Math.round(player.currentTime)];
  if (_.isEqual(state, newState)) return;

  console.log("Connection:", conn);
  console.log("Send:", newState);

  conn.send(newState);
  state = newState;
}
// Throttle the connection to avoid echo effect
const sync = _.throttle(_sync, 1000);

// Glowing Animation for events
function glow() {
  const button = document.querySelector("button.freyja-button");
  button.classList.add("glow");
  setTimeout(() => button.classList.remove("glow"), 500);
}

// Show connected state
function connected() {
  const button = document.querySelector("button.freyja-button");
  button.classList.add("connected");
}
