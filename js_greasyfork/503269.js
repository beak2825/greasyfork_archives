// ==UserScript==
// @name         Rips
// @namespace    http://tampermonkey.net/
// @version      1.2.2
// @description  Rips script
// @author       Current__
// @require      https://cdn.jsdelivr.net/npm/sweetalert2@11.12.4/dist/sweetalert2.all.min.js
// @match        *pornrips.to/*
// @license      AGPL-3.0-or-later
// @run-at       document-start
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @resource customCSS https://cdn.jsdelivr.net/npm/sweetalert2@11.12.4/dist/sweetalert2.min.css
// @grant        GM_addStyle
// @grant        GM_getResourceText
// @downloadURL https://update.greasyfork.org/scripts/503269/Rips.user.js
// @updateURL https://update.greasyfork.org/scripts/503269/Rips.meta.js
// ==/UserScript==

// Module for encoding/decoding base32
var Base32 = (function () {
  "use strict";

  var alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567",
    pad_lengths = [0, 1, 3, 4, 6],
    pad_char = "=";

  return {
    encode: function (str) {
      var len = str.length,
        str_new = "",
        i = 0,
        c1,
        c2,
        c3,
        c4,
        c5;

      while (str.length % 5 !== 0) str += "\x00";

      while (i < len) {
        c1 = str.charCodeAt(i++);
        c2 = str.charCodeAt(i++);
        c3 = str.charCodeAt(i++);
        c4 = str.charCodeAt(i++);
        c5 = str.charCodeAt(i++);

        str_new += alphabet[c1 >> 3];
        str_new += alphabet[((c1 & 0x07) << 2) | (c2 >> 6)];
        str_new += alphabet[(c2 & 0x3f) >> 1];
        str_new += alphabet[((c2 & 0x01) << 4) | (c3 >> 4)];
        str_new += alphabet[((c3 & 0x0f) << 1) | (c4 >> 7)];
        str_new += alphabet[(c4 & 0x7f) >> 2];
        str_new += alphabet[((c4 & 0x03) << 3) | (c5 >> 5)];
        str_new += alphabet[c5 & 0x1f];
      }

      if (i > len) {
        i = pad_lengths[i - len];
        str_new = str_new.substr(0, str_new.length - i);
        while (str_new.length % 8 !== 0) str_new += pad_char;
      }

      return str_new;
    },
    decode: function (str) {
      var len = str.length,
        str_new = "",
        bits = 0,
        char_buffer = 0,
        i;

      while (len > 0 && str[len - 1] == "=") --len;

      for (i = 0; i < len; ++i) {
        char_buffer = (char_buffer << 5) | alphabet.indexOf(str[i]);

        bits += 5;
        if (bits >= 8) {
          str_new += String.fromCharCode((char_buffer >> (bits - 8)) & 0xff);
          bits -= 8;
        }
      }

      return str_new;
    },
  };
})();

var SHA1 = (function () {
  "use strict";

  var hash_size = 20,
    message_block_length = 64,
    message_block_terminator = 0x80,
    message_length_bytes = 8,
    initial_intermediate_hash = new Uint32Array(5),
    K_constants = new Uint32Array(4);

  initial_intermediate_hash[0] = 0x67452301;
  initial_intermediate_hash[1] = 0xefcdab89;
  initial_intermediate_hash[2] = 0x98badcfe;
  initial_intermediate_hash[3] = 0x10325476;
  initial_intermediate_hash[4] = 0xc3d2e1f0;

  K_constants[0] = 0x5a827999;
  K_constants[1] = 0x6ed9eba1;
  K_constants[2] = 0x8f1bbcdc;
  K_constants[3] = 0xca62c1d6;

  var SHA1 = function () {
    this.length = 0;
    this.message_block_index = 0;
    this.message_block = new Uint8Array(message_block_length);
    this.intermediate_hash = new Uint32Array(initial_intermediate_hash);
  };

  var pad = function () {
    var maxlen = this.message_block.length - message_length_bytes,
      high = Math.floor(this.length / 0x0ffffffff) & 0xffffffff,
      low = this.length & 0xffffffff,
      message_block = this.message_block,
      message_block_index = this.message_block_index,
      input_intermediate_hash = this.intermediate_hash,
      output_intermediate_hash = new Uint32Array(this.intermediate_hash.length);

    message_block[message_block_index] = message_block_terminator;

    if (message_block_index >= maxlen) {
      while (++message_block_index < message_block.length)
        message_block[message_block_index] = 0;

      process.call(
        this,
        message_block,
        input_intermediate_hash,
        output_intermediate_hash
      );

      message_block = new Uint8Array(message_block.length);
      input_intermediate_hash = output_intermediate_hash;
    } else {
      while (++message_block_index < maxlen)
        message_block[message_block_index] = 0;
    }

    message_block[maxlen] = (high >>> 24) & 0xff;
    message_block[++maxlen] = (high >>> 16) & 0xff;
    message_block[++maxlen] = (high >>> 8) & 0xff;
    message_block[++maxlen] = high & 0xff;
    message_block[++maxlen] = (low >>> 24) & 0xff;
    message_block[++maxlen] = (low >>> 16) & 0xff;
    message_block[++maxlen] = (low >>> 8) & 0xff;
    message_block[++maxlen] = low & 0xff;

    process.call(
      this,
      message_block,
      input_intermediate_hash,
      output_intermediate_hash
    );

    return output_intermediate_hash;
  };
  var process = function (
    message_block,
    intermediate_hash_input,
    intermediate_hash_output
  ) {
    var W = new Uint32Array(80),
      i,
      i4,
      temp,
      A,
      B,
      C,
      D,
      E;

    for (i = 0; i < 16; ++i) {
      i4 = i * 4;
      W[i] =
        (message_block[i4] << 24) |
        (message_block[i4 + 1] << 16) |
        (message_block[i4 + 2] << 8) |
        message_block[i4 + 3];
    }
    for (; i < 80; ++i) {
      W[i] = circular_shift(1, W[i - 3] ^ W[i - 8] ^ W[i - 14] ^ W[i - 16]);
    }

    A = intermediate_hash_input[0];
    B = intermediate_hash_input[1];
    C = intermediate_hash_input[2];
    D = intermediate_hash_input[3];
    E = intermediate_hash_input[4];

    for (i = 0; i < 20; ++i) {
      temp =
        circular_shift(5, A) + ((B & C) | (~B & D)) + E + W[i] + K_constants[0];
      E = D;
      D = C;
      C = circular_shift(30, B);
      B = A;
      A = temp & 0xffffffff;
    }
    for (; /*i = 20*/ i < 40; ++i) {
      temp = circular_shift(5, A) + (B ^ C ^ D) + E + W[i] + K_constants[1];
      E = D;
      D = C;
      C = circular_shift(30, B);
      B = A;
      A = temp & 0xffffffff;
    }
    for (; /*i = 40*/ i < 60; ++i) {
      temp =
        circular_shift(5, A) +
        ((B & C) | (B & D) | (C & D)) +
        E +
        W[i] +
        K_constants[2];
      E = D;
      D = C;
      C = circular_shift(30, B);
      B = A;
      A = temp & 0xffffffff;
    }
    for (; /*i = 60*/ i < 80; ++i) {
      temp = circular_shift(5, A) + (B ^ C ^ D) + E + W[i] + K_constants[3];
      E = D;
      D = C;
      C = circular_shift(30, B);
      B = A;
      A = temp & 0xffffffff;
    }

    intermediate_hash_output[0] = intermediate_hash_input[0] + A;
    intermediate_hash_output[1] = intermediate_hash_input[1] + B;
    intermediate_hash_output[2] = intermediate_hash_input[2] + C;
    intermediate_hash_output[3] = intermediate_hash_input[3] + D;
    intermediate_hash_output[4] = intermediate_hash_input[4] + E;
  };
  var circular_shift = function (bits, word) {
    return (word << bits) | (word >>> (32 - bits));
  };

  SHA1.prototype = {
    constructor: SHA1,

    reset: function () {
      var i;

      this.length = 0;
      this.message_block_index = 0;

      for (i = 0; i < this.intermediate_hash.length; ++i) {
        this.intermediate_hash[i] = initial_intermediate_hash[i];
      }
      for (i = 0; i < this.message_block.length; ++i) {
        this.message_block[i] = 0;
      }
    },

    update: function (value_array) {
      var is_string = typeof value_array == "string",
        i;

      for (i = 0; i < value_array.length; ++i) {
        this.message_block[this.message_block_index] = is_string
          ? value_array.charCodeAt(i)
          : value_array[i];

        this.length += 8;

        if (++this.message_block_index >= this.message_block.length) {
          process.call(
            this,
            this.message_block,
            this.intermediate_hash,
            this.intermediate_hash
          );
          this.message_block_index = 0;
        }
      }
    },

    digest: function () {
      var digest = new Uint8Array(hash_size),
        intermediate_hash_temp = pad.call(this),
        i;

      for (i = 0; i < digest.length; ++i) {
        digest[i] = intermediate_hash_temp[i >> 2] >> (8 * (3 - (i & 0x03)));
      }

      return digest;
    },
  };

  return SHA1;
})();

var Bencode = (function () {
  "use strict";

  var encode = function (value) {
    var t = typeof value;

    if (t == "number") return encode_int(Math.floor(value));
    if (t == "string") return encode_string(value);
    if (Array.isArray(value)) return encode_list(value);
    return encode_dict(value);
  };

  var encode_int = function (value) {
    return "i" + value + "e";
  };
  var encode_string = function (value) {
    return "" + value.length + ":" + value;
  };
  var encode_list = function (value) {
    var str = ["l"],
      i;

    for (i = 0; i < value.length; ++i) {
      str.push(encode(value[i]));
    }

    str.push("e");
    return str.join("");
  };
  var encode_dict = function (value) {
    var str = ["d"],
      keys = [],
      i;

    for (i in value) keys.push(i);
    keys.sort();

    for (i = 0; i < keys.length; ++i) {
      str.push(encode_string(keys[i]));
      str.push(encode(value[keys[i]]));
    }

    str.push("e");
    return str.join("");
  };

  var Decoder = function () {
    this.pos = 0;
  };

  Decoder.prototype = {
    constructor: Decoder,

    decode: function (str) {
      var k = str[this.pos];
      if (!(k in decode_generic)) throw "Invalid format";

      return decode_generic[k].call(this, str);
    },
    decode_int: function (str) {
      ++this.pos;

      var end = str.indexOf("e", this.pos),
        value;

      if (end < 0) throw "Invalid format";

      value = parseInt(str.substr(this.pos, end - this.pos), 10);

      this.pos = end + 1;
      return value;
    },
    decode_string: function (str) {
      var delim = str.indexOf(":", this.pos),
        length,
        value;

      if (delim < 0) throw "Invalid format";
      length = parseInt(str.substr(this.pos, delim - this.pos), 10);
      value = str.substr(delim + 1, length);

      this.pos = delim + length + 1;
      return value;
    },
    decode_list: function (str) {
      ++this.pos;

      var list = [],
        value;

      while (str[this.pos] != "e") {
        value = this.decode(str);
        list.push(value);
      }

      ++this.pos;
      return list;
    },
    decode_dict: function (str) {
      ++this.pos;

      var dict = {},
        key,
        value;

      while (str[this.pos] != "e") {
        key = this.decode_string(str);
        value = this.decode(str);
        dict[key] = value;
      }

      ++this.pos;
      return dict;
    },
  };

  var decode_generic = {
      l: Decoder.prototype.decode_list,
      d: Decoder.prototype.decode_dict,
      i: Decoder.prototype.decode_int,
    },
    i;
  for (i = 0; i < 10; ++i) {
    decode_generic[i.toString()] = Decoder.prototype.decode_string;
  }

  return {
    encode: encode,
    decode: function (str) {
      return new Decoder().decode(str);
    },
  };
})();

(function () {
  "use strict";

  if (document.getElementsByClassName("post-template-default").length === 0)
    return;

  const images = [...document.images];
  const entryTitle =
    document.getElementsByClassName("entry-title")[0].innerHTML;

  async function fetchVideoCode(videoName) {
    const response = await fetch("https://current.icu:8888/rips/isVideo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ videoName }),
    });
    return response.json();
  }

  async function handleImage(image, resultCode, resultData) {
    const coverImgUrl = image.dataset.src;
    const newCoverImgUrl = coverImgUrl.replace(
      /https:\/\/[a-z]*(\d+)\.pixhost\.to\/thumbs/,
      (match, p1) => `https://img${p1}.pixhost.to/images`
    );

    image.dataset.src = newCoverImgUrl;

    const linkElement = image.parentElement;
    if (linkElement && linkElement.href && linkElement.target === "") {
      if (resultCode === 201) {
        await processMagnetLink(linkElement);
      } else if (resultCode === 202) {
        await displayFolderFiles(linkElement);
      } else {
        await playerVideo(linkElement, resultData);
      }
    }
  }
  async function playerVideo(linkElement, resultData) {
    const grandparentElement = linkElement.parentNode;
    grandparentElement.innerHTML = "";

    const btn = document.createElement("button");
    Object.assign(btn.style, {
      padding: "0.9em 2.1875em",
      border: "0",
      borderRadius: "0.1875em",
      backgroundColor: "#7066e0",
      boxShadow: "none",
    });

    const a = document.createElement("a");
    Object.assign(a.style, {
      fontWeight: "500",
      fontSize: "1.125em",
      color: "#fff",
      textDecoration: "none",
    });
    a.innerHTML = "播放视频";
    a.href = `intent:https://current.icu:8888/115Cloud/${resultData}/.mp4#Intent;package=com.mxtech.videoplayer.ad;S.title=${entryTitle};end`;
    btn.appendChild(a);

    grandparentElement.appendChild(btn);
  }
  async function processMagnetLink(linkElement) {
    const xhr = new XMLHttpRequest();
    xhr.responseType = "arraybuffer";

    xhr.onload = function () {
      if (xhr.response instanceof ArrayBuffer) {
        const data = new Uint8Array(xhr.response);
        const decoded = Bencode.decode(String.fromCharCode.apply(null, data));
        const infoHash = getInfoHash(decoded.info);

        linkElement.innerText = `magnet:?xt=urn:btih:${infoHash}`;
        linkElement.href = `javascript:void(0)`;
        linkElement.onclick = () => handleMagnetClick(infoHash);
      }
    };

    xhr.open("GET", linkElement.href, true);
    xhr.send();
  }

  function getInfoHash(info) {
    const infoBencoded = Bencode.encode(info);
    const infoHasher = new SHA1();
    infoHasher.update(infoBencoded);
    let infoHash = infoHasher.digest();
    return Base32.encode(String.fromCharCode.apply(null, infoHash));
  }

  function handleMagnetClick(infoHash) {
    fetch("https://current.icu:8888/rips/addVideo", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoName: entryTitle,
        magnet: `magnet:?xt=urn:btih:${infoHash}`,
      }),
    })
      .then((response) => response.json())
      .then(({ code, message }) => {
        Swal.fire({
          title: code === 0 ? "添加成功" : message,
          icon: code === 0 ? "success" : "error",
        }).then(() => {
          if (code === 0) location.reload();
        });
      });
  }

  async function displayFolderFiles(linkElement) {
    const response = await fetch(
      "https://current.icu:8888/rips/getFolderFile",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ videoName: entryTitle }),
      }
    );
    const { data } = await response.json();

    const grandparentElement = linkElement.parentNode;
    grandparentElement.innerHTML = "";

    const bigCard = createBigCard(data);
    grandparentElement.appendChild(bigCard);
  }

  function handleCardClick(pickCode) {
    fetch("https://current.icu:8888/rips/selectFile", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        videoName: entryTitle,
        pickCode: pickCode,
      }),
    }).then(() => location.reload());
  }

  function createBigCard(data) {
    const bigCard = document.createElement("div");
    Object.assign(bigCard.style, {
      width: "27.5rem",
      maxHeight: "20rem",
      padding: "1.5rem",
      backgroundColor: "#ffffff",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      display: "flex",
      flexDirection: "column",
      gap: "1.5rem",
      overflowY: "auto",
    });

    data.forEach((file) => {
      const smallCard = document.createElement("div");
      Object.assign(smallCard.style, {
        padding: "1rem",
        backgroundColor: "#f0f0f0",
        border: "1px solid #ddd",
        borderRadius: "5px",
        display: "flex",
        gap: "1rem",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
      });
      const title = document.createElement("p");
      title.style.margin = "0";
      title.innerHTML = "文件名：";
      smallCard.onclick = () => handleCardClick(file["pickCode"]);
      smallCard.appendChild(title);
      const content = document.createElement("p");
      content.style.maxWidth = "17rem";
      content.style.wordBreak = "break-all";
      content.style.margin = "0";
      content.innerHTML = file["videoName"];
      smallCard.appendChild(content);
      bigCard.appendChild(smallCard);
    });
    return bigCard;
  }

  fetchVideoCode(entryTitle).then(({ code, data }) => {
    images.forEach((image) => handleImage(image, code, data));
  });
})();
