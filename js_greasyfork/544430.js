// ==UserScript==
// @name         Auto Reconnect-territorial.io
// @description  A simple script that handles automatic reconnection when the connection is lost
// @namespace    https://gist.github.com/maanimis/837624e57c1c11026d518cbdacc320c8
// @version      3.0
// @author       maanimis
// @match        https://territorial.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=territorial.io
// @grant        none
// @run-at       document-start
// @license MIT
// @downloadURL https://update.greasyfork.org/scripts/544430/Auto%20Reconnect-territorialio.user.js
// @updateURL https://update.greasyfork.org/scripts/544430/Auto%20Reconnect-territorialio.meta.js
// ==/UserScript==

(function () {
    "use strict";

    const RECONNECT_DELAY = 2000; // ms
    const MAX_RECONNECT_ATTEMPTS = 5;
    const MULTIPLIER = 1;

    const OriginalWebSocket = window.WebSocket;
    const connectionGroups = new Map();
    let groupCounter = 0;

    function WebSocketMultiplexer(url, protocols) {
        console.log(`[WebSocket Multiplier] Intercepted connection to: ${url}`);

        const groupId = ++groupCounter;
        const connections = [];

        const createConnection = (index, attempt = 1) => {
            try {
                const conn = new OriginalWebSocket(url, protocols);
                conn._groupId = groupId;
                conn._connectionIndex = index;
                conn._attempt = attempt;

                conn.addEventListener("open", () => {
                    console.log(
                        `[WebSocket Multiplier] Connection ${
              index + 1
                        }/${MULTIPLIER} opened for group ${groupId}`
          );
                });

                conn.addEventListener("error", (event) => {
                    console.log(
                        `[WebSocket Multiplier] Connection ${
              index + 1
                        }/${MULTIPLIER} error in group ${groupId}:`,
                        event
                    );
                });

                conn.addEventListener("close", (event) => {
                    console.log(
                        `[WebSocket Multiplier] Connection ${
              index + 1
                        }/${MULTIPLIER} closed in group ${groupId}`
          );
                });

                return conn;
            } catch (error) {
                console.error(
                    `[WebSocket Multiplier] Failed to create connection ${index + 1}:`,
                    error
                );
                return null;
            }
        };

        for (let i = 0; i < MULTIPLIER; i++) {
            const conn = createConnection(i);
            if (conn) connections.push(conn);
        }

        connectionGroups.set(groupId, connections);

        const primaryConnection = connections[0];
        if (!primaryConnection) {
            throw new Error("Failed to create any WebSocket connections");
        }

        const originalSend = OriginalWebSocket.prototype.send;
        const originalClose = OriginalWebSocket.prototype.close;

        primaryConnection.send = function (data) {
            connections.forEach((conn, index) => {
                if (conn.readyState === WebSocket.OPEN) {
                    try {
                        originalSend.call(conn, data);
                    } catch (error) {
                        console.error(
                            `[WebSocket Multiplier] Failed to send to connection ${
                index + 1
                            }:`,
                            error
                        );
                    }
                } else {
                    console.warn(
                        `[WebSocket Multiplier] Connection ${index + 1} not ready (state: ${
              conn.readyState
                      })`
          );
              }
            });
        };

        primaryConnection.close = function (code, reason) {
            connections.forEach((conn, index) => {
                if (conn._attempt < MAX_RECONNECT_ATTEMPTS) {
                    console.log(
                        `[WebSocket Multiplier] Reconnecting connection ${
              index + 1
                        } in ${RECONNECT_DELAY}ms...`
          );
                    setTimeout(() => {
                        const newConn = createConnection(index, conn._attempt + 1);
                        connections[index] = newConn;
                    }, RECONNECT_DELAY);
                } else {
                    console.log(
                        `[WebSocket Multiplier] Closing all ${connections.length} connections in group ${conn._groupId}`
          );
                  if (
                      conn.readyState === WebSocket.OPEN ||
                      conn.readyState === WebSocket.CONNECTING
                  ) {
                      try {
                          originalClose.call(conn, code, reason);
                      } catch (error) {
                          console.error(
                              `[WebSocket Multiplier] Failed to close connection ${
                  index + 1
                        }:`,
                        error
                    );
                }
                connectionGroups.delete(conn._groupId);
            }
              }
            });
        };

        return primaryConnection;
    }

    Object.setPrototypeOf(
        WebSocketMultiplexer.prototype,
        OriginalWebSocket.prototype
    );
    ["CONNECTING", "OPEN", "CLOSING", "CLOSED"].forEach((state) => {
        WebSocketMultiplexer[state] = OriginalWebSocket[state];
    });

    window.WebSocket = WebSocketMultiplexer;

    console.log(
        `[WebSocket Multiplier] Userscript loaded. Will create ${MULTIPLIER} connections for each WebSocket with reconnect support.`
  );
})();