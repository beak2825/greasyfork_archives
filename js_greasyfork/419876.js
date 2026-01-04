const md5 = require('md5');

const sb = '<G6sX,Lk~^2:Y%4Z';

function encode(plainText) {
  const now = new Date().getTime();
  const md5Data = md5(sb);
  let left = md5(md5Data.substr(0, 16));
  let right = md5(md5Data.substr(16, 32));
  let nowMD5 = md5(now).substr(-4);
  let Var_10 = (left + md5((left + nowMD5)));
  let Var_11 = Var_10['length'];
  let Var_12 = ((((now / 1000 + 86400) >> 0) + md5((plainText + right)).substr(0, 16)) + plainText);
  let Var_13 = '';
  for (let i = 0, Var_15 = Var_12.length;
    (i < Var_15); i++) {
    let Var_16 = Var_12.charCodeAt(i);
    if ((Var_16 < 128)) {
      Var_13 += String['fromCharCode'](Var_16);
    } else if ((Var_16 > 127) && (Var_16 < 2048)) {
      Var_13 += String['fromCharCode'](((Var_16 >> 6) | 192));
      Var_13 += String['fromCharCode'](((Var_16 & 63) | 128));
    } else {
      Var_13 += String['fromCharCode'](((Var_16 >> 12) | 224));
      Var_13 += String['fromCharCode']((((Var_16 >> 6) & 63) | 128));
      Var_13 += String['fromCharCode'](((Var_16 & 63) | 128));
    }
  }
  let Var_17 = Var_13.length;
  let Var_18 = [];
  for (let i = 0; i <= 255; i++) {
    Var_18[i] = Var_10[(i % Var_11)].charCodeAt();
  }
  let Var_19 = [];
  for (let Var_04 = 0;
    (Var_04 < 256); Var_04++) {
    Var_19.push(Var_04);
  }
  for (let Var_20 = 0, Var_04 = 0;
    (Var_04 < 256); Var_04++) {
    Var_20 = (((Var_20 + Var_19[Var_04]) + Var_18[Var_04]) % 256);
    let Var_21 = Var_19[Var_04];
    Var_19[Var_04] = Var_19[Var_20];
    Var_19[Var_20] = Var_21;
  }
  let Var_22 = '';
  for (let Var_23 = 0, Var_20 = 0, Var_04 = 0;
    (Var_04 < Var_17); Var_04++) {
    let Var_24 = '0|2|4|3|5|1'.split('|'),
      Var_25 = 0;
    while (true) {
      switch (Var_24[Var_25++]) {
        case '0':
          Var_23 = ((Var_23 + 1) % 256);
          continue;
        case '1':
          Var_22 += String.fromCharCode(Var_13[Var_04].charCodeAt() ^ Var_19[((Var_19[Var_23] + Var_19[Var_20]) % 256)]);
          continue;
        case '2':
          Var_20 = ((Var_20 + Var_19[Var_23]) % 256);
          continue;
        case '3':
          Var_19[Var_23] = Var_19[Var_20];
          continue;
        case '4':
          var Var_21 = Var_19[Var_23];
          continue;
        case '5':
          Var_19[Var_20] = Var_21;
          continue;
      }
      break;
    }
  }
  let Var_26 = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
  for (var Var_27, Var_28, Var_29 = 0, Var_30 = Var_26, Var_31 = ''; Var_22.charAt((Var_29 | 0)) || (Var_30 = '=', (Var_29 % 1)); Var_31 += Var_30.charAt((63 & (Var_27 >> (8 - ((Var_29 % 1) * 8)))))) {
    Var_28 = Var_22['charCodeAt'](Var_29 += 0.75);
    Var_27 = ((Var_27 << 8) | Var_28);
  }
  Var_22 = (nowMD5 + Var_31.replace(/=/g, '')).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '.');
  return (('data=' + Var_22) + '&v=2');
}

console.log(encode("text=阿桑&page=1&type=migu"));