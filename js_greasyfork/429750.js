// ==UserScript==
// @name         一键Hook加密算法
// @namespace    By:亮亮 QQ 2035776757
// @version      1.2
// @description  一键Hook Crypto RSA 几个基本的方法  AES DES 3DES Hmac  SHA
// @author       liangliang
// @match        https://*/*
// @match        http://*/*
// @icon         data:image/gif;base64,R0lGODlhAQABAAAAACH5BAEKAAEALAAAAAABAAEAAAICTAEAOw==
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/429750/%E4%B8%80%E9%94%AEHook%E5%8A%A0%E5%AF%86%E7%AE%97%E6%B3%95.user.js
// @updateURL https://update.greasyfork.org/scripts/429750/%E4%B8%80%E9%94%AEHook%E5%8A%A0%E5%AF%86%E7%AE%97%E6%B3%95.meta.js
// ==/UserScript==

(function() {
    'use strict';
    window.SHook = false
    var Crypto = window.CryptoJS
    if (Crypto == undefined) {
        return
    }
    //AES加解密
    if (Crypto.AES != undefined) {
        var AESencrypt = Crypto.AES.encrypt
        var AESdecrypt = Crypto.AES.decrypt
        window.CryptoJS.AES.encrypt = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return AESencrypt(arguments[0], arguments[1], arguments[2])
            }
            console.log('检测到AES加密：');
            var AESKey = arguments[1]
            var AESIv = arguments[2]["iv"]
            console.log("EnData:" + CryptoJS.enc.Utf8.stringify(Data))
            console.log("AES Key:" + CryptoJS.enc.Utf8.stringify(AESKey))
            console.log("AES Iv:" + CryptoJS.enc.Utf8.stringify(AESIv))
            return AESencrypt(arguments[0], arguments[1], arguments[2])
        }
        window.CryptoJS.AES.decrypt = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return AESdecrypt(arguments[0], arguments[1], arguments[2])
            }
            console.log('检测到AES解密：');
            var AESKey = arguments[1]
            var AESIv = arguments[2]["iv"]
            console.log("DeData:" + Data)
            console.log("AES Key:" + CryptoJS.enc.Utf8.stringify(AESKey))
            console.log("AES Iv:" + CryptoJS.enc.Utf8.stringify(AESIv))
            return AESdecrypt(arguments[0], arguments[1], arguments[2])
        }
    }
    //DES加解密
    if (Crypto.DES != undefined) {
        var DESencrypt = Crypto.DES.encrypt
        var DESdecrypt = Crypto.DES.decrypt
        window.CryptoJS.DES.encrypt = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return DESencrypt(arguments[0], arguments[1], arguments[2])
            }
            console.log('检测到DES加密：');
            var AESKey = arguments[1]
            var AESIv = arguments[2]["iv"]
            console.log("EnData:" + CryptoJS.enc.Utf8.stringify(Data))
            console.log("AES Key:" + CryptoJS.enc.Utf8.stringify(AESKey))
            console.log("AES Iv:" + CryptoJS.enc.Utf8.stringify(AESIv))
            return AESencrypt(arguments[0], arguments[1], arguments[2])
        }
        window.CryptoJS.DES.decrypt = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return AESdecrypt(arguments[0], arguments[1], arguments[2])
            }
            console.log('检测到DES解密：');
            var AESKey = arguments[1]
            var AESIv = arguments[2]["iv"]
            console.log("DeData:" + Data)
            console.log("AES Key:" + CryptoJS.enc.Utf8.stringify(AESKey))
            console.log("AES Iv:" + CryptoJS.enc.Utf8.stringify(AESIv))
            return DESdecrypt(arguments[0], arguments[1], arguments[2])
        }
    }
    //3DES加解密
    if (Crypto.TripleDES != undefined) {
        var TripleDESencrypt = Crypto.TripleDES.encrypt
        var TripleDESdecrypt = Crypto.TripleDES.decrypt
        window.CryptoJS.TripleDES.encrypt = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return TripleDESencrypt(arguments[0], arguments[1], arguments[2])
            }
            console.log('检测到TripleDES加密：');
            var AESKey = arguments[1]
            var AESIv = arguments[2]["iv"]
            console.log("EnData:" + CryptoJS.enc.Utf8.stringify(Data))
            console.log("AES Key:" + CryptoJS.enc.Utf8.stringify(AESKey))
            console.log("AES Iv:" + CryptoJS.enc.Utf8.stringify(AESIv))
            return AESencrypt(arguments[0], arguments[1], arguments[2])
        }
        window.CryptoJS.TripleDES.decrypt = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return AESdecrypt(arguments[0], arguments[1], arguments[2])
            }
            console.log('检测到TripleDES解密：');
            var AESKey = arguments[1]
            var AESIv = arguments[2]["iv"]
            console.log("DeData:" + Data)
            console.log("AES Key:" + CryptoJS.enc.Utf8.stringify(AESKey))
            console.log("AES Iv:" + CryptoJS.enc.Utf8.stringify(AESIv))
            return TripleDESdecrypt(arguments[0], arguments[1], arguments[2])
        }
    }
    //Hmac
    var HMAC_MD5encrypt = Crypto.HmacMD5
    var HMAC_SHA1encrypt = Crypto.HmacSHA1
    var HMAC_SHA256encrypt = Crypto.HmacSHA256
    var HMAC_SHA384encrypt = Crypto.HmacSHA384
    var HMAC_SHA512encrypt = Crypto.HmacSHA512

    if (Crypto.HmacMD5 != undefined) {
        window.CryptoJS.HmacMD5 = function() {
            var Data = arguments[0];
            if (Data == "" || window.SHook == false) {
                return HMAC_MD5encrypt(arguments[0], arguments[1]);
            }
            ;console.log("检测到HmacMD5加密：");
            var HmacKey = arguments[1];
            console.log("EnData:" + Data);
            console.log("HmacKey:" + HmacKey);
            return HMAC_MD5encrypt(arguments[0], arguments[1]);
        }
    }
    if (Crypto.HmacSHA1 != undefined) {
        window.CryptoJS.HmacSHA1 = function() {
            var Data = arguments[0];
            if (Data == "" || window.SHook == false) {
                return HMAC_SHA1encrypt(arguments[0], arguments[1]);
            }
            ;console.log("检测到HmacSHA1加密：");
            var HmacKey = arguments[1];
            console.log("EnData:" + Data);
            console.log("HmacKey:" + HmacKey);
            return HMAC_SHA1encrypt(arguments[0], arguments[1]);
        }
    }
    if (Crypto.HmacSHA256 != undefined) {
        window.CryptoJS.HmacSHA256 = function() {
            var Data = arguments[0];
            if (Data == "" || window.SHook == false) {
                return HMAC_SHA256encrypt(arguments[0], arguments[1]);
            }
            ;console.log("检测到HmacSHA256加密：");
            var HmacKey = arguments[1];
            console.log("EnData:" + Data);
            console.log("HmacKey:" + HmacKey);
            return HMAC_SHA256encrypt(arguments[0], arguments[1]);
        }
    }
    if (Crypto.HmacSHA384 != undefined) {
        window.CryptoJS.HmacSHA384 = function() {
            var Data = arguments[0];
            if (Data == "" || window.SHook == false) {
                return HMAC_SHA384encrypt(arguments[0], arguments[1]);
            }
            ;console.log("检测到HmacSHA384加密：");
            var HmacKey = arguments[1];
            console.log("EnData:" + Data);
            console.log("HmacKey:" + HmacKey);
            return HMAC_SHA384encrypt(arguments[0], arguments[1]);
        }
    }
    if (Crypto.HmacSHA512 != undefined) {
        window.CryptoJS.HmacSHA512 = function() {
            var Data = arguments[0];
            if (Data == "" || window.SHook == false) {
                return HMAC_SHA512encrypt(arguments[0], arguments[1]);
            }
            ;console.log("检测到HmacSHA512加密：");
            var HmacKey = arguments[1];
            console.log("EnData:" + Data);
            console.log("HmacKey:" + HmacKey);
            return HMAC_SHA512encrypt(arguments[0], arguments[1]);
        }
    }
    //Rabbit加解密
    if (Crypto.TripleDES != undefined) {
        var Rabbitencrypt = Crypto.Rabbit.encrypt
        var Rabbitdecrypt = Crypto.Rabbit.decrypt
        window.CryptoJS.Rabbit.encrypt = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return Rabbitencrypt(arguments[0], arguments[1])
            }
            console.log('检测到Rabbit加密：');
            console.log("EnData:" + Data)
            console.log("Key:" + arguments[1])
            return Rabbitencrypt(arguments[0], arguments[1])
        }
        window.CryptoJS.Rabbit.decrypt = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return Rabbitdecrypt(arguments[0], arguments[1])
            }
            console.log('检测到Rabbit解密：');
            console.log("DeData:" + Data)
            console.log("Key:" + arguments[1])
            return Rabbitdecrypt(arguments[0], arguments[1])
        }
    }
    //PBKDF2加解密
    if (Crypto.PBKDF2 != undefined) {
        var PBKDF2encrypt = Crypto.PBKDF2
        window.CryptoJS.PBKDF2 = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return PBKDF2encrypt(arguments[0], arguments[1], arguments[2])
            }
            console.log('检测到PBKDF2加密：');
            console.log("EnData:" + Data)
            console.log("Salt:" + arguments[1])
            console.log("KeySize:" + arguments[2]['keySize'])
            console.log("iterations:" + arguments[2]['iterations'])
            return PBKDF2encrypt(arguments[0], arguments[1], arguments[2])
        }
    }
    //PBKDF2加解密
    if (Crypto.EvpKDF != undefined) {
        var EvpKDFencrypt = Crypto.EvpKDF
        window.CryptoJS.EvpKDF = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return EvpKDFencrypt(arguments[0], arguments[1], arguments[2])
            }
            console.log('检测到EvpKDF加密：');
            console.log("EnData:" + Data)
            console.log("Salt:" + arguments[1])
            console.log("KeySize:" + arguments[2]['keySize'])
            console.log("iterations:" + arguments[2]['iterations'])
            return EvpKDFencrypt(arguments[0], arguments[1], arguments[2])
        }
    }
    //Md5加密
    if (Crypto.MD5 != undefined) {
        var MD5encrypt = Crypto.MD5
        window.CryptoJS.MD5 = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return MD5encrypt(arguments[0])
            }
            console.log('检测到MD5加密：');
            console.log("EnData:" + Data)
            return MD5encrypt(arguments[0])
        }
    }
    //SHA1加密
    if (Crypto.SHA1 != undefined) {
        var SHA1encrypt = Crypto.SHA1
        window.CryptoJS.SHA1 = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return SHA1encrypt(arguments[0])
            }
            console.log('检测到SHA1加密：');
            console.log("EnData:" + Data)
            return SHA1encrypt(arguments[0])
        }
    }
    //SHA3加密
    if (Crypto.SHA3 != undefined) {
        var SHA3encrypt = Crypto.SHA3
        window.CryptoJS.SHA3 = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return SHA3encrypt(arguments[0])
            }
            console.log('检测到SHA3加密：');
            console.log("EnData:" + Data)
            return SHA3encrypt(arguments[0])
        }
    }
    //SHA224加密
    if (Crypto.SHA224 != undefined) {
        var SHA224encrypt = Crypto.SHA224
        window.CryptoJS.SHA224 = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return SHA224encrypt(arguments[0])
            }
            console.log('检测到SHA224加密：');
            console.log("EnData:" + Data)
            return SHA224encrypt(arguments[0])
        }
    }
    //SHA256加密
    if (Crypto.SHA256 != undefined) {
        var SHA256encrypt = Crypto.SHA256
        window.CryptoJS.SHA256 = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return SHA256encrypt(arguments[0])
            }
            console.log('检测到SHA256加密：');
            console.log("EnData:" + Data)
            return SHA256encrypt(arguments[0])
        }
    }
    //SHA384加密
    if (Crypto.SHA384 != undefined) {
        var SHA384encrypt = Crypto.SHA384
        window.CryptoJS.SHA384 = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return SHA384encrypt(arguments[0])
            }
            console.log('检测到SHA384加密：');
            console.log("EnData:" + Data)
            return SHA384encrypt(arguments[0])
        }
    }
    //SHA512加密
    if (Crypto.SHA512 != undefined) {
        var SHA512encrypt = Crypto.SHA512
        window.CryptoJS.SHA512 = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return SHA512encrypt(arguments[0])
            }
            console.log('检测到SHA512加密：');
            console.log("EnData:" + Data)
            return SHA512encrypt(arguments[0])
        }
    }
    //RIPEMD160加密
    if (Crypto.RIPEMD160encrypt != undefined) {
        var RIPEMD160encrypt = Crypto.RIPEMD160
        window.CryptoJS.RIPEMD160 = function() {
            var Data = arguments[0]
            if (Data == "" || window.SHook == false) {
                return RIPEMD160encrypt(arguments[0])
            }
            console.log('检测到RIPEMD160加密：');
            console.log("EnData:" + Data)
            return RIPEMD160encrypt(arguments[0])
        }
    }
    //RSA  加解密
    if (window.biToHex != undefined) {
        var ToHex = window.biToHex
        if (window.encryptedString != undefined) {
            var RsaEncrypt = window.encryptedString
            window.encryptedString = function() {
                var KeyPair = arguments[0];
                var Data = arguments[1]
                if (Data == "" || window.SHook == false) {
                    return RsaEncrypt(KeyPair, Data)
                }
                console.log('检测到RSA加密：');
                var PublicKey = ToHex(KeyPair.e).substr(2)
                //取右边6位就是公钥了
                var Modulus = "00" + ToHex(KeyPair.m);
                //前面补俩个0
                console.log("PublicKey:" + PublicKey);
                console.log("Modulus:" + Modulus);
                console.log("Data:" + Data);
                return RsaEncrypt(KeyPair, Data)
            }
        }
        if (window.decryptedString != undefined) {
            var RsaDecrypt = window.decryptedString
            window.decryptedString = function() {
                var KeyPair = arguments[0];
                var Data = arguments[1]
                if (Data == "" || window.SHook == false) {
                    return RsaEncrypt(KeyPair, Data)
                }
                console.log('检测到RSA加密：');
                var PublicKey = ToHex(KeyPair.e).substr(2)
                //取右边6位就是公钥了
                var Modulus = "00" + ToHex(KeyPair.m);
                //前面补俩个0
                console.log("PublicKey:" + PublicKey);
                console.log("Modulus:" + Modulus);
                console.log("Data:" + Data);
                return RsaDecrypt(KeyPair, Data)
            }
        }
    }
    if (window.JSEncrypt.prototype != undefined) {
        RSA = window.JSEncrypt.prototype
        if (RSA.encrypt != undefined) {
            RSA_encrypt = RSA.encrypt
            window.JSEncrypt.prototype.encrypt = function() {
                var Data = arguments[1]
                if (Data == "" || window.SHook == false) {
                    return RSA_encrypt(Data)
                }
                console.log('检测到RSA加密：');
                console.log('EnData：' + Data);
                return RSA_encrypt(Data)
            }
        }
        if (RSA.setPublicKey != undefined) {
            RSA_setPublicKey = RSA.setPublicKey
            window.JSEncrypt.prototype.setPublicKey = function() {
                var Data = arguments[1]
                if (Data == "" || window.SHook == false) {
                    return RSA_setPublicKey(Data)
                }
                console.log('检测到RSA设置公钥：');
                console.log('PublicKey：' + Data);
                return RSA_setPublicKey(Data)
            }
        }
        if (RSA.setPrivateKey != undefined) {
            RSA_setPrivateKey = RSA.setPrivateKey
            window.JSEncrypt.prototype.setPrivateKey = function() {
                var Data = arguments[1]
                if (Data == "" || window.SHook == false) {
                    return RSA_setPrivateKey(Data)
                }
                console.log('检测到RSA设置私钥：');
                console.log('PrivateKey：' + Data);
                return RSA_setPrivateKey(Data)
            }
        }

    }
}
)();
