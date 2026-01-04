// ==UserScript==
// @name         晋江文学城极简阅读器
// @namespace    https://github.com/cresstoo/jjwx-reader
// @version      1.0.3
// @description  去广告，统一布局与样式，支持多主题配色和字体调整
// @author       cress
// @match        https://www.jjwxc.net/onebook.php?novelid=*&chapterid=*
// @icon         data:image/vnd.microsoft.icon;base64,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AP8AqgD/AKoA/wCqAP8AqgD/AKoA/ye3J//9/v3//f79/wWsBf8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/r+Sv///////R79H/s+Wz/7Pls/+z5bP/s+Wz/7Pls/+z5bP/s+Wz/7Pls/+z5bP/s+Wz/7Pls/+z5bP/v+m/////////////BawF/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP+v5K////////////////////////////////////////////////////////////////////////////////////////////8FrAX/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/6/kr///////ctBy/xWxFf8VsRX/FbEV/xWxFf8VsRX/FbEV/xWxFf8VsRX/FbEV/xWxFf8VsRX/FbEV/zq9Ov///////////wWsBf8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/r+Sv//////9ly2X/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/J7cn////////////BawF/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP+v5K///////3HPcf8TsBP/E7AT/xOwE/8TsBP/E7AT/xOwE/8TsBP/E7AT/xOwE/8TsBP/E7AT/xOwE/84vDj///////////8FrAX/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/6/kr////////////////////////////////////////////////////////////////////////////////////////////wWsBf8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/r+Sv//////+457j/ideJ/4nXif+J14n/ideJ/4nXif+J14n/ideJ/4nXif+J14n/ideJ/4nXif+J14n/m96b////////////BawF/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP+v5K///////2XLZf8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8ntyf///////////8FrAX/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/6/kr///////Zctl/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/ye3J////////////wWsBf8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/r+Sv///////e9N7/ye3J/8ntyf/J7cn/ye3J/8ntyf/J7cn/ye3J/8ntyf/J7cn/ye3J/8ntyf/J7cn/0fDR////////////BawF/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP+v5K////////////////////////////////////////////////////////////////////////////////////////////8FrAX/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8DqwP/GbIZ/xmyGf8Zshn/GbIZ/xmyGf8Zshn/GbIZ/xmyGf8Zshn/GbIZ/xmyGf8Zshn/GbIZ/xmyGf8Zshn/GbIZ/xmyGf8Zshn/GbIZ/xmyGf8Zshn/GbIZ/xmyGf8Zshn/BKsE/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/yC0IP////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////8ntyf/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/GbIZ/8ntyf/J7cn/ye3J/8ntyf/J7cn/ye3J/8ntyf/J7cn/+v36///////Q79D/ye3J/8ntyf/W8db///////T79P/J7cn/ye3J/8ntyf/J7cn/ye3J/8ntyf/J7cn/ye3J/x+0H/8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/2XLZf9ayFr/C64L/wCqAP/n9+f//////yG1If8AqgD/AKoA/z2+Pf//////y+3L/wCqAP8uuS7/l9yX/zW7Nf8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8GrAb/6vjq//7//v8ktiT/AKoA/+f35///////IbUh/wCqAP8AqgD/Pb49///////L7cv/AKoA/y65Lv/8/vz/0e/R/wSrBP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/1nIWf//////vOm8/wCqAP8AqgD/5/fn//////8htSH/AKoA/wCqAP89vj3//////8vty/8AqgD/AKoA/5zenP//////bM5s/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8BqgH/zu7O//////9FwUX/AKoA/wCqAP/n9+f//////yG1If8AqgD/AKoA/z2+Pf//////y+3L/wCqAP8AqgD/H7Qf//n9+f/r+Ov/EK8Q/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/1bHVv//////vum+/wCqAP8AqgD/AKoA/+f35///////IbUh/wCqAP8AqgD/Pb49///////L7cv/AKoA/wCqAP8AqgD/n9+f//////+A1ID/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/GbIZ/2fMZ/8ruCv/AKoA/wCqAP8AqgD/5/fn//////8htSH/AKoA/wCqAP89vj3//////8vty/8AqgD/AKoA/wCqAP8ltiX/UcVR/witCP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/4nXif/F68X/xevF/8Xrxf/F68X/xevF/8Xrxf/5/fn//////83uzf/F68X/xevF/9Pw0///////8/vz/8Xrxf/F68X/xevF/8Xrxf/F68X/xevF/7rouv8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/seWx////////////////////////////////////////////////////////////////////////////////////////////////////////////8frx/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8QrxD/F7EX/xexF/8XsRf/F7EX/xexF/8XsRf/F7EX/xexF/8XsRf/F7EX/xexF/8XsRf/F7EX/xexF/8XsRf/F7EX/xexF/8XsRf/F7EX/xexF/8WsRb/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqwDmAKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKsA5gCpAHwAqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqQB8AIAAAgCpAHwAqwDmAKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqwDmAKkAfACAAAIAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAKAAAADAAAABgAAAAAQAgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAqgAPAKkAXACqAMYAqgD2AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD2AKoAxgCpAFwAqgAPAAAAAACqAA8AqQCVAKoA+ACqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAPgAqQCVAKoADwCpAFwAqgD4AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD4AKkAXACqAMYAqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoAxgCqAPYAqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA9gCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8IrAj/Jrcm/yq4Kv8mtib/BqwG/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk///////l9uX/IrUi/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/w2uDf+l4aX//P38//z9/P+D1oP/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk///////q+Or/T8RP/zO7M/8zuzP/M7sz/zO7M/8zuzP/M7sz/zO7M/8zuzP/M7sz/zO7M/8zuzP/M7sz/zO7M/8zuzP/M7sz/zO7M/8zuzP/M7sz/z6/Pv+557n///////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk///////8/vz/6fjp/+X25f/l9uX/5fbl/+X25f/l9uX/5fbl/+X25f/l9uX/5fbl/+X25f/l9uX/5fbl/+X25f/l9uX/5fbl/+X25f/l9uX/5fbl/+f35//2/Pb///////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk///////0+/T/o+Cj/5Xblf+V25X/lduV/5Xblf+V25X/lduV/5Xblf+V25X/lduV/5Xblf+V25X/lduV/5Xblf+V25X/lduV/5Xblf+V25X/lduV/5vdm//a89r///////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk///////m9ub/KLco/wesB/8HrAf/B6wH/wesB/8HrAf/B6wH/wesB/8HrAf/B6wH/wesB/8HrAf/B6wH/wesB/8HrAf/B6wH/wesB/8HrAf/B6wH/xSxFP+q4qr///////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk///////l9uX/IrUi/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/w2uDf+n4af///////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk///////l9uX/IrUi/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/w2uDf+n4af///////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk///////o9+j/Pr8+/yC1IP8gtSD/ILUg/yC1IP8gtSD/ILUg/yC1IP8gtSD/ILUg/yC1IP8gtSD/ILUg/yC1IP8gtSD/ILUg/yC1IP8gtSD/ILUg/yy5LP+z5bP///////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk///////r+Ov/VcZV/zu9O/87vTv/O707/zu9O/87vTv/O707/zu9O/87vTv/O707/zu9O/87vTv/O707/zu9O/87vTv/O707/zu9O/87vTv/O707/0XBRf+86bz///////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk///////l9uX/IrUi/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/w2uDf+n4af///////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk///////l9uX/IrUi/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/w2uDf+n4af///////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk///////l9uX/IrUi/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/w2uDf+n4af///////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk///////2/Pb/seWx/6Xhpf+l4aX/peGl/6Xhpf+l4aX/peGl/6Xhpf+l4aX/peGl/6Xhpf+l4aX/peGl/6Xhpf+l4aX/peGl/6Xhpf+l4aX/peGl/6rjqv/g9eD///////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8vuS//5Pbk//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////+F1oX/AqsC/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/Ca0J/yq4Kv8quCr/Krgq/yq4Kv8quCr/Krgq/yq4Kv8quCr/Krgq/yq4Kv8quCr/Krgq/yq4Kv8quCr/Krgq/yq4Kv8quCr/Krgq/yq4Kv8quCr/Krgq/yq4Kv8quCr/Krgq/yq4Kv8quCr/Krgq/yq4Kv8quCr/Krgq/yq4Kv8quCr/Krgq/yq4Kv8quCr/Krgq/wutC/8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/Nbs1/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0LAQv8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/Nbs1/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////0LAQv8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/I7Uj/6Xhpf+l4aX/peGl/6Xhpf+l4aX/peGl/6Xhpf+l4aX/peGl/6Xhpf+l4aX/peGl//H68f///////////7nnuf+l4aX/peGl/6Xhpf+l4aX/ye3J////////////4fXh/6Xhpf+l4aX/peGl/6Xhpf+l4aX/peGl/6Xhpf+l4aX/peGl/6Xhpf+l4aX/peGl/yu4K/8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/yK1Iv88vjz/GrIa/wasBv8AqgD/AKoA/9fy1////////////zi8OP8AqgD/AKoA/wCqAP8AqgD/Zsxm////////////qOKo/wCqAP8BqgH/GLIY/z+/P/9Wxlb/Ca0J/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/5ndmf/2/Pb/y+7L/0PAQ/8AqgD/AKoA/9fy1////////////zi8OP8AqgD/AKoA/wCqAP8AqgD/Zsxm////////////qOKo/wCqAP8DqwP/i9mL//v++//t+e3/S8NL/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/ELAQ//H68f///////f79/yS2JP8AqgD/AKoA/9fy1////////////zi8OP8AqgD/AKoA/wCqAP8AqgD/Zsxm////////////qOKo/wCqAP8AqgD/J7cn//b89v//////2PLY/wutC/8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8BqgH/dNF0////////////r+Sv/wCqAP8AqgD/AKoA/9fy1////////////zi8OP8AqgD/AKoA/wCqAP8AqgD/Zsxm////////////qOKo/wCqAP8AqgD/AKoA/4LVgv/9/v3//////4jXiP8DqwP/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8ashr/0fDR///////x+vH/QsBC/wCqAP8AqgD/AKoA/9fy1////////////zi8OP8AqgD/AKoA/wCqAP8AqgD/Zsxm////////////qOKo/wCqAP8AqgD/AKoA/yK1Iv/W8db//////+T25P82vDb/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP9ky2T/9fz1//////+v5a//EK8Q/wCqAP8AqgD/AKoA/9fy1////////////zi8OP8AqgD/AKoA/wCqAP8AqgD/Zsxm////////////qOKo/wCqAP8AqgD/AKoA/wWrBf+E1oT//P78//3+/f+T25P/Ca0J/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/xaxFv+86bz///////H68f9Wx1b/AKoA/wCqAP8AqgD/AKoA/9fy1////////////zi8OP8AqgD/AKoA/wCqAP8AqgD/Zsxm////////////qOKo/wCqAP8AqgD/AKoA/wCqAP80vDT/5Pbk///////n9+f/K7gr/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/yW2Jf+557n/8frx/7Hlsf8Org7/AKoA/wCqAP8AqgD/AKoA/9fy1////////////zi8OP8AqgD/AKoA/wCqAP8AqgD/Zsxm////////////qOKo/wCqAP8AqgD/AKoA/wCqAP8EqwT/pOGk/9703v+l4aX/Mroy/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wSrBP8VsRX/Krgq/x60Hv8AqgD/AKoA/wCqAP8AqgD/AKoA/9fy1////////////zi8OP8AqgD/AKoA/wCqAP8AqgD/Zsxm////////////qOKo/wCqAP8AqgD/AKoA/wCqAP8AqgD/F7IX/yC1IP8Nrg3/AaoB/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8ftB//jtmO/57fnv+e357/nt+e/57fnv+e357/nt+e/57fnv+e357/nt+e//D68P///////////7TmtP+e357/nt+e/57fnv+e357/xezF////////////3vTe/57fnv+e357/nt+e/57fnv+e357/nt+e/57fnv+e357/nt+e/5zenP9HwUf/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8xujH/5fbl//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////r9+v9xz3H/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8xujH/5fbl//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////r9+v9xz3H/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8IrAj/I7Uj/ye2J/8ntif/J7Yn/ye2J/8ntif/J7Yn/ye2J/8ntif/J7Yn/ye2J/8ntif/J7Yn/ye2J/8ntif/J7Yn/ye2J/8ntif/J7Yn/ye2J/8ntif/J7Yn/ye2J/8ntif/J7Yn/ye2J/8ntif/J7Yn/ye2J/8ntif/J7Yn/ya2Jv8RsBH/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAPYAqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA9gCqAMYAqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoAxgCpAFwAqgD4AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD4AKkAXACqAA8AqQCVAKoA+ACqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAPgAqQCVAKoADwAAAAAAqgAPAKkAXACqAMYAqgD2AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD/AKoA/wCqAP8AqgD2AKoAxgCpAFwAqgAPAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA==
// @homepage     https://greasyfork.org/scripts/530133
// @supportURL   https://github.com/cresstoo/jjwx-reader
// @grant        none
// @license      MIT
// @downloadURL https://update.greasyfork.org/scripts/530133/%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E6%9E%81%E7%AE%80%E9%98%85%E8%AF%BB%E5%99%A8.user.js
// @updateURL https://update.greasyfork.org/scripts/530133/%E6%99%8B%E6%B1%9F%E6%96%87%E5%AD%A6%E5%9F%8E%E6%9E%81%E7%AE%80%E9%98%85%E8%AF%BB%E5%99%A8.meta.js
// ==/UserScript==

(function() {
    'use strict';

    // 添加CSS样式
    const style = document.createElement('style');
    style.textContent = `
        /* ==================== 全局重置 ==================== */
        html, body {
            background-color: #f8f9fa !important;
            font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei", "Noto Sans CJK SC", "Source Han Sans SC", sans-serif !important;
            color: #333 !important;
            line-height: 1.8 !important;
            text-rendering: optimizeLegibility !important;
            -webkit-font-smoothing: antialiased !important;
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            overflow-x: hidden !important;
        }
        * { box-shadow: none !important; text-shadow: none !important; border-radius: 0 !important; font-family: inherit !important; }
        div, p, h1, h2, h3, h4, h5, span, table, tr, td, a, font { margin: 0 !important; padding: 0 !important; border: none !important; line-height: inherit !important; color: inherit !important; text-decoration: none !important; }
        a:hover { color: #1e88e5 !important; }

        /* ==================== 隐藏原始元素 ==================== */
        #oneboolt, .noveltitle:not(.jj-novel-header), .novelbody:not(.jj-novel-content), .noveltext:not(.jj-novel-content), .readtitle:not(.jj-novel-header), .readtd:not(.jj-novel-content), table[width="984"], table[width="100%"], #comment_list, #publishcomment, td:has(> #comment_list), .readcontrolbar, .uninterested-hide, .danmu, .danmu_row, #danmu_main, .danmu_total_str, marquee, iframe, #qrCodeDiv, #footer, div#footer, body > div#footer, [style*="z-index:333333"], div.footer, .copyright, #copyright, .bottomlinks, #sitebottom, div[class*="footer"], div[align="center"]:has(> table):nth-last-of-type(-n+2), div[align="right"]:has(> div[style*="float:right"]), div[style*="float:right"][style*="height: 25px"], div:has(> img[src*="bookmark.gif"]), img[src*="bookmark.gif"], span.favorite_novel, span[id*="favorite_"], span[id="report_action"], span[id="yrt3"], div[style*="width: 100%; text-align: center"], div[id="float_favorite"], div[id="mongolia_layer"], div[id="report_box"], div[id*="favoriteshow_"], span[id="chapterJurisdiction"], font[color="#009900"]:has(> span.favorite_novel), div.float_favorite, a[href*="freegold"], button[onclick*="FavoriteClass"], div[class*="addFavoritClass"], a[href="#top"], a[href="javascript:scroll(0,0)"], a[onclick*="scroll(0,0)"], #jj-top-link, a[id="booktext_top"], [onclick*="window.scrollTo"], a[href^="javascript"][onclick*="window.scroll"], div[style*="position: fixed"][style*="right:"][style*="bottom:"][style*="cursor: pointer"]:not(.back-to-top), div[style*="width: 18px"][style*="line-height: 1.2"], div[style*="background-color: rgb(0, 0, 0)"][style*="position: fixed"][title="返回顶部"] { display: none !important; pointer-events: none !important; position: absolute !important; top: -9999px !important; left: -9999px !important; }

        /* ==================== 页面布局 ==================== */
        .jj-container { max-width: 800px !important; margin: 20px auto !important; padding: 0 !important; background-color: #fff !important; box-shadow: 0 2px 12px rgba(0,0,0,0.05) !important; border-radius: 8px !important; overflow: hidden !important; }
        .jj-novel-header { padding: 20px 40px !important; text-align: left !important; border-bottom: 1px solid #E0E0E0 !important; display: flex !important; align-items: center !important; gap: 15px !important; min-width: 0 !important; }
        .jj-novel-title { font-size: 22px !important; font-weight: 500 !important; }
        .jj-novel-title, .jj-novel-author { min-width: 0 !important; overflow: hidden !important; text-overflow: ellipsis !important; white-space: nowrap !important; flex-shrink: 1 !important; max-width: 60vw !important; }
        .jj-novel-author { font-size: 16px !important; color: #666 !important; margin: 0 !important; flex-shrink: 0 !important; }
        .jj-novel-content { padding: 35px 40px !important; text-align: left !important; }
        .jj-chapter-nav { padding: 25px 0 !important; text-align: center !important; border-top: 1px solid #E0E0E0 !important; }
        .jj-novel-content p { margin: 1em 0 !important; text-indent: 2em !important; font-size: 18px !important; line-height: 2 !important; color: #2c3e50 !important; letter-spacing: 0.02em !important; }
        .jj-nav-link { display: inline-block !important; margin: 0 15px !important; padding: 10px 20px !important; background-color: #f8f9fa !important; border: 1px solid #e0e0e0 !important; border-radius: 4px !important; color: #444 !important; font-size: 15px !important; transition: all 0.3s ease !important; }
        .jj-nav-link:hover { background-color: #e8f0fe !important; color: #0d66d0 !important; border-color: #c0d7fe !important; }
        .jj-chapter-select { display: inline-block !important; margin: 0 15px !important; padding: 10px 15px !important; background-color: #f8f9fa !important; border: 1px solid #e0e0e0 !important; border-radius: 4px !important; color: #444 !important; font-size: 15px !important; transition: all 0.3s ease !important; cursor: pointer !important; min-width: 150px !important; text-align: center !important; outline: none !important; appearance: auto !important; -webkit-appearance: auto !important; }
        .jj-chapter-select:hover, .jj-chapter-select:focus { background-color: #e8f0fe !important; color: #0d66d0 !important; border-color: #c0d7fe !important; }

        /* ==================== 作者有话说 ==================== */
        .jj-author-note, #note_danmu_wrapper, .note_main, .note_content { margin: 20px 0 !important; padding: 20px 25px !important; border-radius: 8px !important; font-size: 16px !important; line-height: 1.7 !important; transition: all 0.3s ease !important; }

        /* ==================== 顶部导航栏 (Sitetop) ==================== */
        #sitetop { position: relative !important; background-color: #fff !important; border-bottom: 1px solid #eee !important; padding: 8px 20px !important; font-size: 14px !important; box-shadow: 0 1px 4px rgba(0,0,0,0.03) !important; z-index: 1001 !important; width: 100% !important; box-sizing: border-box !important; }
        #sitetop a { text-decoration: none !important; }

        /* ==================== 浮动按钮与设置菜单  ==================== */
        .back-to-top { display:none; position: fixed !important; bottom: 30px !important; right: 30px !important; width: 40px !important; height: 40px !important; background-color: rgba(255, 255, 255, 0.98) !important; backdrop-filter: blur(20px) !important; -webkit-backdrop-filter: blur(20px) !important; color: #666 !important; text-align: center !important; border-radius: 50% !important; cursor: pointer !important; z-index: 9999 !important; font-size: 20px !important; transition: all 0.2s ease !important; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important; display: flex !important; align-items: center !important; justify-content: center !important; }
        .jj-toolbar-trigger { position: fixed !important; top: 50% !important; right: 30px !important; transform: translateY(-50%) !important; width: 40px !important; height: 40px !important; background-color: rgba(255, 255, 255, 0.98) !important; backdrop-filter: blur(20px) !important; -webkit-backdrop-filter: blur(20px) !important; border-radius: 50% !important; box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1) !important; cursor: pointer !important; z-index: 9999 !important; display: flex !important; align-items: center !important; justify-content: center !important; transition: all 0.2s ease !important; color: #666666 !important; }
        .jj-toolbar { position: fixed !important; top: 50% !important; right: 80px !important; transform: translateY(-50%) !important; width: 240px !important; display: flex !important; flex-direction: column !important; gap: 15px !important; padding: 15px !important; background-color: rgba(255, 255, 255, 0.98) !important; backdrop-filter: blur(20px) !important; -webkit-backdrop-filter: blur(20px) !important; border-radius: 12px !important; z-index: 9998 !important; box-shadow: 0 2px 20px rgba(0, 0, 0, 0.1) !important; transition: all 0.3s ease !important; opacity: 0 !important; visibility: hidden !important; transform: translate(10px, -50%) !important; }
        .jj-toolbar.expanded { opacity: 1 !important; visibility: visible !important; transform: translate(0, -50%) !important; }
        .jj-toolbar-title { font-size: 14px !important; font-weight: 500 !important; color: #333 !important; margin-bottom: 5px !important; text-align: center !important; }
        .jj-font-family-group { display: flex !important; gap: 6px !important; padding: 10px !important; background-color: rgba(0, 0, 0, 0.06) !important; border-radius: 6px !important; }
        .jj-font-family-btn { flex: 1 !important; padding: 6px 12px !important; border: none !important; background: none !important; color: #666 !important; cursor: pointer !important; font-size: 14px !important; border-radius: 4px !important; transition: all 0.2s ease !important; }
        .jj-font-family-btn[data-font*="PingFang"] { font-family: "PingFang SC", "Hiragino Sans GB", "Microsoft YaHei" !important; }
        .jj-font-family-btn[data-font*="Songti"] { font-family: "Songti SC", SimSun, "宋体" !important; }
        .jj-font-family-btn:hover { color: #333 !important; background: rgba(0, 0, 0, 0.05) !important; }
        .jj-font-family-btn.active { background: #fff !important; color: #333 !important; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1) !important; }
        .jj-font-size-group { display: flex !important; flex-direction: column !important; gap: 8px !important; padding: 10px !important; background-color: rgba(0, 0, 0, 0.03) !important; border-radius: 8px !important; }
        .jj-font-size-buttons { display: flex !important; align-items: center !important; background: rgba(0, 0, 0, 0.06) !important; border-radius: 6px !important; padding: 2px !important; }
        .jj-font-size-btn { flex: 1 !important; padding: 6px 12px !important; border: none !important; background: none !important; color: #666 !important; cursor: pointer !important; font-size: 14px !important; border-radius: 4px !important; transition: all 0.2s ease !important; }
        .jj-font-size-btn:hover { color: #333 !important; background: rgba(0, 0, 0, 0.05) !important; }
        .jj-font-size-dots { display: flex !important; justify-content: center !important; gap: 4px !important; padding: 4px 0 !important; }
        .jj-font-size-dot { width: 6px !important; height: 6px !important; border-radius: 50% !important; background-color: rgba(0, 0, 0, 0.1) !important; transition: all 0.2s ease !important; }
        .jj-font-size-dot.active { background-color: #1e88e5 !important; }
        .jj-theme-group { display: grid !important; grid-template-columns: repeat(2, 1fr) !important; gap: 6px !important; padding: 8px !important; background-color: rgba(0, 0, 0, 0.03) !important; border-radius: 8px !important; }
        .jj-theme-card { position: relative !important; aspect-ratio: 16/9 !important; border-radius: 6px !important; cursor: pointer !important; transition: all 0.2s ease !important; overflow: hidden !important; display: flex !important; align-items: center !important; justify-content: center !important; font-size: 14px !important; font-weight: 500 !important; border: 1px solid rgba(0, 0, 0, 0.1) !important; }
        .jj-theme-card.active { border: 2px solid #1e88e5 !important; }
        .jj-theme-card:hover { border-color: #1e88e5 !important; }
        .jj-theme-preview { width: 100% !important; height: 100% !important; display: flex !important; align-items: center !important; justify-content: center !important; flex-direction: column !important; gap: 2px !important; padding: 6px !important; box-sizing: border-box !important; }
        .jj-theme-preview.default { background-color: #EEEDED !important; color: #333333 !important; }
        .jj-theme-preview.eye-care { background-color: #E6EFD5 !important; color: #2C3E50 !important; }
        .jj-theme-preview.focus { background-color: #FFFCF4 !important; color: #3C3C3C !important; }
        .jj-theme-preview.dark { background-color: #4A4A4D !important; color: #FFFFFF !important; }

        /* ==================== 评论区样式  ==================== */
        .jj-comment-card { padding: 25px 40px !important; border-top: 1px solid #E0E0E0 !important; background-color: transparent !important; }
        .jj-comment-header { display: flex !important; justify-content: space-between !important; align-items: center !important; margin-bottom: 20px !important; }
        .jj-comment-title { font-size: 20px !important; font-weight: 500 !important; color: #333 !important; }
        .jj-comment-toggle-wrap { display: flex !important; align-items: center !important; }
        .jj-switch { position: relative !important; display: inline-flex !important; align-items: center !important; cursor: pointer !important; -webkit-tap-highlight-color: transparent !important; }
        .jj-switch-label { margin-left: 8px !important; font-size: 15px !important; color: #666 !important; user-select: none !important; }
        .jj-switch-input { opacity: 0 !important; width: 0 !important; height: 0 !important; }
        .jj-switch-slider { position: relative !important; display: block !important; width: 40px !important; height: 22px !important; background-color: #ccc !important; border-radius: 22px !important; transition: background-color 0.2s ease !important; }
        .jj-switch-slider::before { content: "" !important; position: absolute !important; top: 2px !important; left: 2px !important; width: 18px !important; height: 18px !important; background-color: white !important; border-radius: 50% !important; transition: transform 0.2s ease !important; }
        .jj-switch-input:checked + .jj-switch-slider { background-color: #1e88e5 !important; }
        .jj-switch-input:checked + .jj-switch-slider::before { transform: translateX(18px) !important; }
        .jj-comment-section { text-align: left !important; }
        .jj-comment { margin-bottom: 15px !important; padding-bottom: 15px !important; border-bottom: 1px solid #f0f0f0 !important; }
        .jj-comment:first-child { padding-top: 25px !important; border-top: 1px solid #f0f0f0 !important; }
        .jj-comment:last-child { border-bottom: none !important; margin-bottom: 0 !important; }
        .jj-comment-info { font-size: 13px !important; color: #888 !important; margin-bottom: 10px !important; }
        .jj-comment-content { font-size: 16px !important; line-height: 1.8 !important; color: #444 !important; word-wrap: break-word !important; white-space: pre-wrap !important; }
                /* ==================== 主题适配  ==================== */
        /* 默认主题 */
        .theme-default .jj-container { background-color: #EEEDED !important; }
        .theme-default .jj-novel-content p { color: #333333 !important; }
        .theme-default .jj-novel-header, .theme-default .jj-chapter-nav, .theme-default .jj-comment-card { border-color: #D0D0D0 !important; }
        .theme-default .jj-comment, .theme-default .jj-comment:first-child { border-color: #D8D8D8 !important; }

        /* 护眼主题 */
        .theme-eye-care .jj-container { background-color: #E6EFD5 !important; }
        .theme-eye-care .jj-novel-content p { color: #2C3E50 !important; }
        .theme-eye-care .jj-novel-header, .theme-eye-care .jj-chapter-nav, .theme-eye-care .jj-comment-card { border-color: #B8C7A0 !important; }
        .theme-eye-care .jj-comment, .theme-eye-care .jj-comment:first-child { border-color: #C5D4A9 !important; }

        /* 专注主题 */
        .theme-focus .jj-container { background-color: #FFFCF4 !important; }
        .theme-focus .jj-novel-content p { color: #3C3C3C !important; }
        .theme-focus .jj-novel-header, .theme-focus .jj-chapter-nav, .theme-focus .jj-comment-card { border-color: #D9C8A7 !important; }
        .theme-focus .jj-comment, .theme-focus .jj-comment:first-child { border-color: #E6D5B8 !important; }

        /* 夜间主题 */
        .theme-dark { background-color: #2D2D30 !important; }
        .theme-dark .jj-container { background-color: #4A4A4D !important; box-shadow: 0 2px 12px rgba(0, 0, 0, 0.2) !important; }
        .theme-dark .jj-novel-content p,
        .theme-dark .jj-novel-content div,
        .theme-dark .jj-novel-content span,
        .theme-dark .jj-novel-content font {
            color: #EAEAEA !important; 
        }
        .theme-dark .jj-author-note,
        .theme-dark #note_danmu_wrapper,
        .theme-dark .note_main,
        .theme-dark .note_content {
            background-color: #3A3A3D !important; 
            color: #CCCCCC !important;          
            border-color: rgba(255, 255, 255, 0.1) !important;
        }

        .theme-dark .jj-novel-header, .theme-dark .jj-chapter-nav, .theme-dark .jj-comment-card, .theme-dark .jj-comment, .theme-dark .jj-comment:first-child { border-color: rgba(255, 255, 255, 0.1) !important; }
        .theme-dark a, .theme-dark .jj-novel-title a { color: #FFFFFF !important; }
        .theme-dark .jj-novel-author, .theme-dark .jj-novel-author a, .theme-dark .jj-comment-info { color: #BBBBBB !important; }
        
        /* 导航按钮样式  */
        .theme-dark .jj-nav-link,
        .theme-dark .jj-chapter-select {
            background-color: #5A5A5D !important;
            border-color: #666666 !important;
            color: #FFFFFF !important;
        }
        .theme-dark .jj-nav-link:hover,
        .theme-dark .jj-chapter-select:hover,
        .theme-dark .jj-chapter-select:focus {
            background-color: #666666 !important;
            border-color: #777777 !important;
        }
        
        /* 工具栏和评论区开关样式 */
        .theme-dark .jj-toolbar { background-color: rgba(74, 74, 77, 0.95) !important; border: 1px solid rgba(255, 255, 255, 0.1) !important; }
        .theme-dark .jj-toolbar-title { color: #FFFFFF !important; }
        .theme-dark .jj-font-size-btn, .theme-dark .jj-font-family-btn { color: #FFFFFF !important; }
        .theme-dark .jj-font-size-btn:hover, .theme-dark .jj-font-family-btn:hover { background: rgba(255, 255, 255, 0.1) !important; }
        .theme-dark .jj-font-size-dot { background-color: rgba(255, 255, 255, 0.2) !important; }
        .theme-dark .jj-font-size-dot.active { background-color: #FFFFFF !important; }
        .theme-dark .jj-comment-title, .theme-dark .jj-comment-content { color: #EAEAEA !important; }
        .theme-dark .jj-switch-label { color: #DDDDDD !important; }
        .theme-dark .jj-switch-slider { background-color: #5A5A5D !important; }
        .theme-dark .jj-switch-slider::before { background-color: #2D2D30 !important; }
        .theme-dark .jj-switch-input:checked + .jj-switch-slider { background-color: #7A7AFF !important; }
    `;
    document.head.appendChild(style);

    window.addEventListener('load', function() {
        function removeElements() {
            const selectors = 'div[style*="float:right"], img[src*="bookmark.gif"], span.favorite_novel, span[id*="favorite_"], div[style*="text-align: center"], div[id^="float_favorite"], div[id^="mongolia_layer"], div[id^="report_box"], div[id*="favoriteshow_"], span[id="chapterJurisdiction"], a[href*="freegold"]';
            document.querySelectorAll(selectors).forEach(el => { if (el.parentNode) el.parentNode.removeChild(el) });
        }

        const backToTopBtn = document.createElement('div');
        backToTopBtn.className = 'back-to-top';
        backToTopBtn.textContent = '↑';
        document.body.appendChild(backToTopBtn);
        backToTopBtn.onclick = () => window.scrollTo({ top: 0, behavior: 'smooth' });
        const toggleBackToTop = () => { backToTopBtn.style.display = window.scrollY > 200 ? 'flex' : 'none'; };
        window.addEventListener('scroll', toggleBackToTop);
        toggleBackToTop();

        function createNewLayout() {
            removeElements();

            let novelTitle = '', novelAuthor = '', authorHref = '', novelHref = '';
            const titleEl = document.querySelector('.noveltitle h1, .readtitle h1');
            if (titleEl) {
                const titleLink = titleEl.querySelector('a');
                novelTitle = (titleLink || titleEl).textContent.trim();
                if(titleLink) novelHref = titleLink.href;
            }
            if (!novelHref) {
                const match = window.location.href.match(/novelid=(\d+)/);
                if (match) novelHref = `https://www.jjwxc.net/onebook.php?novelid=${match[1]}`;
            }
            const authorEl = Array.from(document.querySelectorAll('span')).find(s => s.textContent.includes('作者：'));
            if (authorEl) {
                const authorLink = authorEl.querySelector('a');
                novelAuthor = (authorLink || authorEl).textContent.replace('作者：', '').trim();
                if(authorLink) authorHref = authorLink.href;
            }

            const contentEl = document.querySelector('.noveltext, .readtd, .novelbody[style*="grid-column:1"]');
            const contentHTML = contentEl ? contentEl.innerHTML : '';

            const container = document.createElement('div');
            container.className = 'jj-container';

            const headerDiv = document.createElement('div');
            headerDiv.className = 'jj-novel-header';
            const titleDiv = document.createElement('div');
            titleDiv.className = 'jj-novel-title';
            if (novelHref) {
                const a = document.createElement('a'); a.href = novelHref; a.target = '_blank'; a.textContent = novelTitle;
                titleDiv.appendChild(a);
            } else { titleDiv.textContent = novelTitle; }
            headerDiv.appendChild(titleDiv);

            if (novelAuthor) {
                const authorDiv = document.createElement('div');
                authorDiv.className = 'jj-novel-author';
                authorDiv.textContent = '作者：';
                if (authorHref) {
                    const a = document.createElement('a'); a.href = authorHref; a.target = '_blank'; a.textContent = novelAuthor;
                    authorDiv.appendChild(a);
                } else { authorDiv.append(novelAuthor); }
                headerDiv.appendChild(authorDiv);
            }

            const contentDiv = document.createElement('div');
            contentDiv.className = 'jj-novel-content';
            contentDiv.innerHTML = contentHTML;

            const navDiv = document.createElement('div');
            navDiv.className = 'jj-chapter-nav';
            let hasPrev = false, hasNext = false, hasTOC = false;
            document.querySelectorAll('a[href*="onebook.php"]').forEach(link => {
                const text = link.textContent.trim();
                if (text.includes('上一章') && !hasPrev) {
                    const a = document.createElement('a'); a.href = link.href; a.className = 'jj-nav-link'; a.textContent = text; navDiv.appendChild(a); hasPrev = true;
                }
            });
            let chapterSelect = document.getElementById('chapter_list');
            if (chapterSelect) {
                chapterSelect.className = 'jj-chapter-select'; navDiv.appendChild(chapterSelect); if(!chapterSelect.onchange) { chapterSelect.onchange = () => window.location.href = chapterSelect.value; }; hasTOC = true;
            }
            document.querySelectorAll('a[href*="onebook.php"]').forEach(link => {
                const text = link.textContent.trim();
                 if ((text.includes('目录') || text.includes('返回目录')) && !hasTOC) {
                    const a = document.createElement('a'); a.href = link.href; a.className = 'jj-nav-link'; a.textContent = text; navDiv.appendChild(a); hasTOC = true;
                }
            });
            document.querySelectorAll('a[href*="onebook.php"]').forEach(link => {
                const text = link.textContent.trim();
                if (text.includes('下一章') && !hasNext) {
                    const a = document.createElement('a'); a.href = link.href; a.className = 'jj-nav-link'; a.textContent = text; navDiv.appendChild(a); hasNext = true;
                }
            });

            container.append(headerDiv, contentDiv, navDiv);

            function getComments() { const comments = []; document.querySelectorAll('#comment_list > div[id^="comment_"]:not([data-processed])').forEach(el => { const timeEl = el.querySelector('.tdtitle .coltext'); const contentEl = el.querySelector('.readbody span[id^="mormalcomment_"]'); const time = timeEl?.textContent.match(/发表时间：([^<]+)/)?.[1]?.trim(); const chapter = timeEl?.textContent.match(/所评章节：([^<]+)/)?.[1]?.trim(); const info = [time, chapter ? `所评章节：${chapter}` : ''].filter(Boolean).join('　'); const content = contentEl?.textContent?.trim(); if (info && content) { comments.push({ info, content }); el.dataset.processed = 'true'; } }); return comments; }
            function renderCustomCommentSection(existingSection = null) { const comments = getComments(); if (comments.length === 0 && !existingSection) return null; const section = existingSection || document.createElement('div'); if (!existingSection) section.className = 'jj-comment-section'; const fragment = document.createDocumentFragment(); comments.forEach(c => { const commentDiv = document.createElement('div'); commentDiv.className = 'jj-comment'; const infoDiv = document.createElement('div'); infoDiv.className = 'jj-comment-info'; infoDiv.textContent = c.info; const contentDiv = document.createElement('div'); contentDiv.className = 'jj-comment-content'; contentDiv.textContent = c.content; commentDiv.append(infoDiv, contentDiv); fragment.appendChild(commentDiv); }); section.appendChild(fragment); return section; }

            const commentCard = document.createElement('div'); commentCard.className = 'jj-comment-card';
            const commentHeader = document.createElement('div'); commentHeader.className = 'jj-comment-header';
            const commentTitle = document.createElement('div'); commentTitle.className = 'jj-comment-title'; commentTitle.textContent = '评论区';
            const toggleWrap = document.createElement('div'); toggleWrap.className = 'jj-comment-toggle-wrap'; toggleWrap.innerHTML = `<label class="jj-switch"><input type="checkbox" class="jj-switch-input"><span class="jj-switch-slider"></span><span class="jj-switch-label">已隐藏评论</span></label>`;
            commentHeader.append(commentTitle, toggleWrap);

            let commentSection = renderCustomCommentSection();
            if (commentSection) {
                commentCard.append(commentHeader, commentSection);
                container.appendChild(commentCard);
                const switchInput = toggleWrap.querySelector('.jj-switch-input'); const switchLabel = toggleWrap.querySelector('.jj-switch-label');
                const isCommentVisible = localStorage.getItem('jj-comments-visible') === 'true';
                switchInput.checked = isCommentVisible;
                commentSection.style.display = isCommentVisible ? '' : 'none';
                switchLabel.textContent = isCommentVisible ? '已显示评论' : '已隐藏评论';
                switchInput.addEventListener('change', () => { const isChecked = switchInput.checked; commentSection.style.display = isChecked ? '' : 'none'; switchLabel.textContent = isChecked ? '已显示评论' : '已隐藏评论'; localStorage.setItem('jj-comments-visible', isChecked); });
                const originalCommentList = document.querySelector('#comment_list');
                if (originalCommentList) new MutationObserver(() => renderCustomCommentSection(commentSection)).observe(originalCommentList, { childList: true, subtree: true });
            }

            document.querySelectorAll('body > *:not(#sitetop):not(style):not(script):not(.back-to-top)').forEach(el => el.style.display = 'none');
            document.body.appendChild(container);

            createToolbar();
            initializeSettings();
        }

        setTimeout(createNewLayout, 500);
    });

    // ==================== 工具栏与设置函数 ====================
    function adjustFontSize(delta) { const content = document.querySelector('.jj-novel-content'); if (!content) return; let currentSize = parseInt(localStorage.getItem('jj-font-size')) || 18; const newSize = Math.min(Math.max(currentSize + delta * 2, 14), 28); content.querySelectorAll('p, div:not([class*="note"]), span, font').forEach(el => { el.style.setProperty('font-size', `${newSize}px`, 'important'); el.style.setProperty('line-height', '2', 'important'); }); localStorage.setItem('jj-font-size', newSize); updateFontSizeUI(newSize); }
    function updateFontSizeUI(currentSize) { const dots = document.querySelectorAll('.jj-font-size-dot'); const activeIndex = Math.floor((currentSize - 14) / 2); dots.forEach((dot, index) => dot.classList.toggle('active', index <= activeIndex)); document.querySelector('.jj-font-size-btn[data-action="decrease"]').disabled = currentSize <= 14; document.querySelector('.jj-font-size-btn[data-action="increase"]').disabled = currentSize >= 28; }
    function setTheme(theme) { document.body.className = document.body.className.replace(/theme-\w+/g, ''); document.body.classList.add(`theme-${theme}`); localStorage.setItem('jj-theme', theme); document.querySelectorAll('.jj-theme-card').forEach(card => card.classList.toggle('active', card.dataset.theme === theme)); }
    function setFontFamily(fontFamily) { const content = document.querySelector('.jj-novel-content'); if (content) content.querySelectorAll('p, div:not([class*="note"]), span, font').forEach(el => el.style.setProperty('font-family', fontFamily, 'important')); localStorage.setItem('jj-font-family', fontFamily); updateFontFamilyUI(fontFamily); }
    function updateFontFamilyUI(currentFont) { document.querySelectorAll('.jj-font-family-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.font === currentFont)); }
    function initializeSettings() { const savedTheme = localStorage.getItem('jj-theme') || 'default'; const savedFontSize = parseInt(localStorage.getItem('jj-font-size')) || 18; const savedFontFamily = localStorage.getItem('jj-font-family') || '"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei"'; setTheme(savedTheme); setFontFamily(savedFontFamily); const content = document.querySelector('.jj-novel-content'); if (content) content.querySelectorAll('p, div:not([class*="note"]), span, font').forEach(el => { el.style.setProperty('font-size', `${savedFontSize}px`, 'important'); el.style.setProperty('line-height', '2', 'important'); }); updateFontSizeUI(savedFontSize); }
    function createToolbar() { const trigger = document.createElement('div'); trigger.className = 'jj-toolbar-trigger'; trigger.innerHTML = `<div style="font-family: PingFang SC, sans-serif; display: flex; align-items: baseline; line-height: 1;"><span style="font-size: 16px; font-weight: 500;">A</span><span style="font-size: 12px; font-weight: 500;">A</span></div>`; const toolbar = document.createElement('div'); toolbar.className = 'jj-toolbar'; toolbar.innerHTML = `<div class="jj-toolbar-title">字体与主题</div><div class="jj-font-size-group"><div class="jj-font-size-buttons"><button class="jj-font-size-btn" data-action="decrease">小</button><button class="jj-font-size-btn" data-action="increase">大</button></div><div class="jj-font-size-dots">${Array(8).fill('<div class="jj-font-size-dot"></div>').join('')}</div></div><div class="jj-font-family-group"><button class="jj-font-family-btn" data-font='"PingFang SC", "Hiragino Sans GB", "Microsoft YaHei"'>黑体</button><button class="jj-font-family-btn" data-font='"Songti SC", SimSun, "宋体"'>宋体</button></div><div class="jj-theme-group"><div class="jj-theme-card" data-theme="default"><div class="jj-theme-preview default">纸张</div></div><div class="jj-theme-card" data-theme="eye-care"><div class="jj-theme-preview eye-care">护眼</div></div><div class="jj-theme-card" data-theme="focus"><div class="jj-theme-preview focus">专注</div></div><div class="jj-theme-card" data-theme="dark"><div class="jj-theme-preview dark">夜间</div></div></div>`; document.body.append(trigger, toolbar); toolbar.querySelector('.jj-font-size-btn[data-action="decrease"]').onclick = () => adjustFontSize(-1); toolbar.querySelector('.jj-font-size-btn[data-action="increase"]').onclick = () => adjustFontSize(1); toolbar.querySelectorAll('.jj-font-family-btn').forEach(btn => btn.onclick = () => setFontFamily(btn.dataset.font)); toolbar.querySelectorAll('.jj-theme-card').forEach(card => card.onclick = () => setTheme(card.dataset.theme)); trigger.addEventListener('click', (e) => { e.stopPropagation(); toolbar.classList.toggle('expanded'); }); document.addEventListener('click', (e) => { if (!toolbar.contains(e.target) && !trigger.contains(e.target)) toolbar.classList.remove('expanded'); }); }
})();