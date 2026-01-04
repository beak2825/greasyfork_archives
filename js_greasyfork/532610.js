// ==UserScript==
// @name        哔哩哔哩一起看
// @namespace   Violentmonkey Scripts
// @match       https://www.bilibili.com/video/*
// @grant       none
// @version     1.0
// @author      陆陆侠
// @license     MIT
// @description 2025/4/12 10:39:44
// @require     https://unpkg.com/playroomkit/multiplayer.full.umd.js
// @downloadURL https://update.greasyfork.org/scripts/532610/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%80%E8%B5%B7%E7%9C%8B.user.js
// @updateURL https://update.greasyfork.org/scripts/532610/%E5%93%94%E5%93%A9%E5%93%94%E5%93%A9%E4%B8%80%E8%B5%B7%E7%9C%8B.meta.js
// ==/UserScript==

(function() {
  'use strict';

  document.onreadystatechange = () => {
    if (document.readyState === 'complete') {

      // 注入 CSS
      const style = document.createElement('style');
      style.innerHTML = `
        .bpx-player-ctrl-together {
          width: max-content;
          margin-right: 10px;
        }
        .bpx-player-ctrl-together-result {
          cursor: pointer;
          font-size: 14px;
          font-weight: 600;
        }
        .bpx-player-ctrl-together-menu {
          bottom: 0px;
          left: 50%;
          margin: 0;
          position: absolute;
          transform: translateX(-50%);
          width: max-content;
          padding-bottom: 41px;
          opacity: 0;
          pointer-events: none;
        }
        .bpx-player-ctrl-together-menu-content {
          background-color: hsla(0, 0%, 8%, .9);
          border-radius: 2px;
          cursor: pointer;
          padding: 4px 8px;
        }
        .bpx-player-ctrl-together:hover .bpx-player-ctrl-together-menu {
          opacity: 1;
          pointer-events: auto;
        }
        .bpx-player-ctrl-together-menu p {
          font-size: 14px;
        }
        .bpx-player-ctrl-together-btn:hover {
          color: #00A1D6;
        }
      `;
      document.head.appendChild(style);

      // 添加按钮
      const observer = new MutationObserver((mutationsList, observer) => {
        const controlList = document.querySelector('.bpx-player-control-bottom-right');
        if (controlList) {
          observer.disconnect(); // 停止监听
          // 在这里执行后续代码
          const button = document.createElement('div');
          button.className = 'bpx-player-ctrl-btn bpx-player-ctrl-together';
          button.innerHTML = `
          <div class="bpx-player-ctrl-together-result">一起看</div>
          <div class="bpx-player-ctrl-together-menu">
            <div class="bpx-player-ctrl-together-menu-content">
              <p class="bpx-player-ctrl-together-btn bpx-player-ctrl-together-create" style="display: none;">创建房间</p>
              <p class="bpx-player-ctrl-together-btn bpx-player-ctrl-together-copy" style="display: none;">复制邀请链接</p>
              <div class="bpx-player-ctrl-together-room-info" style="display: none;">
                <p class="bpx-player-ctrl-together-room-info-id">当前房间号：</p>
                <p class="bpx-player-ctrl-together-room-info-num">当前房间人数：</p>
              </div>
            </div>
          </div>
          `
          controlList.appendChild(button);

          const createButton = button.querySelector('.bpx-player-ctrl-together-create');
          const copyButton = button.querySelector('.bpx-player-ctrl-together-copy');
          const roomInfo = button.querySelector('.bpx-player-ctrl-together-room-info');
          const roomId = button.querySelector('.bpx-player-ctrl-together-room-info-id');
          const roomNum = button.querySelector('.bpx-player-ctrl-together-room-info-num');

          copyButton.addEventListener('click', () => {
            navigator.clipboard.writeText(location.href)
          });

          const initRoom = (id = undefined) => {
            let num = 0;
            Playroom.insertCoin({
              roomCode: id,
              skipLobby: true,
            }, () => {
              const video = document.querySelector('.bpx-player-video-wrap video');

              Playroom.onPlayerJoin((player) => {
                num++;
                roomNum.innerHTML = `当前房间人数：${num}`;
                player.onQuit(() => {
                  num--;
                  roomNum.innerHTML = `当前房间人数：${num}`;
                })
                if (Playroom.isHost()) {
                  Playroom.RPC.call('seek', { time: video.currentTime }, Playroom.RPC.Mode.OTHERS);
                  if (video.paused) {
                    Playroom.RPC.call('pause', null, Playroom.RPC.Mode.OTHERS);
                  } else {
                    Playroom.RPC.call('play', null, Playroom.RPC.Mode.OTHERS);
                  }
                }
              });

              roomInfo.style.display = 'block';
              roomId.innerHTML = `当前房间号：${Playroom.getRoomCode()}`;

              createButton.style.display = 'none';
              copyButton.style.display = 'block';

              let isRemoteOperation = false;

              Playroom.RPC.register('play', () => {
                isRemoteOperation = true;
                video.play().finally(() => {
                  isRemoteOperation = false;
                });
              });

              Playroom.RPC.register('pause', () => {
                isRemoteOperation = true;
                video.pause();
              });

              Playroom.RPC.register('seek', (data) => {
                isRemoteOperation = true;
                video.currentTime = data.time;
              });

              video.addEventListener('play', () => {
                if (!isRemoteOperation) {
                  Playroom.RPC.call('play', null, Playroom.RPC.Mode.OTHERS);
                }
              });

              video.addEventListener('pause', () => {
                if (!isRemoteOperation) {
                  Playroom.RPC.call('pause', null, Playroom.RPC.Mode.OTHERS);
                } else {
                  isRemoteOperation = false;
                }
              });

              video.addEventListener('seeked', () => {
                if (!isRemoteOperation) {
                  Playroom.RPC.call('seek', { time: video.currentTime }, Playroom.RPC.Mode.OTHERS);
                } else {
                  isRemoteOperation = false;
                }
              });
            })
          }

          if (location.hash.startsWith('#r=')) {
            const dialog = document.createElement('dialog');
            dialog.innerHTML = `
              <form method="dialog">
                <p>是否加入一起看房间：${location.hash.substring(3)}</p>
                <button value="true">确定</button>
                <button value="false">取消</button>
              </form>
            `;
            document.body.appendChild(dialog);
            dialog.showModal();
            dialog.addEventListener('close', (event) => {
              const result = event.target.returnValue;
              if (result === 'true') {
                dialog.remove();
                const id = location.hash.substring(3);
                initRoom(id);
              } else {
                dialog.remove();
                location.hash = '';
                createButton.style.display = 'block';
                createButton.addEventListener('click', () => {
                  initRoom();
                });
              }
            });
          } else {
            createButton.style.display = 'block';
            createButton.addEventListener('click', () => {
              initRoom();
            });
          }
        }
      });

      // 开始监听整个文档的子节点变化
      observer.observe(document.body, { childList: true, subtree: true });
    }
  };
})();