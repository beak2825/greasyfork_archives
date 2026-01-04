// ==UserScript==
// @name         CreateLogger
// @version      1.0
// @description  Logs stuff
// @author       Toonidy
// @match        *://*.nitrotype.com/race
// @match        *://*.nitrotype.com/race/*
// @license      MIT
// ==/UserScript==

// Credit to Toonidy
function createLogger(namespace) {
  const logPrefix = (prefix = "") => {
    const formatMessage = `%c[${namespace}]${prefix ? `%c[${prefix}]` : ""}`;
    let args = [
      console,
      `${formatMessage}%c`,
      "background-color: #4285f4; color: #fff; font-weight: bold",
    ];
    if (prefix) {
      args = args.concat(
        "background-color: #4f505e; color: #fff; font-weight: bold"
      );
    }
    return args.concat("color: unset");
  };

  const bindLog = (logFn, prefix) =>
    Function.prototype.bind.apply(logFn, logPrefix(prefix));

  return {
    info: (prefix) => bindLog(console.info, prefix),
    warn: (prefix) => bindLog(console.warn, prefix),
    error: (prefix) => bindLog(console.error, prefix),
    log: (prefix) => bindLog(console.log, prefix),
    debug: (prefix) => bindLog(console.debug, prefix),
  };
}
