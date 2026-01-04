/*
Tampermonkey utils
*/

class TmUtils {
  static getClassName4Run() {
    const matches = GM_info.script.matches.map(s => s.replace(/\*$/, ''));
    const cfgFuncs = this.getUserScriptHeaders('classname');

    let funcName;
    const thisUrl = window.location.href;
    for (let len = matches.length, i = 0; i < len; i++) {
      if (thisUrl.includes(matches[i])) {
        funcName = cfgFuncs[i];
        break;
      }
    }
    console.log(`class name: ${funcName}`);
    return funcName;
  }

  static getUserScriptHeaders(name) {
    const reg = new RegExp(`(?<=\/\/ @${name})\\s+.*`, 'g');
    return (
      GM_info.script.header.match(reg).map(s => s.trim())
    );
  }
}
