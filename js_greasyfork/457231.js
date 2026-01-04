// ==UserScript==
// @name         Diep.io Automation Pack
// @namespace    http://tampermonkey.net/
// @version      1.0
// @description  automates important constants for diep.io
// @author       bismuth
// @match        https://diep.io/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=diep.io
// @license      MIT
// @grant        none
// ==/UserScript==
window.Automator = class Automator {
    static config = {};
    constructor() {}
    hook(before,after) {
        WebAssembly.instantiateStreaming = (r, i) => r.arrayBuffer().then(b => WebAssembly.instantiate(b, i));
        const _instantiate = WebAssembly.instantiate;
        WebAssembly.instantiate = async(bin, imports) => {
            await this.getConfig(bin);
            before();
            return _instantiate(bin, imports).then(wasm => {
                for (const exp of Object.values(wasm.instance.exports)) {
                    if (exp.buffer) {
                        after(exp.buffer, Automator.config);
                    }
                }
                return wasm;
            });
        }
    }
    async getConfig(bin) {
        const buildFetch = async () => {
            const res = await fetch("https://diep.io/", { cache: "no-cache" });
            const text = await res.text();
            const JS_PATH = text.slice(text.indexOf("src=\"/index.") + "src=\"/".length, text.indexOf("\">", text.indexOf("src=\"/index.")));
            const wasm2js = await fetch("https://diep.io/" + JS_PATH).then(res => res.text());
            return wasm2js.slice(wasm2js.lastIndexOf("\"", wasm2js.indexOf(".wasm\"")) + 1, wasm2js.indexOf(".wasm\""));
        }
        const build = await buildFetch();
        try { Automator.config = JSON.parse(window.localStorage.config) }
        catch { Automator.config = {}; }
        if (Automator.config.build !== build) {
            const wasmRegex = (regex, repeat = false, start = 0) => {
                let ret = [], rets = [];
                jump: for (let n = start; n < this.packet.length - regex.length; n++) {
                    this.index = n;
                    ret = [];
                    for (let p = 0; p < regex.length; p++) {
                        if (regex[p] === '*') this.vu();
                        else if (regex[p] === '+') ret.push(this.vu());
                        else if (this.u8() !== regex[p]) continue jump;
                    }
                    if (repeat) rets.push(ret);
                    else return ret;
                }
                return rets.length? rets: false;
            }
            const unreachable = 0x00, nop = 0x01, block = 0x02, loop = 0x03, if_ = 0x04, else_ = 0x05, end = 0x0b, br = 0x0c, br_if = 0x0d,
                  call = 0x10, drop = 0x1a,
                  local_get = 0x20, local_set = 0x21, local_tee = 0x22, global_get = 0x23, global_set = 0x24, i32_load = 0x28, f32_load = 0x2a, f64_load = 0x2b, i32_load8_s = 0x2c, i32_load8_u = 0x2d, i32_load16_u = 0x2f,
                  i32_store = 0x36, i64_store = 0x37, f32_store = 0x38, i32_store8 = 0x3a, i32_store16 = 0x3b,
                  memory_grow = 0x40, i32_const = 0x41, i64_const = 0x42, i32_eqz = 0x45, i32_eq = 0x46, i32_lt_s = 0x48, i32_lt_u = 0x49,
                  f32_eq = 0x5b, f32_lt = 0x5d, f32_gt = 0x5e,
                  i32_add = 0x6a, i32_sub = 0x6b,
                  i32_and = 0x71, i32_or = 0x72, i32_xor = 0x73,
                  f32_sub = 0x93, f32_mul = 0x94,
                  f32_demote_f64 = 0xb6;
            const i32 = 0x7f, i64 = 0x7e, f32 = 0x7d, f64 = 0x4c;
            const param = 0x01, local = 0x02;
            const fieldMap = JSON.parse(atob('W1t7Im5hbWUiOiJwYXJlbnQiLCJ0eXBlIjoiZW50aXR5SUQiLCJncm91cCI6MCwibWVtVHlwZSI6ImVudGlkIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJlbnRpdHlJRCJ9LHsibmFtZSI6Im93bmVyIiwidHlwZSI6ImVudGl0eUlEIiwiZ3JvdXAiOjAsIm1lbVR5cGUiOiJlbnRpZCIsInJlcGVhdCI6MSwidXBkYXRlIjoiZW50aXR5SUQifSx7Im5hbWUiOiJ0ZWFtIiwidHlwZSI6ImVudGl0eUlEIiwiZ3JvdXAiOjAsIm1lbVR5cGUiOiJlbnRpZCIsInJlcGVhdCI6MSwidXBkYXRlIjoiZW50aXR5SUQifV0sW10sW3sibmFtZSI6InNob290aW5nIiwidHlwZSI6InZ1IiwiZ3JvdXAiOjIsIm1lbVR5cGUiOiJpMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6InZ1In0seyJuYW1lIjoicmVsb2FkVGltZSIsInR5cGUiOiJmMzIiLCJncm91cCI6MiwibWVtVHlwZSI6ImYzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoiZjMyIn0seyJuYW1lIjoic2hvb3RpbmdBbmdsZSIsInR5cGUiOiJmMzIiLCJncm91cCI6MiwibWVtVHlwZSI6ImYzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoiZjMyIn1dLFt7Im5hbWUiOiJvYmplY3RGbGFncyIsInR5cGUiOiJ2dSIsImdyb3VwIjozLCJtZW1UeXBlIjoiaTMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJ2dSJ9LHsibmFtZSI6InNpZGVzIiwidHlwZSI6InZ1IiwiZ3JvdXAiOjMsIm1lbVR5cGUiOiJpMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6InZ1In0seyJuYW1lIjoic2l6ZSIsInR5cGUiOiJmMzIiLCJncm91cCI6MywibWVtVHlwZSI6Il9mMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6ImYzMiJ9LHsibmFtZSI6IndpZHRoIiwidHlwZSI6ImYzMiIsImdyb3VwIjozLCJtZW1UeXBlIjoiX2YzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoiZjMyIn0seyJuYW1lIjoia25vY2tiYWNrRmFjdG9yIiwidHlwZSI6ImYzMiIsImdyb3VwIjozLCJtZW1UeXBlIjoiZjMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJmMzIifSx7Im5hbWUiOiJwdXNoRmFjdG9yIiwidHlwZSI6ImYzMiIsImdyb3VwIjozLCJtZW1UeXBlIjoiZjMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJmMzIifV0sW3sibmFtZSI6ImhlYWx0aGJhciIsInR5cGUiOiJ2dSIsImdyb3VwIjo0LCJtZW1UeXBlIjoiaTMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJ2dSJ9LHsibmFtZSI6ImhlYWx0aCIsInR5cGUiOiJmMzIiLCJncm91cCI6NCwibWVtVHlwZSI6Il9mMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6ImYzMiJ9LHsibmFtZSI6Im1heEhlYWx0aCIsInR5cGUiOiJmMzIiLCJncm91cCI6NCwibWVtVHlwZSI6Il9mMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6ImYzMiJ9XSxbXSxbeyJuYW1lIjoiZXhhbXBsZSIsInR5cGUiOiJ2dSIsImdyb3VwIjo2LCJtZW1UeXBlIjoiaTMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJ2dSJ9XSxbeyJuYW1lIjoic2VydmVyUGxheWVyQ291bnQiLCJ0eXBlIjoidnUiLCJncm91cCI6NywibWVtVHlwZSI6ImkzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoidnUifSx7Im5hbWUiOiJzZXJ2ZXJQbGF5ZXJJRHMiLCJ0eXBlIjoic3RyaW5nTlQiLCJncm91cCI6NywibWVtVHlwZSI6InN0ciIsInJlcGVhdCI6ODAsInVwZGF0ZSI6Imp1bXBfc3RyaW5nTlQifSx7Im5hbWUiOiJzZXJ2ZXJQbGF5ZXJOYW1lcyIsInR5cGUiOiJzdHJpbmdOVCIsImdyb3VwIjo3LCJtZW1UeXBlIjoic3RyIiwicmVwZWF0Ijo4MCwidXBkYXRlIjoianVtcF9zdHJpbmdOVCJ9XSxbeyJuYW1lIjoiR1VJIiwidHlwZSI6InZ1IiwiZ3JvdXAiOjgsIm1lbVR5cGUiOiJpMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6InZ1In0seyJuYW1lIjoiYXJlbmFMZWZ0WCIsInR5cGUiOiJmMzIiLCJncm91cCI6OCwibWVtVHlwZSI6ImYzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoiZjMyIn0seyJuYW1lIjoiYXJlbmFUb3BZIiwidHlwZSI6ImYzMiIsImdyb3VwIjo4LCJtZW1UeXBlIjoiZjMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJmMzIifSx7Im5hbWUiOiJhcmVuYVJpZ2h0WCIsInR5cGUiOiJmMzIiLCJncm91cCI6OCwibWVtVHlwZSI6ImYzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoiZjMyIn0seyJuYW1lIjoiYXJlbmFCb3R0b21ZIiwidHlwZSI6ImYzMiIsImdyb3VwIjo4LCJtZW1UeXBlIjoiZjMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJmMzIifSx7Im5hbWUiOiJzY29yZWJvYXJkQW1vdW50IiwidHlwZSI6InZ1IiwiZ3JvdXAiOjgsIm1lbVR5cGUiOiJpMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6InZ1In0seyJuYW1lIjoic2NvcmVib2FyZE5hbWVzIiwidHlwZSI6InN0cmluZ05UIiwidXBkYXRlIjoianVtcF9zdHJpbmdOVCIsImdyb3VwIjo4LCJyZXBlYXQiOjEwLCJtZW1UeXBlIjoic3RyIn0seyJuYW1lIjoic2NvcmVib2FyZFNjb3JlcyIsInR5cGUiOiJmMzIiLCJ1cGRhdGUiOiJqdW1wX3ZpIiwiZ3JvdXAiOjgsInJlcGVhdCI6MTAsIm1lbVR5cGUiOiJmMzIifSx7Im5hbWUiOiJzY29yZWJvYXJkQ29sb3JzIiwidHlwZSI6InZ1IiwidXBkYXRlIjoianVtcF92dSIsImdyb3VwIjo4LCJyZXBlYXQiOjEwLCJtZW1UeXBlIjoiaTMyIn0seyJuYW1lIjoic2NvcmVib2FyZFN1ZmZpeGVzIiwidHlwZSI6InN0cmluZ05UIiwidXBkYXRlIjoianVtcF9zdHJpbmdOVCIsImdyb3VwIjo4LCJyZXBlYXQiOjEwLCJtZW1UeXBlIjoic3RyIn0seyJuYW1lIjoic2NvcmVib2FyZFRhbmtzIiwidHlwZSI6InZpIiwidXBkYXRlIjoianVtcF92aSIsImdyb3VwIjo4LCJyZXBlYXQiOjEwLCJtZW1UeXBlIjoiaTMyIn0seyJuYW1lIjoibGVhZGVyWCIsInR5cGUiOiJmMzIiLCJncm91cCI6OCwibWVtVHlwZSI6ImYzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoiZjMyIn0seyJuYW1lIjoibGVhZGVyWSIsInR5cGUiOiJmMzIiLCJncm91cCI6OCwibWVtVHlwZSI6ImYzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoiZjMyIn0seyJuYW1lIjoicGxheWVyc05lZWRlZCIsInR5cGUiOiJ2aSIsImdyb3VwIjo4LCJtZW1UeXBlIjoiaTMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJ2aSJ9LHsibmFtZSI6InRpY2tzVW50aWxTdGFydCIsInR5cGUiOiJmMzIiLCJncm91cCI6OCwibWVtVHlwZSI6Il9mMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6ImYzMiJ9XSxbeyJuYW1lIjoibmFtZXRhZyIsInR5cGUiOiJ2dSIsImdyb3VwIjo5LCJtZW1UeXBlIjoiaTMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJ2dSJ9LHsibmFtZSI6Im5hbWUiLCJ0eXBlIjoic3RyaW5nTlQiLCJncm91cCI6OSwibWVtVHlwZSI6InN0ciIsInJlcGVhdCI6MSwidXBkYXRlIjoic3RyaW5nTlQifV0sW3sibmFtZSI6IkdVSXVua25vd24iLCJ0eXBlIjoidnUiLCJncm91cCI6MTAsIm1lbVR5cGUiOiJpMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6InZ1In0seyJuYW1lIjoiY2FtZXJhIiwidHlwZSI6InZ1IiwiZ3JvdXAiOjEwLCJtZW1UeXBlIjoiaTMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJ2dSJ9LHsibmFtZSI6InBsYXllciIsInR5cGUiOiJlbnRpdHlJRCIsImdyb3VwIjoxMCwibWVtVHlwZSI6ImVudGlkIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJlbnRpdHlJRCJ9LHsibmFtZSI6IkZPViIsInR5cGUiOiJmMzIiLCJncm91cCI6MTAsIm1lbVR5cGUiOiJmMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6ImYzMiJ9LHsibmFtZSI6ImxldmVsIiwidHlwZSI6InZpIiwiZ3JvdXAiOjEwLCJtZW1UeXBlIjoiaTMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJ2aSJ9LHsibmFtZSI6InRhbmsiLCJ0eXBlIjoidnUiLCJncm91cCI6MTAsIm1lbVR5cGUiOiJpMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6InZ1In0seyJuYW1lIjoibGV2ZWxiYXJQcm9ncmVzcyIsInR5cGUiOiJmMzIiLCJncm91cCI6MTAsIm1lbVR5cGUiOiJmMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6ImYzMiJ9LHsibmFtZSI6ImxldmVsYmFyTWF4IiwidHlwZSI6ImYzMiIsImdyb3VwIjoxMCwibWVtVHlwZSI6ImYzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoiZjMyIn0seyJuYW1lIjoic3RhdHNBdmFpbGFibGUiLCJ0eXBlIjoidmkiLCJncm91cCI6MTAsIm1lbVR5cGUiOiJpMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6InZpIn0seyJuYW1lIjoic3RhdHNOYW1lcyIsInR5cGUiOiJzdHJpbmdOVCIsInVwZGF0ZSI6Imp1bXBfc3RyaW5nTlQiLCJncm91cCI6MTAsInJlcGVhdCI6OCwibWVtVHlwZSI6InN0ciJ9LHsibmFtZSI6InN0YXRzQWxsb2NhdGVkIiwidHlwZSI6InZ1IiwidXBkYXRlIjoianVtcF92dSIsImdyb3VwIjoxMCwicmVwZWF0Ijo4LCJtZW1UeXBlIjoiaTMyIn0seyJuYW1lIjoic3RhdHNNYXgiLCJ0eXBlIjoidmkiLCJ1cGRhdGUiOiJqdW1wX3ZpIiwiZ3JvdXAiOjEwLCJyZXBlYXQiOjgsIm1lbVR5cGUiOiJpMzIifSx7Im5hbWUiOiJjYW1lcmFYIiwidHlwZSI6ImYzMiIsImdyb3VwIjoxMCwibWVtVHlwZSI6ImYzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoiZjMyIn0seyJuYW1lIjoiY2FtZXJhWSIsInR5cGUiOiJmMzIiLCJncm91cCI6MTAsIm1lbVR5cGUiOiJmMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6ImYzMiJ9LHsibmFtZSI6InNjb3JlYmFyIiwidHlwZSI6ImYzMiIsImdyb3VwIjoxMCwibWVtVHlwZSI6Il9mMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6ImYzMiJ9LHsibmFtZSI6InJlc3Bhd25MZXZlbCIsInR5cGUiOiJ2aSIsImdyb3VwIjoxMCwibWVtVHlwZSI6ImkzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoidmkifSx7Im5hbWUiOiJraWxsZWRCeSIsInR5cGUiOiJzdHJpbmdOVCIsImdyb3VwIjoxMCwibWVtVHlwZSI6InN0ciIsInJlcGVhdCI6MSwidXBkYXRlIjoic3RyaW5nTlQifSx7Im5hbWUiOiJzcGVjdGF0b3JJRCIsInR5cGUiOiJzdHJpbmdOVCIsImdyb3VwIjoxMCwibWVtVHlwZSI6InN0ciIsInJlcGVhdCI6MX0seyJuYW1lIjoic3Bhd25UaWNrIiwidHlwZSI6InZ1IiwiZ3JvdXAiOjEwLCJtZW1UeXBlIjoiaTMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJ2dSJ9LHsibmFtZSI6ImRlYXRoVGljayIsInR5cGUiOiJ2dSIsImdyb3VwIjoxMCwibWVtVHlwZSI6ImkzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoidnUifSx7Im5hbWUiOiJ0YW5rT3ZlcnJpZGUiLCJ0eXBlIjoidnUiLCJncm91cCI6MTAsIm1lbVR5cGUiOiJzdHIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6InZ1In0seyJuYW1lIjoibW92ZW1lbnRTcGVlZCIsInR5cGUiOiJmMzIiLCJncm91cCI6MTAsIm1lbVR5cGUiOiJmMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6ImYzMiJ9XSxbeyJuYW1lIjoieSIsInR5cGUiOiJ2aSIsImdyb3VwIjoxMSwibWVtVHlwZSI6Il9mMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6InZpIn0seyJuYW1lIjoiYW5nbGUiLCJ0eXBlIjoidmkiLCJncm91cCI6MTEsIm1lbVR5cGUiOiJfZjMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJ2aSJ9LHsibmFtZSI6IngiLCJ0eXBlIjoidmkiLCJncm91cCI6MTEsIm1lbVR5cGUiOiJfZjMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJ2aSJ9LHsibmFtZSI6InRyYXBlem9pZEFuZ2xlIiwidHlwZSI6InZpIiwiZ3JvdXAiOjExLCJtZW1UeXBlIjoiaTMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJ2aSJ9XSxbeyJuYW1lIjoic3R5bGUiLCJ0eXBlIjoidnUiLCJncm91cCI6MTIsIm1lbVR5cGUiOiJpMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6InZ1In0seyJuYW1lIjoiY29sb3IiLCJ0eXBlIjoidnUiLCJncm91cCI6MTIsIm1lbVR5cGUiOiJpMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6InZ1In0seyJuYW1lIjoiYm9yZGVyVGhpY2tuZXNzIiwidHlwZSI6InZpIiwiZ3JvdXAiOjEyLCJtZW1UeXBlIjoiX2YzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoidmkifSx7Im5hbWUiOiJvcGFjaXR5IiwidHlwZSI6ImYzMiIsImdyb3VwIjoxMiwibWVtVHlwZSI6Il9mMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6ImYzMiJ9LHsibmFtZSI6InNlcnZlckVudGl0eUNvdW50IiwidHlwZSI6InZ1IiwiZ3JvdXAiOjEyLCJtZW1UeXBlIjoiaTMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJ2dSJ9XSxbXSxbeyJuYW1lIjoic2NvcmUiLCJ0eXBlIjoiZjMyIiwiZ3JvdXAiOjE0LCJtZW1UeXBlIjoiX2YzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoiZjMyIn1dLFt7Im5hbWUiOiJ0ZWFtQ29sb3IiLCJ0eXBlIjoidnUiLCJncm91cCI6MTUsIm1lbVR5cGUiOiJpMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6InZ1In0seyJuYW1lIjoibW90aGVyc2hpcFgiLCJ0eXBlIjoiZjMyIiwiZ3JvdXAiOjE1LCJtZW1UeXBlIjoiZjMyIiwicmVwZWF0IjoxLCJ1cGRhdGUiOiJmMzIifSx7Im5hbWUiOiJtb3RoZXJzaGlwWSIsInR5cGUiOiJmMzIiLCJncm91cCI6MTUsIm1lbVR5cGUiOiJmMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6ImYzMiJ9LHsibmFtZSI6Im1vdGhlcnNoaXAiLCJ0eXBlIjoidnUiLCJncm91cCI6MTUsIm1lbVR5cGUiOiJpMzIiLCJyZXBlYXQiOjEsInVwZGF0ZSI6InZ1In0seyJuYW1lIjoidW5rMSIsInR5cGUiOiJ2dSIsImdyb3VwIjoxNSwibWVtVHlwZSI6ImkzMiIsInJlcGVhdCI6MSwidXBkYXRlIjoidnUifV1d'));
            const field_func = new Array(136).fill().map((_,ind) => ind & 1? '*': block);
            const fieldGroupMap = {};
            const fields = []; //key = index
            const _fields = {}; //key = name
            const funcs = [];
            let uptime, deletion, upcreate, rootVec, entPtr, animated, tankRootVec, recvPacketIndex;
            this.packet = new Uint8Array(bin);
            this.index = 8;
            while (this.index < this.packet.length) {
                const id = this.u8();
                const sectionLen = this.vu();
                if (id !== 10) {
                    this.index += sectionLen;
                    continue;
                }
                const bodyCount = this.vu();
                for (let i = 0; i < bodyCount; i++) {
                    const len = this.vu();
                    funcs.push(this.packet.slice(this.index, this.index += len));
                }
                break;
            }
            for (let n = 0; n < funcs.length; n++) {
                const funcBody = funcs[n];
                let regex;
                this.packet = funcBody;
                if (!uptime && (regex = wasmRegex([i32_const, '+',
                                                   i32_xor,
                                                   local_tee, '*',
                                                   i32_store]))) uptime = regex[0];
                if (!upcreate && (regex = wasmRegex([local_get, '*',
                                                     i32_const, '+',
                                                     i32_add,
                                                     i32_const, '*',
                                                     i32_and,
                                                     i32_xor]))) upcreate = regex[0];
                if (!deletion && (regex = wasmRegex([local_get, '*',
                                                     i32_const, '+',
                                                     i32_add,
                                                     i32_const, '*',
                                                     i32_and,
                                                     local_tee, '*',
                                                     local_get, '*',
                                                     i32_xor]))) deletion = regex[0];
                if (!rootVec && (regex = wasmRegex([i32_const, '+',
                                                    local_get, '*',
                                                    call, '*',
                                                    local_tee, '*',
                                                    local_get, '*',
                                                    i32_store16]))) { rootVec = regex[0] + 512; entPtr = rootVec + 208 }
                if (!animated && (regex = wasmRegex(new Array(4).fill().map(_ => [i32_const, '+',
                                                                                  i32_load, '*', '*',
                                                                                  local_set, '*',
                                                                                  i32_const, '*',
                                                                                  i32_const, '*',
                                                                                  i32_store, '*', '*',
                                                                                  '*', '*', '*', '*', '*', '*', '*', '*', '*']).flat()))) animated = {x: regex[3], y: regex[2], fov: regex[0] }
                /*
                if ((regex = wasmRegex(field_func, false))) {
                    const groupDeclare = [...wasmRegex([local_get, '*',
                                                        i32_load, '*', '+',
                                                        local_set, '+'], true),
                                          ...wasmRegex([local_get, '*',
                                                        i32_load, '*', '+',
                                                        local_tee, '+'], true)];
                    for (const [offset,varName] of groupDeclare) if (offset >= 72) fieldGroupMap[varName] = (offset - 72) >> 2;
                    const fieldDeclare = wasmRegex([local_get, '+',
                                                    i32_const, 0,
                                                    i32_store8, '*', '+'], true);
                    for (const [varName,offset] of fieldDeclare) {
                        const group = fieldGroupMap[varName];
                        const pos = offset-4;
                        const field = fieldMap[group][pos];
                        if (_fields[field.name]) continue;
                        fields.push(field);
                        _fields[field.name] = field;
                    }
                }
                */
            }
            /*
            const fieldGroupOffsets = [8, 0, 8, 12, 8, 0, 8, 8, 20, 8, 28, 8, 12, 0, 8, 8];
            const fieldGroupOrder = [[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]];
            const typeLengths = {"f32": 8,"_f32":32,"i32":8,"entid":12,"str":16};
            for (let n = 0; n < fields.length; n++) {
                const val = fields[n];
                if (!val.name) continue;
                if (val.memType === '_f32') fieldGroupOffsets[val.group] += fieldGroupOffsets[val.group] & 4;
                _fields[val.name].offset = val.offset = fieldGroupOffsets[val.group];
                val.groupOffset = 72 + (val.group << 2);
                fieldGroupOffsets[val.group] += typeLengths[val.memType] * val.repeat;
                fieldGroupOrder[val.group].push(n);
            }
            */
            const lastUpdatedAt = new Date().toString();
            Automator.config = {
                build,
                fieldMap,
                fields,
                _fields,
                uptime,
                deletion,
                upcreate,
                rootVec,
                entPtr,
                //fieldGroupOrder,
                animated,
                lastUpdatedAt
            };
            window.localStorage.config = JSON.stringify(Automator.config);
            console.log(`%cfinished automation for build ${build}`, 'color: red; font-weight: bold');
            return Automator.config;
        }
    }
    u8() { return this.packet[this.index++] }
    vu() {
        let out = 0, at = 0;
        while (this.packet[this.index] & 0x80) {
            out |= (this.u8() & 0x7f) << at;
            at += 7;
        }
        out |= this.u8() << at;
        return out;
    }
}
