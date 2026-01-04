// ==UserScript==
// @name Sleek Roblox Theme
// @namespace https://greasyfork.org/en/users/1201555-uathan
// @version 0.0.9
// @description Roblox Theme for BTRoblox
// @author uathan
// @license GPLv3/
// @grant GM_addStyle
// @run-at document-start
// @match http://roblox.com/*
// @match https://roblox.com/*
// @match http://*.roblox.com/*
// @match https://*.roblox.com/*
// @match https://*.roblox.com/home*
// @match        *://*.roblox.com/*
// @icon         data:image/x-icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAMMOAADDDgAAAAAAAAAAAABxfX3/aHV1/2Jvb/9damz/UV9h/05bXv9XYWT/WGJl/1lkZ/9VYGP/TVda/0dRVf9CTFH/PEZL/zU/RP8uOD7/JS40/x4nK/8ZIST/GB0h/xkgI/8dJin/JS8y/y44O/83QUT/RE9S/0hTVP9IVFT/TFdY/1hgYf9aY2T/R1BQ/297e/9mc3P/Xmtr/1llZ/9XZWj/XGhr/2Bqbf9cZmn/T1pd/0ROUf8+SUz/Q0xQ/0JLUP8+SU7/N0RJ/zI9Qv8uNjz/KDA1/x8nKv8aICP/HiUo/ycvMv8rNjj/MTw//zdBRP9ASk3/SlRU/0pWVv9MV1j/U11e/1tjZP9ZYmP/a3h5/2Jycf9dbG3/VWJj/1pnaP9odXb/ZnBx/1hjZP9JVFT/Qk1O/0NOTv9GUFP/RlBU/z5IS/86RUn/Nj5D/zI3P/8uMzr/Iysw/x4lKv8nLjT/KzM2/yw1N/8xOjv/N0BB/z1ERv9DSkv/RE5P/0tUVf9RXFz/V2Fi/19pav9oeHj/YXJx/1trav9gbW3/aHZ2/216ev9lcHH/WmVl/1BcXP9PWlv/Ul1e/1ZhY/9TX2H/SFNW/0JLT/9AR03/O0BJ/y0yOv8ZICj/Fx4n/ykwOP8xOT7/MTo8/zM8Pf83QEH/P0ZH/z9GR/9BSUr/SlNT/1BbW/9VYGH/YWxt/11tbf9YaGj/Wmlp/2Z0dP9zf3//cn19/2dzc/9cZ2j/VWFh/1VgYP9XYmL/W2Zn/11oaP9UX2H/T1hc/01TWv88Qkr/Iioz/xIaJf8TGib/Iys0/zhCSP9ASk3/QEtN/0JMTf9HUFH/SlNU/0hSU/9MV1j/UFtb/1ZhYv9hbW3/V2Rk/1xra/9camr/ZXBx/3WAgf92gYL/bXh5/2dzc/9mcnL/Y25v/2Rvb/9lcHH/ZXFx/11nav9WX2X/TFRd/y83Qv8dJjL/FyAt/xYfLP8bJDD/Mz1G/0xXXP9PWl3/TFZY/05WWf9QWFz/UVpd/1ReYP9YYmX/Ym1v/2hzdf9YZmb/Xmxs/1lnZ/9famr/c39//36Kiv96hYb/cn1+/3J+fv9yfX7/d4OD/3iDhP9zfoD/ZnBz/1NbY/81Pkr/HSYz/yozQv8nMD//Iis6/x0mNf8nMT7/TVhh/1xmbP9YYmX/Vl9i/1liZv9ZYmb/VWFj/1hjZv9lcHP/Z3J1/15qa/9NWVr/PkpK/0hTVP9pdHX/d4KC/3iDhP90f4D/cX19/297e/93g4P/e4aH/3B6fv9YYWj/QElU/yYvPf8jLDz/LzhJ/ygzQ/8mMEL/JC4//xwnNv8/Slb/YW1z/2ZxdP9sdnn/b3l8/2l0d/9gbW//X2ls/2lzdv9ibXD/SlNU/y43OP8lLi//OkNE/2Bpaf9wenr/dICA/3iDhP93goP/doKC/3eCg/90f4H/ZHB0/2Nudv9PWWT/PklX/zhCU/80PE//LzhK/y04SP8vOUr/LTdI/zZCT/9danD/c4CC/3WBg/9ven3/a3d6/2x5e/90f4H/aHJ1/1ljZv84QUH/LDQ1/yoyM/8tNjf/NT4//09ZWf9qdXX/e4aG/3+Ki/9+iov/eoeH/3eEiP91gIf/doGK/2Rvev9NV2X/RE5f/0NNX/9CTV//P0pa/z1IWP8/Sln/RlJf/11qcP9vfH7/dYKE/3J/gv9wfX//cn+B/296ff9faWz/WGJl/zpCQ/80Pj7/MDk5/ygxMv8jLC3/Mjs8/1NeXv9yfX7/f4uM/4ORkf+BkJD/f4yQ/32Ikf97ho//c32I/2Ntev9cZ3X/WmZ1/1dlc/9TYG//UF5s/1Nibv9jcHz/b3uB/3F+gP91goT/eIWI/3iEh/9yf4H/aHN2/1tmaP9ZY2b/O0JE/y82N/8jKiv/HiUm/x4lJv8mLS7/QElK/15oaf96hof/hJGR/4OTk/+DkZT/hY+W/4KLk/98ho7/dYCJ/255g/9odYH/ZXR//2Rzf/9pd4P/bn2H/3WEjP93hIn/eYaJ/3+Mjv99io3/dIGD/2l2eP9faWz/WmRn/11nav86QUL/Mzo7/zA3OP8mLC7/HyUn/yUsLf87Q0T/UVpa/2x3d/+Dj4//hpSU/4aTlP+Ikpb/iJGW/4aQlv+Ai5P/doCJ/297hf9vfYf/coGJ/3iHj/97ipL/fo2U/4GOk/+FkpX/hJGU/3yJjP9wfH//Z3R2/2Frbv9ibG//ZXBy/zpAQv85P0D/Mzk6/yYsLv8gJyj/HiUm/ycsLf80OTv/SVFS/2VwcP92g4P/hZGS/4yXmv+LlZr/ipSa/4SPl/98h5D/doOM/3iFjv99i5L/f42T/4GPlP+CkZX/h5WX/4iUl/+Cj5H/d4OG/297fv9pdXj/Z3J1/2hydf9ocnX/PkRG/zc9Pv8wNDb/JCkr/yMqK/8lLCz/ICYl/xkfHv8cIiH/KDAv/y03Nv9WYGH/jZmb/4yYnP+JlZv/hpKZ/4KQl/+CkJf/g5CY/4eTmf+IlJn/iZaZ/4SRk/9/jo//fo2P/3+Mj/97hon/dYGD/298f/9rdnj/ZG9x/1tmaP9RV1f/O0FC/zY7PP8uMzX/Mzo7/x0kJf8SFxf/BQkK/wkMDf8cISH/FBoa/yQuL/93g4b/kJ2g/4qWnP+Ik5r/iJac/4mYnv+Ilpz/h5OY/4mUl/9qdHb/SldY/0BLTf9IU1b/W2dq/2t3ev9rd3n/ZHBy/1diZP9MV1n/SlVX/3p9ff87QD//NDs6/zE4Ov8oMDH/KjAy/xkdH/8HCQv/CgwO/xQXGf8UGRv/JzAy/215fP+JlZr/h5KZ/4SPlv+Cj5b/gY+W/4ORmP+Hk5j/d4KG/yYwM/8MFxj/BAoN/wsRFf8aJCf/M0BD/0NPUv9ETlH/P0tL/zdDQ/9QW1v/yMnH/4iNiv9TWFf/PENC/ywzM/8oLi//KCwu/xIUFv8OEBH/DBAR/xMZGv85QkT/ZXB1/32Ij/99iJD/doOM/3eFjP96iI//gY+W/4GNkv9UXmL/BxAT/wAFBv8AAAL/AgUJ/xEaHf8UICP/Mz9C/yw2Of8uOTn/Mz8//32Jif/a2tX/1NXS/7q+vP+EiYf/VVxc/y82N/8WGh3/DxEU/w0QEv8WGhz/KjAz/0FKT/9fanD/eIOK/3iFjf92goz/d4SL/32KkP99ipH/cX2C/01YXP8JEBP/AAID/wYHC/8VGR3/ISou/xcjJv8oNjj/JjI1/zhERP9ve3r/vMjH/9fW0v/W1dL/1tXU/7e5uf92e3z/T1VX/y81OP8lKy7/LzQ4/zM5PP82PUH/SVFW/2Zwdv90gIf/dYOL/3mGj/98h4//fYmQ/3SCiP9hbHH/R1FV/yAoK/8DBgn/BQcL/xQZHf8VHiH/KTY4/1JhY/98ioz/qbW0/83Z2P/Z5eT/1NPP/9bU0P/W09H/w8TF/4iPkP9cZGb/SlBS/0RLTf9WXl//QElK/zhBQv9VXWH/b3h//3R/hv92gon/d4SL/3eEi/92hIr/bHt//1RfZP88Rkv/MDo//yoyNv8XICP/FB4h/yw2Ov9dZ2z/sL3B/9Tj4//d6ef/2uTm/9ji5f/R0c7/1NLO/9HPzf+rrKz/bXR1/2Zubv98goP/f4WG/3+Ehv9kamr/Ulha/2hwc/98g4r/fYaN/3qFjP93hIv/dIKK/3OBh/9nc3j/U11i/zxFSv8yO0D/S1RZ/ztHS/84RUn/RU9V/3V/hf/N19z/1uPk/9jk4v/Z4uT/1+Dl/8/OzP/Rz8z/zMrI/46Oj/9laWn/naKh/8LExv/Dxcf/tri6/62wsv+gpKb/kJaY/4uTlv+Nlpr/ipOZ/4GMlP99iZH/doKI/2Nuc/9XX2X/SlJX/01UWv9bZGr/SFNa/0RRWP9OWWD/a3Z9/87Z3v/Y5ef/3Ofp/93l6P/W3uH/zcvJ/87Myv++vbv/i4uL/6+wsP/Lzc3/ysvL/8rKyv/Ly8v/ycvK/8rNzP/DyMf/t7y8/6atrv+ep6j/kpqf/4eRlv9zfYH/c3x//3V8f/98gYX/kZea/2Bobf9GUVj/RFJb/1JeaP9ea3T/x9LZ/+Tw9f/m7/X/4Onv/9Td4v/IxcT/yMXE/727uf+wsLD/xsfH/8bFxf/Hxsb/x8bH/8bGxv/Gxsb/xcfH/8bJyP/Jysr/xcjH/8DExP+6vsH/qa+y/52ipf+tsbX/xsrO/8/R1f/M0dT/oKaq/0dQWP86R1D/RlNc/1Jfaf+4w8//3+n0/9nh7f/a4+7/0tvk/8jDxP/Fw8H/w8LA/8HBwf/BwcD/w8PB/8bDxP/Ew8P/xMTE/8PDw//CxMT/xcXF/8bExf/FxMT/xMXF/8HExP/AxMP/wMPE/8HCxv/Q0db/1NXa/8zO0v/M0NT/jZWb/zNAR/9CT1n/Ul5r/6Suv//I0eT/wMjc/8vV5v/Q2+n/wL68/8C+vP+/v7z/v8C9/77Av//AwcH/wsLC/8DAwP/BwcH/wcHB/8HBwf/BwcH/wMDA/8DAwP/AwMD/v7+//76+vv++vr7/v7/A/9HR0//V1Nb/zc7Q/8jMzv/M09j/e4SM/0BKVf9LU2T/oqrB/77I4v+yvtj/vsvh/8/c7f++vbn/vby6/7y8uv+8u7r/u728/7u9vf+9vb3/vb29/729vf++vr7/vr6+/76+vv+9vb3/vr6+/76+vv+8vLz/u7u7/7y8vP++vr7/09LS/9PS0v/Nzc3/ycvM/8/U1//K0tj/f4iS/1Nca/+0vdP/v8rk/7fE3v+9y+H/0N3v/7q4tv+4uLb/uLm2/7i4uP+4urn/t7q5/7m5uf+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7q6uv+5ubn/ubm5/7y8vP/W09T/0dDQ/8vMy//Iy8z/y9DU/9HZ3//FzdX/rLTA/8bP4f/By+D/vMfd/7zJ2//P3Or/tbOz/7W0tP+0tLT/tra2/7e4uP+2uLj/uLi4/7q6uv+5ubn/ubm5/7m5uf+5ubn/ubm5/7m5uf+5ubn/uLi4/7m5uf+4uLj/vLy8/9fU1f/S0ND/y8vL/8rMzP/M0NH/0NXY/9jd4f/e5ez/2+Pu/9vj8P/Y4vD/1uLv/9Pf6f+0srP/s7Ky/7Gysf+1tLX/tbe2/7W3tv+3t7f/uLi4/7e3t/+4uLj/uLi4/7i4uP+4uLj/uLi4/7e3t/+2trb/uLi4/7e2t/+/vb3/1NHS/9HOz//Jx8f/yMnJ/87S0f/O09X/19zf/9zk6f/b5uz/3+fv/93m7//a5e3/1uLp/7Ows/+xr7H/sbGx/7S0tP+1t7X/tLe0/7i3uP+3t7f/tra2/7e3t/+3t7f/t7e3/7e3t/+3t7f/tra2/7S0tP+2trb/t7W2/8K/v//Rz8//z8zN/8jGxv/HyMj/zdLR/83S1P/P1dj/ztjd/83a3v/T3uP/1dzk/9Xd5P/T3+T/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=
// @grant        none
// @downloadURL https://update.greasyfork.org/scripts/477976/Sleek%20Roblox%20Theme.user.js
// @updateURL https://update.greasyfork.org/scripts/477976/Sleek%20Roblox%20Theme.meta.js
// ==/UserScript==

(function() {
    var link = document.querySelector("link[rel*='icon']") || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel = 'shortcut icon';
    link.href = 'icon;base64,AAABAAEAICAAAAEAIACoEAAAFgAAACgAAAAgAAAAQAAAAAEAIAAAAAAAABAAAMMOAADDDgAAAAAAAAAAAABxfX3/aHV1/2Jvb/9damz/UV9h/05bXv9XYWT/WGJl/1lkZ/9VYGP/TVda/0dRVf9CTFH/PEZL/zU/RP8uOD7/JS40/x4nK/8ZIST/GB0h/xkgI/8dJin/JS8y/y44O/83QUT/RE9S/0hTVP9IVFT/TFdY/1hgYf9aY2T/R1BQ/297e/9mc3P/Xmtr/1llZ/9XZWj/XGhr/2Bqbf9cZmn/T1pd/0ROUf8+SUz/Q0xQ/0JLUP8+SU7/N0RJ/zI9Qv8uNjz/KDA1/x8nKv8aICP/HiUo/ycvMv8rNjj/MTw//zdBRP9ASk3/SlRU/0pWVv9MV1j/U11e/1tjZP9ZYmP/a3h5/2Jycf9dbG3/VWJj/1pnaP9odXb/ZnBx/1hjZP9JVFT/Qk1O/0NOTv9GUFP/RlBU/z5IS/86RUn/Nj5D/zI3P/8uMzr/Iysw/x4lKv8nLjT/KzM2/yw1N/8xOjv/N0BB/z1ERv9DSkv/RE5P/0tUVf9RXFz/V2Fi/19pav9oeHj/YXJx/1trav9gbW3/aHZ2/216ev9lcHH/WmVl/1BcXP9PWlv/Ul1e/1ZhY/9TX2H/SFNW/0JLT/9AR03/O0BJ/y0yOv8ZICj/Fx4n/ykwOP8xOT7/MTo8/zM8Pf83QEH/P0ZH/z9GR/9BSUr/SlNT/1BbW/9VYGH/YWxt/11tbf9YaGj/Wmlp/2Z0dP9zf3//cn19/2dzc/9cZ2j/VWFh/1VgYP9XYmL/W2Zn/11oaP9UX2H/T1hc/01TWv88Qkr/Iioz/xIaJf8TGib/Iys0/zhCSP9ASk3/QEtN/0JMTf9HUFH/SlNU/0hSU/9MV1j/UFtb/1ZhYv9hbW3/V2Rk/1xra/9camr/ZXBx/3WAgf92gYL/bXh5/2dzc/9mcnL/Y25v/2Rvb/9lcHH/ZXFx/11nav9WX2X/TFRd/y83Qv8dJjL/FyAt/xYfLP8bJDD/Mz1G/0xXXP9PWl3/TFZY/05WWf9QWFz/UVpd/1ReYP9YYmX/Ym1v/2hzdf9YZmb/Xmxs/1lnZ/9famr/c39//36Kiv96hYb/cn1+/3J+fv9yfX7/d4OD/3iDhP9zfoD/ZnBz/1NbY/81Pkr/HSYz/yozQv8nMD//Iis6/x0mNf8nMT7/TVhh/1xmbP9YYmX/Vl9i/1liZv9ZYmb/VWFj/1hjZv9lcHP/Z3J1/15qa/9NWVr/PkpK/0hTVP9pdHX/d4KC/3iDhP90f4D/cX19/297e/93g4P/e4aH/3B6fv9YYWj/QElU/yYvPf8jLDz/LzhJ/ygzQ/8mMEL/JC4//xwnNv8/Slb/YW1z/2ZxdP9sdnn/b3l8/2l0d/9gbW//X2ls/2lzdv9ibXD/SlNU/y43OP8lLi//OkNE/2Bpaf9wenr/dICA/3iDhP93goP/doKC/3eCg/90f4H/ZHB0/2Nudv9PWWT/PklX/zhCU/80PE//LzhK/y04SP8vOUr/LTdI/zZCT/9danD/c4CC/3WBg/9ven3/a3d6/2x5e/90f4H/aHJ1/1ljZv84QUH/LDQ1/yoyM/8tNjf/NT4//09ZWf9qdXX/e4aG/3+Ki/9+iov/eoeH/3eEiP91gIf/doGK/2Rvev9NV2X/RE5f/0NNX/9CTV//P0pa/z1IWP8/Sln/RlJf/11qcP9vfH7/dYKE/3J/gv9wfX//cn+B/296ff9faWz/WGJl/zpCQ/80Pj7/MDk5/ygxMv8jLC3/Mjs8/1NeXv9yfX7/f4uM/4ORkf+BkJD/f4yQ/32Ikf97ho//c32I/2Ntev9cZ3X/WmZ1/1dlc/9TYG//UF5s/1Nibv9jcHz/b3uB/3F+gP91goT/eIWI/3iEh/9yf4H/aHN2/1tmaP9ZY2b/O0JE/y82N/8jKiv/HiUm/x4lJv8mLS7/QElK/15oaf96hof/hJGR/4OTk/+DkZT/hY+W/4KLk/98ho7/dYCJ/255g/9odYH/ZXR//2Rzf/9pd4P/bn2H/3WEjP93hIn/eYaJ/3+Mjv99io3/dIGD/2l2eP9faWz/WmRn/11nav86QUL/Mzo7/zA3OP8mLC7/HyUn/yUsLf87Q0T/UVpa/2x3d/+Dj4//hpSU/4aTlP+Ikpb/iJGW/4aQlv+Ai5P/doCJ/297hf9vfYf/coGJ/3iHj/97ipL/fo2U/4GOk/+FkpX/hJGU/3yJjP9wfH//Z3R2/2Frbv9ibG//ZXBy/zpAQv85P0D/Mzk6/yYsLv8gJyj/HiUm/ycsLf80OTv/SVFS/2VwcP92g4P/hZGS/4yXmv+LlZr/ipSa/4SPl/98h5D/doOM/3iFjv99i5L/f42T/4GPlP+CkZX/h5WX/4iUl/+Cj5H/d4OG/297fv9pdXj/Z3J1/2hydf9ocnX/PkRG/zc9Pv8wNDb/JCkr/yMqK/8lLCz/ICYl/xkfHv8cIiH/KDAv/y03Nv9WYGH/jZmb/4yYnP+JlZv/hpKZ/4KQl/+CkJf/g5CY/4eTmf+IlJn/iZaZ/4SRk/9/jo//fo2P/3+Mj/97hon/dYGD/298f/9rdnj/ZG9x/1tmaP9RV1f/O0FC/zY7PP8uMzX/Mzo7/x0kJf8SFxf/BQkK/wkMDf8cISH/FBoa/yQuL/93g4b/kJ2g/4qWnP+Ik5r/iJac/4mYnv+Ilpz/h5OY/4mUl/9qdHb/SldY/0BLTf9IU1b/W2dq/2t3ev9rd3n/ZHBy/1diZP9MV1n/SlVX/3p9ff87QD//NDs6/zE4Ov8oMDH/KjAy/xkdH/8HCQv/CgwO/xQXGf8UGRv/JzAy/215fP+JlZr/h5KZ/4SPlv+Cj5b/gY+W/4ORmP+Hk5j/d4KG/yYwM/8MFxj/BAoN/wsRFf8aJCf/M0BD/0NPUv9ETlH/P0tL/zdDQ/9QW1v/yMnH/4iNiv9TWFf/PENC/ywzM/8oLi//KCwu/xIUFv8OEBH/DBAR/xMZGv85QkT/ZXB1/32Ij/99iJD/doOM/3eFjP96iI//gY+W/4GNkv9UXmL/BxAT/wAFBv8AAAL/AgUJ/xEaHf8UICP/Mz9C/yw2Of8uOTn/Mz8//32Jif/a2tX/1NXS/7q+vP+EiYf/VVxc/y82N/8WGh3/DxEU/w0QEv8WGhz/KjAz/0FKT/9fanD/eIOK/3iFjf92goz/d4SL/32KkP99ipH/cX2C/01YXP8JEBP/AAID/wYHC/8VGR3/ISou/xcjJv8oNjj/JjI1/zhERP9ve3r/vMjH/9fW0v/W1dL/1tXU/7e5uf92e3z/T1VX/y81OP8lKy7/LzQ4/zM5PP82PUH/SVFW/2Zwdv90gIf/dYOL/3mGj/98h4//fYmQ/3SCiP9hbHH/R1FV/yAoK/8DBgn/BQcL/xQZHf8VHiH/KTY4/1JhY/98ioz/qbW0/83Z2P/Z5eT/1NPP/9bU0P/W09H/w8TF/4iPkP9cZGb/SlBS/0RLTf9WXl//QElK/zhBQv9VXWH/b3h//3R/hv92gon/d4SL/3eEi/92hIr/bHt//1RfZP88Rkv/MDo//yoyNv8XICP/FB4h/yw2Ov9dZ2z/sL3B/9Tj4//d6ef/2uTm/9ji5f/R0c7/1NLO/9HPzf+rrKz/bXR1/2Zubv98goP/f4WG/3+Ehv9kamr/Ulha/2hwc/98g4r/fYaN/3qFjP93hIv/dIKK/3OBh/9nc3j/U11i/zxFSv8yO0D/S1RZ/ztHS/84RUn/RU9V/3V/hf/N19z/1uPk/9jk4v/Z4uT/1+Dl/8/OzP/Rz8z/zMrI/46Oj/9laWn/naKh/8LExv/Dxcf/tri6/62wsv+gpKb/kJaY/4uTlv+Nlpr/ipOZ/4GMlP99iZH/doKI/2Nuc/9XX2X/SlJX/01UWv9bZGr/SFNa/0RRWP9OWWD/a3Z9/87Z3v/Y5ef/3Ofp/93l6P/W3uH/zcvJ/87Myv++vbv/i4uL/6+wsP/Lzc3/ysvL/8rKyv/Ly8v/ycvK/8rNzP/DyMf/t7y8/6atrv+ep6j/kpqf/4eRlv9zfYH/c3x//3V8f/98gYX/kZea/2Bobf9GUVj/RFJb/1JeaP9ea3T/x9LZ/+Tw9f/m7/X/4Onv/9Td4v/IxcT/yMXE/727uf+wsLD/xsfH/8bFxf/Hxsb/x8bH/8bGxv/Gxsb/xcfH/8bJyP/Jysr/xcjH/8DExP+6vsH/qa+y/52ipf+tsbX/xsrO/8/R1f/M0dT/oKaq/0dQWP86R1D/RlNc/1Jfaf+4w8//3+n0/9nh7f/a4+7/0tvk/8jDxP/Fw8H/w8LA/8HBwf/BwcD/w8PB/8bDxP/Ew8P/xMTE/8PDw//CxMT/xcXF/8bExf/FxMT/xMXF/8HExP/AxMP/wMPE/8HCxv/Q0db/1NXa/8zO0v/M0NT/jZWb/zNAR/9CT1n/Ul5r/6Suv//I0eT/wMjc/8vV5v/Q2+n/wL68/8C+vP+/v7z/v8C9/77Av//AwcH/wsLC/8DAwP/BwcH/wcHB/8HBwf/BwcH/wMDA/8DAwP/AwMD/v7+//76+vv++vr7/v7/A/9HR0//V1Nb/zc7Q/8jMzv/M09j/e4SM/0BKVf9LU2T/oqrB/77I4v+yvtj/vsvh/8/c7f++vbn/vby6/7y8uv+8u7r/u728/7u9vf+9vb3/vb29/729vf++vr7/vr6+/76+vv+9vb3/vr6+/76+vv+8vLz/u7u7/7y8vP++vr7/09LS/9PS0v/Nzc3/ycvM/8/U1//K0tj/f4iS/1Nca/+0vdP/v8rk/7fE3v+9y+H/0N3v/7q4tv+4uLb/uLm2/7i4uP+4urn/t7q5/7m5uf+7u7v/u7u7/7u7u/+7u7v/u7u7/7u7u/+7u7v/u7u7/7q6uv+5ubn/ubm5/7y8vP/W09T/0dDQ/8vMy//Iy8z/y9DU/9HZ3//FzdX/rLTA/8bP4f/By+D/vMfd/7zJ2//P3Or/tbOz/7W0tP+0tLT/tra2/7e4uP+2uLj/uLi4/7q6uv+5ubn/ubm5/7m5uf+5ubn/ubm5/7m5uf+5ubn/uLi4/7m5uf+4uLj/vLy8/9fU1f/S0ND/y8vL/8rMzP/M0NH/0NXY/9jd4f/e5ez/2+Pu/9vj8P/Y4vD/1uLv/9Pf6f+0srP/s7Ky/7Gysf+1tLX/tbe2/7W3tv+3t7f/uLi4/7e3t/+4uLj/uLi4/7i4uP+4uLj/uLi4/7e3t/+2trb/uLi4/7e2t/+/vb3/1NHS/9HOz//Jx8f/yMnJ/87S0f/O09X/19zf/9zk6f/b5uz/3+fv/93m7//a5e3/1uLp/7Ows/+xr7H/sbGx/7S0tP+1t7X/tLe0/7i3uP+3t7f/tra2/7e3t/+3t7f/t7e3/7e3t/+3t7f/tra2/7S0tP+2trb/t7W2/8K/v//Rz8//z8zN/8jGxv/HyMj/zdLR/83S1P/P1dj/ztjd/83a3v/T3uP/1dzk/9Xd5P/T3+T/AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA=';
    document.getElementsByTagName('head')[0].appendChild(link);
})();

/*
Make your BTR Settings page exactly like these images: https://imgur.com/a/sKsxrHs
*/

(function() {
let css = `
.dark-theme .profile-avatar-right {
background-color: #393b3d00;
}
.dark-theme.btr-profile .profile-avatar-right {
box-shadow: 0 0 0 0;
}
.btr-profile .profile-avatar-right.visible {
position: relative;
transition: opacity 1s;
}

.dark-theme .dropdown-menu {
background-color: #34383999;
}
.container-header .header-content {
display: none;
}
.dark-theme .menu-vertical .menu-option .menu-secondary {
background-color: #34383999;
backdrop-filter: blur(3px);
}
.dark-theme .menu-vertical {
background-color: #393b3d00;
}
.ng-scope .dropdown-menu {
top: -45px;
left: 110%;
}
.people-info-card-container .interaction-container {
top: 100%;
left: 0;
}
.gotham-font .text, .gotham-font body, .gotham-font button, .gotham-font html, .gotham-font input, .gotham-font pre, .gotham-font select, .gotham-font textarea {
font-family: sans-serif;
}
.dark-theme .section-content.remove-panel {
background-color: #ffffff05;
}
.btr-gamedetails .server-list-section:not(#rbx-private-running-games) .card-list .card-item {
backdrop-filter: blur(3px);
background-color: #ffffff05;
box-shadow: 0 0 8px 0 #191919;

}
div[role=dialog]:not(:first-of-type) .modal {
    backdrop-filter: blur(5px);
}
.dark-theme .horizontal-scroller .scroller .spacer {
    background-color: #23252700;
}
.gotham-font, .gotham-font .h1, .gotham-font .h2, .gotham-font .h3, .gotham-font .h4, .gotham-font .h5, .gotham-font .h6, .gotham-font h1, .gotham-font h2, .gotham-font h3, .gotham-font h4, .gotham-font h5, .gotham-font h6 {
font-family: sans-serif;
}
.alert-system-feedback .alert {
top: -80px;
}
.catalog-container .catalog-results .buy-robux {
display: none;
}
.profile-about .profile-social-networks .profile-social {
border-radius: 12px;
}
.dark-theme.btr-profile .btr-games-list .btr-game-desc .btr-toggle-description {
background-color: #393b3d00;
}
.dark-theme .catalog-container .sticky .search-bars {
    margin-top: -15px;
    padding: 10px;
    background-color: #34383999;
    backdrop-filter: blur(3px);
}
.dark-theme .catalog-container .sticky .topic-container {
display:none;
}
.dark-theme .table {
background-color: #414b4d00;
}
body.btr-no-hamburger .container-main, body.btr-no-hamburger .nav-container .nav-content {
background-image: url(https://community.cloudflare.steamstatic.com/public/images/profile/2020/bg_dots.png); /* https://community.cloudflare.steamstatic.com/public/images/profile/2020/bg_dots.png */
background-repeat: no-repeat;
background-color: black;
}
.dark-theme .rbx-tabs-horizontal .rbx-tab .rbx-tab-heading:hover {
background-color: #e3e3e300;
}
.dark-theme .rbx-tabs-horizontal .rbx-tab .rbx-tab-heading.active {
background-color: #e3e3e300;
}
.dark-theme .rbx-left-col {
backdrop-filter: blur(3px);
    box-shadow: 0 0 8px 0 #191919;
    background-color: #34383999;
}
.dark-theme .container-footer {
background-color: #000000;
}

.dark-theme .rbx-tabs-vertical .category-tabs .menu-vertical {
background-color: #e3e3e300;
}
.btr-profile .btr-games-list .btr-game-button .btr-game-title {
padding: 5px;
border-left: 2px solid #393b3d;
}
.profile-header-top .header-caption .header-names .header-title h1.profile-name {
cursor: default;
}

.dark-theme .open .dropdown-menu {
background-color: #34383999;
    backdrop-filter: blur(3px);
}
.profile-avatar-left .enable-three-dee {
color: white;
background-color: #fff0;
}
.profile-avatar-left .enable-three-dee:hover, .profile-avatar-left .enable-three-dee:focus {
background-color: #fff0;
}
.avatar-back {
background-image: url();
}
.btr-profile .profile-avatar-right {
box-shadow: 0 0 0 0;
}
.dark-theme .profile-avatar-right .profile-avatar-mask {
background-color: #34383900;
}
.tab-horizontal-submenu {
    box-shadow: 0 0 0 0;
    border: 0;
}
.dark-theme .rbx-tabs-horizontal .nav-tabs {
background-color: #e3e3e300;
}
.dark-theme .rbx-tabs-horizontal .rbx-tab.active .rbx-tab-heading {
background-color: #e3e3e300;
}
.dark-theme .rbx-tabs-horizontal #horizontal-tabs .rbx-tab:not(.active) a:not(:hover) {
background-color: #e3e3e300;
}
.dark-theme .btn-generic-grid-xs {
background-color: #afafaf00;
    border: 0;
}
.dark-theme .btn-generic-slideshow-xs {
background-color: #afafaf00;
    border: 0;
}
.dark-theme .rbx-header {
background-color: #34383999;
box-shadow: 0 0 8px 0 #191919;
backdrop-filter: blur(3px);
}
.rbx-header .rbx-navbar-right .popover-content {
box-shadow: 0 0 8px 0 #191919;
background-color: #34383999;
border-radius: 4px;
}
.popover.bottom.people-info-card-container {
    backdrop-filter: blur(3px);
    box-shadow: 0 0 8px 0 #191919;
    background-color: #34383999;
}
.dark-theme .popover {
background-color: #afafaf00;
box-shadow: 0 0 0 0;
}
.dark-theme .game-cards .game-card, .light-theme .game-cards .game-card {
    background-color: #afafaf00;
}
.btr-profile .btr-games-list .btr-game-button:hover {
    box-shadow: 0 0 0 0 #000000;
}
.dark-theme.btr-profile .btr-games-list .btr-game-button {
background-color: #2d4f9300;
border: 0px;
border-radius: 10px;
}
.dark-theme .section-content {
backdrop-filter: blur(3px);
    background-color: #ffffff05;
    box-shadow: 0 0 8px 0 #191919;

}
.avatar-editor-header a, .avatar-editor-header div {
display: none;
}
.dark-theme {
background-color: #000000;
}
.dark-theme .content {
background-color: #414b4d00;
}
.btr-hover-preview-camera-rotate {
cursor: default;
}
.catalog-container .search-bars .input-group .buy-robux {
display: none;
cursor: default;
}
.breadcrumb-container li .breadcrumb-link {
cursor: default;
}
.search-options .filter-label {
cursor: default;
}
.dropdown-menu li a, .dropdown-menu li button {
cursor: default;
background-color: #34383900;
}
.input-group-btn .input-dropdown-btn:hover {
cursor: default;
}
.input-group-btn .input-dropdown-btn {
cursor: default;
}
h2 {
cursor: default;
}
input {
cursor: default;
}
.radio input[type=radio]+label {
cursor: default;
}
button, html input[type=button], input[type=reset], input[type=submit] {
cursor: default;
}
.dark-theme .topic-container .topic-carousel .topic, .light-theme .topic-container .topic-carousel .topic {
cursor: default;
}
#buy-robux-popover-menu {
    display: none;
}
.popover.bottom>.arrow {
display: none;
}
.left-wrapper, .left-wrapper-placeholder {
float: inline-end;
}
#nav-shop {
    display: none;
}
a:-webkit-any-link {
cursor: default;
}
.tab-horizontal-submenu.six-column {
background-color: #34383999;
width: 800px;

}
`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();

/*
(function() {
let css = ``;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  let styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
*/

function testing() {
        var robux = document.getElementById("nav-robux-icon");
        if (robux) {
            robux.addEventListener("click", function() {
            window.location.href = "https://www.roblox.com/upgrades/robux";
        });
    }
        setTimeout(testing, 100);
    }
testing();


function AddRolimonsButton() {
  const fullPath = window.location.pathname;
  const pathParts = fullPath.split('/');
  const secondLevel = pathParts[2];
  const profileDisplayName = document.querySelector('.profile-display-name');
  if (profileDisplayName) {
    const link = document.createElement('a');
    link.href = 'https://www.rolimons.com/player/' + secondLevel;
    link.textContent = profileDisplayName.textContent;
    profileDisplayName.textContent = '';
    profileDisplayName.appendChild(link);
  }
setTimeout(AddRolimonsButton, 100);
}
AddRolimonsButton();
