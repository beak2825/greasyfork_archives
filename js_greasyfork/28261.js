// ==UserScript==
// @name         锤子便签导出插件
// @namespace    http://tampermonkey.net/
// @version      0.1.3
// @description  锤子便签导出
// @author       Everest
// @date         2022-06-10
// @match        https://yun.smartisan.com/*
// @exclude      https://yun.smartisan.com/#/notes
// @grant        none
// @license MIT
// @icon data:image/ico;base64,AAABAAEAMDAAAAEAIACoJQAAFgAAACgAAAAwAAAAYAAAAAEAIAAAAAAAACQAABILAAASCwAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAA1wAVANwAEADXEBAA1zsQANdzEADXphAA18kRANjmEADX+RAA1/8RANf/EADX+RAA1+YQANfJEADXphAA13MQANc7EADXEB4A0QAQANcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAARANcAEQDXBRAA1ywQANd3EADXvhAA1+oQANf7EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/sQANfqEADXvhAA13cQANcsEQDYBREA2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEADXABAA1wMQANczEADXlBAA1+IQANf+EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/4QANfiEADXlBAA1zMRANgDEQDYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAA1wAQANcAEADXGhAA14EQANfjEADX/hAA1/8RANf/EQDX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8RANf/EQDX/xAA1/8QANf/EADX/xAA1/8RANf/EADX/xAA1/8QANf/EADX/hAA1+MQANeBEADXGhAA1wAPANcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEADXABAA1wIQANdAEADXwRAA1/0QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf9EADXwRAA10ARANkCEQDYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQANcAEADXBhAA12MQANfjEADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1+MRANdjEQDYBhEA2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAA1wARANcHEADXdxAA1/ERANf/EQDX/xEA1/8QANf/EADX/xAA1/8QANf/EQDX/xEA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8OANf/DwDX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANfxEADXdxAA1wcQANcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEADXABAA1wUQANd3EADX9RAA1/8QANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xIF2P8tKt3/JyHb/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX9RAA13cRANgFEQDYAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQANcADQDVARAA12MQANfxEADX/xAA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/FgrY/3V56f/e5Pr/nKDv/xIF2P8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/EQANdjDgDVARAA1wAAAAAAAAAAAAAAAAAAAAAAAAAAABEA2AAQANcAEADXQRAA1+MRANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8OANf/YWTm//P2/f//////tLrz/xQL2P8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANfjEQDXQREA2AAQANcAAAAAAAAAAAAAAAAAAAAAABAA1wAQANcaEQDXwRAA1/8QANf/EADX/xAA1/8RANj/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8WDdj/srnz////////////tLnz/xMK2P8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADXwRAA1xoQANcAAAAAAAAAAAAAAAAAEADXABAA1wIQANeBEADX/hAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8RANf/EADX/xAA1/8QANf/EADX/w8A1/8jHNv/zNX3////////////srXy/xII2P8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8RANf/EADX/hEA14ERANgCEADXAAAAAAAAAAAAEADXABAA1zMQANfiEADX/xAA1/8RANf/EADX/xAA1/8QANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8RANf/EADX/w8A1/8nH9v/09r4////////////sbTy/xIH2P8QANf/EADX/xAA1/8RANj/EQDX/xAA1/8QANf/EQDX/xEA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1+IRANczEQDXAAAAAAAQANcAEQDYAxAA15QQANf/EADX/xAA1/8QANf/EADX/xAA1/8RANf/EADX/xAA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/w8A1/8mHtv/0dj4////////////sbTy/xIH2P8QANf/EQDX/xEA1/8QANf/EQDX/xAA1/8QANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANeUDwDXAxAA1wAQANcAEADXLBAA1+IQANf/EADX/xAA1/8RANf/EADX/xAA1/8RANf/EADX/xAA1/8QANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/w8A1/8jHNv/zNX3////////////sbTy/xIH1/8QANf/EADX/xAA1/8RANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xEA1/8QANfiEADXLBAA1wAPANYAEADXdxAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/w8A1/8hGtv/yNH3////////////sbTy/xIH2P8QANf/EADX/xAA1/8QANf/EADX/xAA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADXdxEA2AARANcREADXvhAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/w8A1/8fGNr/xs/2////////////sbTy/xIH2P8QANf/EADX/xAA1/8QANf/EADX/xAA1/8RANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADXvhAA1xEQANc7EADX6hAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8dFtr/w8z2////////////sbTy/xIH2P8QANf/EADX/xAA1/8QANf/EADX/xEA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX6hAA1zsQANdzEADX+xAA1/8QANf/EADX/xAA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8cFdr/wcv2////////////sbTy/xIH2P8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/xEA1/8QANf/EADX/xAA1/8QANf/EADX+xAA13MRANemEQDX/xAA1/8QANf/EADX/xEA1/8RANj/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8aFNn/v8j1////////////sbTy/xIH2P8QANf/EADX/xAA1/8QANf/EADX/xAA1/8RANf/EADX/xEA1/8QANf/EQDX/xAA1/8QANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA16YQANfJEADX/xAA1/8QANf/EADX/xAA1/8RANf/EADX/xEA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8aE9n/vcf1////////////sbTy/xIH2P8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/xAA18kQANfmEADX/xAA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8ZEtn/vMX1////////////sbTy/xIH2P8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/xAA1+cQANf5EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8YENn/usP0////////////srXy/xII2P8QANf/EADX/xEA1/8QANf/EADX/xEA1/8QANf/EADX/xEA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/kQANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8XD9n/ucH0////////////tLnz/xQK2P8QANf/EADX/xAA1/8RANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8WDtj/t7/0////////////tLrz/xQL2P8QANf/EADX/xAA1/8RANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8RANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf5EADX/xAA1/8QANf/EQDX/xEA2P8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EQDX/xAA1/8VDdj/tr7z////////////tLrz/xQL2P8QANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/kQANfmEADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8UC9j/tLrz////////////tLrz/xQL2P8QANf/EQDX/xAA1/8QANf/EQDX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1+YQANfJEADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8TCtj/tLrz////////////tLrz/xQL2P8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xEA18kRANemEADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8SCNj/srby////////////tLnz/xQK2P8QANf/EADX/xAA1/8QANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/xAA1/8QANf/EADX/xEA1/8QANf/EQDX/xEA16YQANdzEADX+xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/xAA1/8SB9j/sbTy////////////s7jy/xMJ2P8QANf/EADX/xAA1/8QANf/EQDX/xAA1/8QANf/EQDX/xAA1/8RANf/EADX/xAA1/8QANf/EQDY/xAA1/8QANf/EADX/xEA1/8QANf/EADX+xEA13MQANc7EADX6hAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8SCNj/sbXy////////////tbzz/xQM2P8QANf/EQDX/xAA1/8QANf/EQDX/xAA1/8QANf/EADX/xAA1/8RANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EQDX/xAA1/8QANf/EADX6hAA1zsQANcREADXvhAA1/8RANf/EADX/xEA2P8RANf/EQDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/xAA1/8QANf/EADX/w4A1/8XEdn/vMT1////////////wcn1/xoV2f8PANf/DwDX/w4A1/8OANf/DQDX/w0A1/8NANf/DgDX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADXvhAA1xEQANcAEADXdxEA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8PANf/EAHX/xIC1/8TBtj/GBHZ/yEb2v9cXeX/6e38////////////6+/8/11e5f8iHNv/JiDb/zAo3f88Md//RkPg/1FX4/9jaeb/b3Xo/y4q3f8PANf/EADX/xAA1/8QANf/EADX/xAA1/8RANf/EADX/xAA1/8QANf/EADXdxEA2AAQANcAEADXLBAA1+IQANf/EADX/xEA1/8QANf/EADX/xEA1/8RANf/EQDX/xAA1/8QANf/EADX/w4A1/80MN7/kJbt/6ur8v+5uPT/wMb1/83V9//u8v3//////////////////////+3x/P/O1/j/0dr4/97k+v/s7vz/9vf+//v9/v/j6vv/hIzs/yAY2v8PANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/xEA1/8QANfiEQDXLBEA1wAQANcAEADXAxAA15QQANf/EADX/xAA1/8RANf/EQDX/xAA1/8RANj/EQDX/xAA1/8QANf/EADX/w0A1/98ger/////////////////////////////////////////////////////////////////////////////////8PT9/6ux8v9GReH/EQbX/w8A1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANeUDwDWAxAA1wAAAAAAEADXABAA1zMQANfiEADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/w8B1/+Jk+z//////////////////////////////////////////////////////////////////f7//+Xp+/+lq/H/UE/j/xgO2f8OANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1+IQANczEADXAAAAAAAAAAAAEQDXABEA1wIQANeBEADX/REA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/w0A1/99g+r////////////////////////////////////////////8/v//8vb9/9zg+v+wtvP/dHfp/zg03v8UCdj/DQDX/w8A1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/REA14ESANcCEQDXAAAAAAAAAAAAAAAAABAA1wAQANcaEADXwREA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/w8A1/8yK93/iI/s/6Kr8P+wuPP/tr30/7a89P+utfP/nafw/4qP7P9vbej/Skzi/ywk3P8WDNj/DgDX/w4A1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADXwREA2BoQANgAAAAAAAAAAAAAAAAAAAAAABAA1wAQANcAEADXQRAA1+MQANf/EADX/xAA1/8QANf/EQDX/xAA1/8QANf/EADX/xAA1/8PANf/DgLX/xMH2P8XCtn/GAvZ/xgL2f8WCdn/EgbY/w4B1/8MANb/DQDX/w4A1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANfjEADXQRAA1wAQANcAAAAAAAAAAAAAAAAAAAAAAAAAAAAQANcAEQDYARAA12MQANfxEADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8RANf/EQDX/xEA1/8RANf/EQDX/xAA1/EQANdjFQDXAREA1wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEADXABAA1wUQANd3EADX9RAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8RANf/EQDX9REA13cQANgFEADXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABAA1wAQANcHEADXdxAA1/EQANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/xAA1/8RANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANfxEADXdxAA1wcQANcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQANcAEADXBhAA12MQANfjEADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1+MQANdjEQDXBhEA1wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEADXAA8A1wIRANdAEADXwRAA1/0QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EQDX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/xAA1/8QANf9EADXwRAA10ARANcCEADXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABEA1gAQANgAEADXGhAA14EQANfjEADX/hAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EQDX/hAA1+MQANeBEADXGhAA1wAQANcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEADXABAA1wMRANczEADXlBAA1+IQANf+EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xEA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/4QANfiEADXlBAA1zMQANcDEADXAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAQANcAEADXBRAA1ywQANd3EADXvhEA1+oRANf7EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/8QANf/EADX/xAA1/sQANfqEADXvhAA13cQANcsEADYBREA2AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA8A1gBDAP8AEQDXEBEA1zsRANdzEADXphAA18kQANfmEADX+REA1/8QANf/EADX+RAA1+YQANfJEADXphAA13MQANc7EADXEBIA2QAQANcAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAD//wAA//8AAP/4AAAf/wAA/+AAAAf/AAD/wAAAA/8AAP8AAAAA/wAA/gAAAAB/AAD8AAAAAD8AAPgAAAAAHwAA8AAAAAAPAADwAAAAAA8AAOAAAAAABwAAwAAAAAADAADAAAAAAAMAAIAAAAAAAQAAgAAAAAABAACAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgAAAAAABAACAAAAAAAEAAIAAAAAAAQAAwAAAAAADAADAAAAAAAMAAOAAAAAABwAA8AAAAAAPAADwAAAAAA8AAPgAAAAAHwAA/AAAAAA/AAD+AAAAAH8AAP8AAAAA/wAA/8AAAAP/AAD/4AAAB/8AAP/4AAAf/wAA//8AAP//AAA=
// @downloadURL https://update.greasyfork.org/scripts/28261/%E9%94%A4%E5%AD%90%E4%BE%BF%E7%AD%BE%E5%AF%BC%E5%87%BA%E6%8F%92%E4%BB%B6.user.js
// @updateURL https://update.greasyfork.org/scripts/28261/%E9%94%A4%E5%AD%90%E4%BE%BF%E7%AD%BE%E5%AF%BC%E5%87%BA%E6%8F%92%E4%BB%B6.meta.js
// ==/UserScript==

(function() {
    'use strict';
    if (window.location.href != "https://yun.smartisan.com/apps/note/") {
        console.log(window.location.href + " wrong page...");
        //return;
    }
    //github FileSaver.js
    var saveAs = saveAs || (function(view) {
        // IE <10 is explicitly unsupported
        if (typeof view === "undefined" || typeof navigator !== "undefined" && /MSIE [1-9]\./.test(navigator.userAgent)) {
            return;
        }
        var doc = view.document
        // only get URL when necessary in case Blob.js hasn't overridden it yet
        , get_URL = function() {
            return view.URL || view.webkitURL || view;
        }
        , save_link = doc.createElementNS("http://www.w3.org/1999/xhtml", "a")
        , can_use_save_link = "download" in save_link
        , click = function(node) {
            var event = new MouseEvent("click");
            node.dispatchEvent(event);
        }
        , is_safari = /constructor/i.test(view.HTMLElement) || view.safari
        , is_chrome_ios =/CriOS\/[\d]+/.test(navigator.userAgent)
        , throw_outside = function(ex) {
            (view.setImmediate || view.setTimeout)(function() {
                throw ex;
            }, 0);
        }
        , force_saveable_type = "application/octet-stream"
        // the Blob API is fundamentally broken as there is no "downloadfinished" event to subscribe to
        , arbitrary_revoke_timeout = 1000 * 40 // in ms
        , revoke = function(file) {
            var revoker = function() {
                if (typeof file === "string") { // file is an object URL
                    get_URL().revokeObjectURL(file);
                } else { // file is a File
                    file.remove();
                }
            };
            setTimeout(revoker, arbitrary_revoke_timeout);
        }
        , dispatch = function(filesaver, event_types, event) {
            event_types = [].concat(event_types);
            var i = event_types.length;
            while (i--) {
                var listener = filesaver["on" + event_types[i]];
                if (typeof listener === "function") {
                    try {
                        listener.call(filesaver, event || filesaver);
                    } catch (ex) {
                        throw_outside(ex);
                    }
                }
            }
        }
        , auto_bom = function(blob) {
            // prepend BOM for UTF-8 XML and text/* types (including HTML)
            // note: your browser will automatically convert UTF-16 U+FEFF to EF BB BF
            if (/^\s*(?:text\/\S*|application\/xml|\S*\/\S*\+xml)\s*;.*charset\s*=\s*utf-8/i.test(blob.type)) {
                return new Blob([String.fromCharCode(0xFEFF), blob], {type: blob.type});
            }
            return blob;
        }
        , FileSaver = function(blob, name, no_auto_bom) {
            if (!no_auto_bom) {
                blob = auto_bom(blob);
            }
            // First try a.download, then web filesystem, then object URLs
            var filesaver = this
            , type = blob.type
            , force = type === force_saveable_type
            , object_url
            , dispatch_all = function() {
                dispatch(filesaver, "writestart progress write writeend".split(" "));
            }
            // on any filesys errors revert to saving with object URLs
            , fs_error = function() {
                if ((is_chrome_ios || (force && is_safari)) && view.FileReader) {
                    // Safari doesn't allow downloading of blob urls
                    var reader = new FileReader();
                    reader.onloadend = function() {
                        var url = is_chrome_ios ? reader.result : reader.result.replace(/^data:[^;]*;/, 'data:attachment/file;');
                        var popup = view.open(url, '_blank');
                        if(!popup) view.location.href = url;
                        url=undefined; // release reference before dispatching
                        filesaver.readyState = filesaver.DONE;
                        dispatch_all();
                    };
                    reader.readAsDataURL(blob);
                    filesaver.readyState = filesaver.INIT;
                    return;
                }
                // don't create more object URLs than needed
                if (!object_url) {
                    object_url = get_URL().createObjectURL(blob);
                }
                if (force) {
                    view.location.href = object_url;
                } else {
                    var opened = view.open(object_url, "_blank");
                    if (!opened) {
                        // Apple does not allow window.open, see https://developer.apple.com/library/safari/documentation/Tools/Conceptual/SafariExtensionGuide/WorkingwithWindowsandTabs/WorkingwithWindowsandTabs.html
                        view.location.href = object_url;
                    }
                }
                filesaver.readyState = filesaver.DONE;
                dispatch_all();
                revoke(object_url);
            }
            ;
            filesaver.readyState = filesaver.INIT;

            if (can_use_save_link) {
                object_url = get_URL().createObjectURL(blob);
                setTimeout(function() {
                    save_link.href = object_url;
                    save_link.download = name;
                    click(save_link);
                    dispatch_all();
                    revoke(object_url);
                    filesaver.readyState = filesaver.DONE;
                });
                return;
            }

            fs_error();
        }
        , FS_proto = FileSaver.prototype
        , saveAs = function(blob, name, no_auto_bom) {
            return new FileSaver(blob, name || blob.name || "download", no_auto_bom);
        }
        ;
        // IE 10+ (native saveAs)
        if (typeof navigator !== "undefined" && navigator.msSaveOrOpenBlob) {
            return function(blob, name, no_auto_bom) {
                name = name || blob.name || "download";

                if (!no_auto_bom) {
                    blob = auto_bom(blob);
                }
                return navigator.msSaveOrOpenBlob(blob, name);
            };
        }

        FS_proto.abort = function(){};
        FS_proto.readyState = FS_proto.INIT = 0;
        FS_proto.WRITING = 1;
        FS_proto.DONE = 2;

        FS_proto.error =
            FS_proto.onwritestart =
            FS_proto.onprogress =
            FS_proto.onwrite =
            FS_proto.onabort =
            FS_proto.onerror =
            FS_proto.onwriteend =
            null;

        return saveAs;
    }(
        typeof self !== "undefined" && self
        || typeof window !== "undefined" && window
        || this.content
    ));
// `self` is undefined in Firefox for Android content script context
// while `this` is nsIContentFrameMessageManager
// with an attribute `content` that corresponds to the window

    if (typeof module !== "undefined" && module.exports) {
        module.exports.saveAs = saveAs;
    } else if ((typeof define !== "undefined" && define !== null) && (define.amd !== null)) {
        define("FileSaver.js", function() {
            return saveAs;
        });
    }
    function process() {
        //把js代码注入到web page中，在web page的沙盒中执行
        var iframe = document.getElementById("cloud_app_notes");
        var rr = iframe.contentWindow.document.getElementById("rr");
        //var editor = iframe.contentWindow.document.getElementById("editor");
        if (rr == null) {
            var sss = iframe.contentWindow.document.createElement("script");
            sss.setAttribute("type", "text/javascript");
            sss.innerHTML = "function sss(e){var appElement = document.querySelector('[ng-controller=\"NoteListCtrl\"]');var $scope = angular.element(appElement).scope();var allNoteStr='', noteStr; var dateObj, year, month, date, hour, minute, second, dateStr; for(var i = 0; i < $scope.sortNoteList.length;i++){dateObj = new Date(parseInt($scope.sortNoteList[i].modify_time));year=dateObj.getFullYear();month=dateObj.getMonth()+1;date=dateObj.getDate(); hour=dateObj.getHours(); minute=dateObj.getMinutes(); second=dateObj.getSeconds(); dateStr=year+\"-\"+month+\"-\"+date+\" \"+hour+\":\"+minute+\":\"+second; noteStr = $scope.sortNoteList[i].detail + \"\\r\\n\" + '-'+dateStr + \"\\r\\n\" + '====='+ \"\\r\\n\"; allNoteStr += noteStr;} e.setAttribute('contentText',allNoteStr);return allNoteStr;}";
            //sss.innerHTML = showPropMethod();
            iframe.contentWindow.document.body.appendChild(sss);

            rr = iframe.contentWindow.document.createElement("iframe");
            //rr.setAttribute("src", "https://www.baidu.com");
            rr.setAttribute("onclick", "sss(this)");
            rr.setAttribute("id", "rr");
            rr.setAttribute("height", "0");
            //rr.setAttribute("contentText", "");
            iframe.contentWindow.document.body.appendChild(rr);
        }
        rr.click();
        var data = rr.getAttribute("contentText");
        rr.setAttribute("contentText", "");
        return data;
        //iframe.contentWindow.window.sss();//不在同一沙盒
    }
    setTimeout(function(){
        var iframe = document.getElementById("cloud_app_notes");
        console.log(iframe);
        if (iframe){
            console.log(iframe);
            let exportBtn = iframe.contentWindow.document.createElement("div");
            exportBtn.addEventListener("click", function(e){
                console.log("xxxxx");
                let data = process();
                //console.log(data);
                let dataBolb = new Blob([data], {"type": "text/plain;charset=utf-8"});
                saveAs(dataBolb, "锤子便签导出-"+ new Date().toLocaleString() + ".txt");
            });
            exportBtn.setAttribute("class", "button-normal button-brown f-r");
            let exportText = iframe.contentWindow.document.createElement("span");
            exportText.innerHTML = "导出";
            exportBtn.appendChild(exportText);

            var titleBar = iframe.contentWindow.document.querySelector(".titlebar");
            titleBar.appendChild(exportBtn);
        }

    }, 5000);
})();