// ==UserScript==
// @name Discord 2009 youtube player
// @namespace legosavant
// @version 1.0.1
// @description 2009 youtube player but its on discords built in video player (not youtube embed).
// @grant GM_addStyle
// @run-at document-start
// @match *://*.discord.com/*
// @downloadURL https://update.greasyfork.org/scripts/430165/Discord%202009%20youtube%20player.user.js
// @updateURL https://update.greasyfork.org/scripts/430165/Discord%202009%20youtube%20player.meta.js
// ==/UserScript==

(function() {
let css = `
    /*discord with 2007 youtube player*/
/*bar*/
[class^="mediaBarProgress"] {
    border-top:1px solid #A63333;
    border-bottom:1px solid #B23F3F;
    background:linear-gradient(#FFFFFF 0%,#FFC4C4 16.6%, #FF7070 33.3%, #FF3333 50%)!important;
}
.wrapper-1FP9YQ, [class^="fakeEdges"]:before {
    border-radius:0!important
}
[class^="mediaBarProgress"]:after, [class^="mediaBarProgress"]:before, [class^="buffer"], [class^="buffer"]:after, [class^="buffer"]:before, [class^="mediaBarPreview"], [class^="mediaBarPreview"]:after, [class^="mediaBarPreview"]:before {
    content:none
}
[class^="mediaBarInteraction"]:hover [class^="mediaBarGrabber"], [class^="mediaBarGrabber"], [class^="mediaBarProgress"], [class^="mediaBarProgress"]:after, [class^="mediaBarProgress"]:before, [class^="mediaBarInteractionDragging"] {
    background-color:transparent!important
}
[class^="buffer"], [class^="buffer"]:after, [class^="buffer"]:before, [class^="mediaBarPreview"], [class^="mediaBarPreview"]:after, [class^="mediaBarPreview"]:before {
    border-bottom:1px solid #DEDEDE;
    border-top:1px solid #595959;
    background:linear-gradient(#333 0%,#333 40%, #474747 50%, #5A5A5A 70.6%, #6C6C6C 80%);
    opacity:1;
    width:100%!important
}

[class^="videoControls"] div[class^="horizontal"] [class^="mediaBarGrabber"] {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAYAAADUryzEAAAABHNCSVQICAgIfAhkiAAAAlhJREFUOI11ks1K61AUhb/UnyYREgkOOrBEo9Zpg4hjBxZ8E9/Id1DBBxB8gYJtB1IUlRorkmqTlp6GFBv3HRntVdfscPb69lqw4ZuCIBCllPwlpZQEQSD8piiK/jT+ryiKcogG0Ol0pFQqAZAkCZeXl9ze3s4s2NraYn9/H9M0ERF6vR7r6+uadn19LaVSCREhjmOOj49J0xQAkdm0uq5zdHTE8vIyAK+vrxTo9xmNRvT7fU5PT/PBNE0Jw5AwDJlMJui6DsDZ2Rn9fh+lFFmvR0EcB6UUV1dXjMdjDMMgDEPa7TaWZWFZFu12mzAMMQyD8XhMo9FAKYU4DvNKKQC63S66rjMcDonjmFqtlkd3XZd6vc5kMsG2bZ6fn3FdF+ALoGkahmHQarUwTZPHx8eZ/qZp0ul02NvbA+DTlwM+O2ZZRhRFxHE8A5hOpziOg2EYPwEikgM2NjYIguDXW9nd3c3nPn05oFgsUiwW8X2fwWBAo9GYMfu+T7VaRURI0/QL8D4ckhYKJElCuVxmbm6Ow8NDPM+jXq/nmyuVSl7x5eWFLMvQRdDOz8+l2WwCYBgGnuextLT0awWlFPf39yRJgoiws7PDvGVZ2LZNt9tlNBoRRRGVSoXV1VUWFhYAeH9/5+npiZubG6bTKSJCuVzGtm20i4sL++PjY3B3d0er1QJ+nvD3t4jg+z7b29tkWVabPzg4GIpIAfhYXFyk2WwSRdGvZsdxqFaruK7L5uamsba2NtE+P09OTuZs256KCA8PD7y9vc2kWFlZwfM8NE2jVqsVADRNk39TpZFQG110BQAAAABJRU5ErkJggg==");
    width:16px;
    height:17px;
    margin-top:-8px;
    transform:scale(1)!important
}
[class^="mediaBarGrabber"] {
    cursor:pointer
}
[class^="videoControls"] div[class^="horizontal"] [class^="mediaBarWrapper"]:active [class^="mediaBarGrabber"] {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAARCAYAAADUryzEAAAABHNCSVQICAgIfAhkiAAAApFJREFUOI11k81OGlEYhp+BsZyxFgJihBR/aTQYDcQaL4DEhbJz4y14La4bbsAtiSsTu3GjK0yNE2KNqZowjhqkDMqciBKH00ULllaf7cnz5nu/cw78hWVZSkqp3kJKqSzLUryG4zhviv/iOE43RAMol8sqFosB8PDwwO7uLqenp91wpRRTU1Nks1n6+/tRSlGpVJiYmNC04+NjFY/HUUpRr9fJ5/M0m81XpxRCsL6+TjgcBuD29hZdcxzcgQGenp4oFAoAvNc0AtUqqJe6j0NDtIFCocDq6iqBQIB2tYquIhGklJRKJaSUCCEI7+0RPDhgMJ0GoGaaNBYWcJaWkFJyeHjI7OwsRCLoUkoALi8vMQwD/eaGOV3ncz5PNJkE4Of5Od82Nzm8u+M5Hse2bcbHxwFeAjodRbHI3MgI0ZMTODkBIArMxWL8KBZprq0B0PG6AYZhAOC/u4NGAyyrd4Oui95uI4ToCfBJKXFdF8MwEELgn5mhVKn8dwOlSgV/KoVhGBiGQcfTpZQopRBCoOs6KpfDvrri69kZc8PDXdlOJhG5HJoQtFotOp72ZWNDPfp8+Hw+EokEfr8fpRStYpHm9vbverkc7xYXAfA8D8uy8DwP0W6jbW1tKdM0ARgcHGR0dBRd13teYYfn52fK5TLVahWA+fl59GAwSCgUwrZtXNelVquRTqcJBoM9O7i/v8c0TRqNBkopEokEoVAI3fO8j6lU6ioQCGCaJlJKrq+viUQi9PX1AdBqtXAcpztRJpNhenqabDbr0wD29/c/uK7bsG2bo6Mj6vX6qxXC4TCZTIaxsTHH87zF5eXlC61zuLOz80kp9V3TtL6LiwtqtVqPHI1GmZyc5M+PNlZWVp4AfgGzf5FSBFNxogAAAABJRU5ErkJggg==");
}
/*main thing*/
[class^="audioControls"], [class^="videoControls"] {
    background:linear-gradient(#E4E4E4,#C5C5C5,#8A8A8A)
}
/*time*/
[class^="durationTimeWrapper"] {
    background:linear-gradient(#4E4E4E,#000);
    padding:4px 4px 2px 4px;
    border-radius:3px;
    cursor:text
}
[class^="durationTimeDisplay"], [class^="durationTimeSeparator"] {
    font-family: "ＭＳ Ｐゴシック";
    font-size:11px;
    color:#ccc
}
[class^="durationTimeDisplay"]:last-child {
    color:#FF3232
}
/*order*/
[class^="videoControls"] div:first-child {
    order:0
}
[class^="videoControls"] div[class^="horizontal"] {
    order:1
}
[class^="videoControls"] div[class^="durationTimeWrapper"] {
    order:2
}
[class^="videoControls"] div[class^="flex"] {
    order:3
}
[class^="videoControls"] div:last-child {
    order:4
}
[class^="controlIcon"] {
    opacity:1
}
/*play*/
[class^="videoControls"] div[aria-label^="P"]:first-child {
    padding-left:4px
}
[class^="videoControls"] div[aria-label^="P"]:first-child polygon, [class^="videoControls"] div[aria-label^="P"]:first-child path {
    display:none
}
[class^="videoControls"] div[aria-label="Play"]:first-child svg, [class^="videoControls"] div[aria-label="Play again"]:first-child svg {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAZCAYAAADJ9/UkAAAABHNCSVQICAgIfAhkiAAAAo5JREFUSIm9lj1L62AUgJ80BgttrIiCd1PxW1AHNxcXUQQHP5aCXItDxEnBX+FkN39IF3UUO/gLRBCLiKi3thFs0iQ2OXexonJ7G636THnhnPNwzuF9CQAismuappTLZXFdV76DcrkslmXJzc2NiMguz+K0bduFbzHW4Pr6uiAiv5VCoSBtbW38JL7vc3l5iSIi8qPmZ0zTJBImMJPJcHZ29qXy5ubmcJ1PTEwAkEwmMQwDXdcblluWFa5zgPX1dY6Pj5mfnyeTyTQsB1Acx6nb+eTkJBsbGwDkcjmy2Sy9vb1sbm7S19cXSvT09ISmaS9n27ZpchwnVHKpVAKgo6ODubk5Tk9PSaVSLC4usrq6Sjwer1vD9/2Xb8/zaHJdN5T88fHxzbmnp4fOzk6Ojo44ODjAMAymp6dD1XqRh+38vbzK2NgY+Xyevb09Dg8PWVtbo7u7+2fkANFolOHhYe7u7tje3mZ2dpalpSVisVjNnEql8vGd/49EIoHneezv7zM+Pk5/f3/NWN/3P7/z93iex8PDA7qus7W1xdDQELZt14wXkcbHLiI4joPruiwsLDAzM4OiKJimSb33qyF5EASICIODgxiGQUtLC8Vi8c2VqkUkEgkv/1fB9vZ2VlZWGB0d5f7+nqurq1C1AFRVDb/z91RHbFkW5+fnBEHwoXxN08J3XqU64mg0ysXFBZ7nfSi/ShAE4eXVEY+MjJDL5SgWi5+SviaUfHl5mampKQqFAicnJ1QqlYbFiqKE27mmaWSz2YaFr4nH4zTpuk4+n//SwvVQVZXW1lYUEVF3dnb+lEqlH/mLVFWVrq6uYiqVGlEARCSRTqfvb29vm8I8EJ8lFosxMDBAMpn8pSjK7V/c+BNxKkaVqgAAAABJRU5ErkJggg==");
    background-position:0 4px;
    background-repeat:no-repeat;
}
[class^="videoControls"] div[aria-label="Play"]:first-child svg:hover,[class^="videoControls"] div[aria-label="Play again"]:first-child svg:hover  {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAZCAYAAADJ9/UkAAAABHNCSVQICAgIfAhkiAAAAqFJREFUSIm9lD9MGlEcx7+PO4oGBCQaU9uSShtEa0GDFHZ3F11ciDFOuJgYdXN3Y+7WoWkwDp2aTh1NXDrZNEYtAZoi4c85cMfB3ePXoWJMW3qvon62d/d7v8/7vl/uAABE9FZRFGo0GtRsNukuaDQapKoqFYtFIqLPuBR/qNfr2p0Yu1AoFNpElGbVapV8Ph/uE845crkcGBHRvZovURQFNpHC40wGlaOjW5U7HA6x5K9HRwEAU6uriG5swOHx9CxXVVUsOQBEo1Hk9/bwLh7HcSbTsxwAmK7rlsnfjI0hFosB+DWrfD6PwZkZvNrZgW9yUkhkGAbsdvvVWtM0sIuLC0t5ZmIC4XD4as05R6VSQalUQjCZxIu1NTxwu4UO0UHXdbBSqWQpfz89jVAo9MdzwzBQLBZhSBJebm7CPz8vLG82m2C5XM5S/jGRQCAQ6PpeVVVUq1W4w2GE1tfhDgYt5a1WC7Ku68In7YYsyxgeHkb95AQHySQeLy7i6fIyZJer6x7TNMXlrVbLsqavrw+cc3zf34c3kYBraqprLecc8r8SXceqjnMOXdchDw1hYnsbnkgEmqZ1rSei3pMTEUzTBOcc/mQSjxYW0LLZoCgKrP5fPc2809wTiSC4tQU2OIhyrQbOuWU/m80mLv9bCsfICAKpFDzxOCqVCtRCQagXAEiSJD7z3+lccU3TcHp6ina7/V/77Xa7ePIOnSs2nE58zWaFvoK/0W63xeWdK3bNziKbzaJ2dnYj6XXE5KkUYnNz+FGr4cvhIUzT7FnMGBOceX8/Ph0c9Cy8jsvlgjwwMIByuXyrja2QJAlerxeMiJ7s7u4e1+v1/vsS+/1+WllZec4AgIgeptPpo/Pzc5/ID+KmOJ1OjI+PY2lp6Rlj7NtPrsIQTvfDHeQAAAAASUVORK5CYII=");
}
[class^="videoControls"] div[aria-label="Pause"]:first-child svg {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAZCAYAAADJ9/UkAAAABHNCSVQICAgIfAhkiAAAAXVJREFUSInFljtuwkAYhMcv8ZYQVSpaDgCnoeUUaSioKJGoEH1OwCVocgdEsQVCCxKWMXg9aRAyxmEXEuzp9tfMfjv6CxsAQPJLSskgCBiGId+hIAjo+z6FECT5jQt44fu+/xbiL1qv1zHJT2u73bLVaiFPKaWwWq1gkWSu5IuklLCLAANAqVQqDk4Srs7U6/XuZt1uF7PZ7ClPltwwDLWvHA6HN+fRaIR0Tuc5n8/wPO96Pp1OcI/Hoxa+2+3uZumciUcpdQs3aZ51cTpn4knKuPl+v7+bpXMmnpfgUkrtxSaepKIoKq65Usps51mt0jkTT1Iki2sOoDi4bdtm8CyZ5B55HMcx23mWTHKPPJ7nvda8Wq1qm+s8cRzr4fP5HOVy+WYWRRGWy+VTnixZ0+m0kJ+JSqXy+s7/qnq9DrfRaGCz2eQKdhwHzWYTFgCMx+P4cDhYeYHb7TYHg4F9BU4mEyGE+Eh+c/9btVoNnU4H/X7fAoAfUX7sQHoS3YsAAAAASUVORK5CYII=");
    background-position:0 4px;
    background-repeat:no-repeat;
}
[class^="videoControls"] div[aria-label="Pause"]:first-child svg:hover {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB8AAAAZCAYAAADJ9/UkAAAABHNCSVQICAgIfAhkiAAAAX1JREFUSInFljFuwjAUhn/HiQAlSIgNkFg5QsXGCbqzco4egImFpb0DIwdgZekdEFKpQCiqSmQCcV4XWiWpW5u0JN9m63/+/PyGBABARE++75MQgsIwpFsghKAgCGiz2RARPeMingdB8HYT4w+s1+uYiB7Yfr+nZrOJIpFSYrVagRERFWq+4Ps+rDLEAFCpVMqTExFsXeix0/m21+73cT+bXZVRYYdhqL3lYDBIrReLBbJ1usz5fIbjOF/r0+kE+3g8auWqTHbPJCOlTMtNOlcdnK0zySQpvPNcciGE9mCTTJIoiszkqufL1plkkkgpzWau6ipbZ5JJQkTlzRxAec9uWZaZXEXeF/uEc242cxUmdb9lHMfJ1zl3XW3nukwcx3r53XyOarWa2ouiCMvl8qqMCjadTkv5majVavln/lc8z4Ndr9ex2+0KFXPO0Wg0wABgPB6/HA6HVlHibrdLo9GozQCAiLzJZPK+3W5T39z/xnVd9Ho9DIfDFmPs9QMdsPFNhWMniwAAAABJRU5ErkJggg==");
}
/*sound*/
[class^="videoControls"] div[class^="flex"] svg {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAASCAYAAABWzo5XAAAABHNCSVQICAgIfAhkiAAAARdJREFUOI2tVD2KhjAQfVlsPEHOIIJYeAVtYuEBBDsRPIDgASw8go2FeAFBxEMItna2Nh7B+Ypdxd2su/vt52smmZ83L5kQ4AbEcUx38AAAvb1SXZblfUp2+6uiJEnI87xPnaMokpSwK4I8z6lpGnDOMc8zhmE459JH7WElRXVdk+M41HUdhBDwPO+IhWF4eScMAGzbpnVdD6dlWdA07dhXVbUrkpTsVgGAdV0hhAAAtG0LzjnOxH+Bsi/Ohc+S3E+kqiqmaTqcy7JAURQp2TRNjOP4LZE0/jRNqe/79yBjYIxh27bnx59lGRuGgem6DiLCtm1S9yAIfjqljKIoyHVdcl336v3QF/s/GIZxD9EJr30jO3zfxwPj6XbOgmMYMgAAAABJRU5ErkJggg==");
    background-repeat:no-repeat;
    padding:0;
    width:18px;
    height:18px
}
[class^="videoControls"] div[class^="flex"] svg path, [class^="videoControls"] div[role="button"]:last-child svg path {
    display:none
}
/*sound menu*/
[class^="volumeButtonSlider"] {
    left:-84px
}
[class^="mediaBarWrapperVolume"] {
    background:linear-gradient(#585858,#4C4C4C,#5D5D5D,#6C6C6C,#B1B1B1)
}
[class^="volumeButtonSlider"] [class^="mediaBarProgress"][class^="fakeEdges"] {
    border:none!important
}
.mediaBarInteractionVolume-zGrOSh {
    border-radius:0;
    background:linear-gradient(#E4E4E4,#C5C5C5,#8A8A8A);
    opacity:1
}
[class^="mediaBarInteraction"]:hover [class^="mediaBarWrapper"], [class^="mediaBarInteractionDragging"]:hover [class^="mediaBarWrapper"] {
    box-shadow:none
}
[class^="volumeButtonSlider"] [class^="mediaBarGrabber"] {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAgAAAARCAIAAABvtHqPAAAABHNCSVQICAgIfAhkiAAAAAFzUkdCAK7OHOkAAAAEZ0FNQQAAsY8L/GEFAAAACXBIWXMAAA7DAAAOwwHHb6hkAAAAxElEQVQoU3WQzQqDMBCEkxCl9QFEfCF9W695Ec+5Rbx4UfAX26/uwba2A4HZnczusLqu6yRJoiiK41gpNU3TsizzPKsQwuOCtm0tf/nonKuqCmtRFGVZGrBtGwL2fd+HYYBQ0jQYYdba2wEIJU2zrisLtdb3AxBKmgadCcwRhwwklWmaRgRxnMJPBxFM13V9378LlKw5Hd+jiHEd9RJ4MIKLA/Ih/HWM40gSwGYRLGehAN57ggiyLLN5nvNRTingXGmaPgEEhveyHAw8YgAAAABJRU5ErkJggg==");
    border-radius:0;
    height:17px;
    width:8px;
    transform:scale(1);
    margin-top:-8px
}

/*fullscreen*/
[class^="videoControls"] button[aria-label="Full screen"] svg {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAPCAIAAABvD6g/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAK3SURBVDhPhZPbS2JRFMbPP2lPRVqW5XSRkpJEqUYjiiKjwvJKqZVaWlp0maKbdtWmphBRTIL00QcpEs2Zn57e53vYZ5199rfWt761jzA2NtbV1dXb29vc3KxUKhsbG3/UIZPJOjs7+aTRaMT91tZWNltaWjipUCgGBgYmJyez2aygVqtvb2/L5XKpVPpbx8fHR6VSIfj8/IxEIqQYHBwcHx+nGKvBYBgZGRkeHtZqtWQpFouCXC7nUSgUksnkw8PD8/NzPp9/enrKZDKvr69sdnd363Q6aENDQ0ajcWJiwmw2WyyWmZkZ1FFMaG9vr1arv+uIx+OkoPLl5SVk1BE0NDRAm56enpubgzw7Owt/aWlpcXGRvhAr0Bgpzs/POX1xcXF0dHR9fc3r8fHx/v4+MXbY7fapqSmTyQTTarV6vd7V1dVAIIA7cAXEkOnw8HBrawsOCIfDBwcHOzs7ZGG/qamJ4tR0OBxut9vlcvn9flYOkKKmgsfp6WkoFCJFMBgkPUV8Ph87KysrWKDX6+Gvra15PJ719XWOge3t7Wg0io81FcwPb5lZW1sbmrEGXeRlohjJDllohNS7u7ubm5sU/1UHSuHWVKhUqp91YJhoFd0uLCzQNmopK3L29vYIyHJycnJ1dRWLxdDe39//PRGYNpsN5vz8POvy8jKaKYgptAMIUI4vNzc3jAnXmR0TRPj7+7vAg2kBmLhAzxiBKXAAZRF8dnYmDpj7cn9/T5xOp7k+30PFEqx2Op1opjJuMxRROWTuCLIh393d/akjkUi8vLy8vb1xgyQSSS0FntH/xsaGqBkashkn4HY8Pj5yZdFP8VQqBQ0+EthE4Ojo6NfXl0D/ZJFKpR0dHTSFKOT19PQwEf4onGIFfX194lf+KV4J2KHxmgr6zOVyRIAhi8F/wUnqg0ql8g8RDJWWYq8S2gAAAABJRU5ErkJggg==");
    background-repeat:no-repeat;
    width:25px;
    height:15px;
    padding:0;
    fill:none;
    color:transparent;
}

[class^="videoControls"] button[aria-label="Full screen"]:last-child {
    margin-left:5px
}
[class^="videoControls"] button[aria-label="Full screen"]:last-child svg:hover {
  animation-duration: .8s;
  animation-name: slidein;
}

@keyframes slidein {
  from {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAPCAIAAABvD6g/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAK3SURBVDhPhZPbS2JRFMbPP2lPRVqW5XSRkpJEqUYjiiKjwvJKqZVaWlp0maKbdtWmphBRTIL00QcpEs2Zn57e53vYZ5199rfWt761jzA2NtbV1dXb29vc3KxUKhsbG3/UIZPJOjs7+aTRaMT91tZWNltaWjipUCgGBgYmJyez2aygVqtvb2/L5XKpVPpbx8fHR6VSIfj8/IxEIqQYHBwcHx+nGKvBYBgZGRkeHtZqtWQpFouCXC7nUSgUksnkw8PD8/NzPp9/enrKZDKvr69sdnd363Q6aENDQ0ajcWJiwmw2WyyWmZkZ1FFMaG9vr1arv+uIx+OkoPLl5SVk1BE0NDRAm56enpubgzw7Owt/aWlpcXGRvhAr0Bgpzs/POX1xcXF0dHR9fc3r8fHx/v4+MXbY7fapqSmTyQTTarV6vd7V1dVAIIA7cAXEkOnw8HBrawsOCIfDBwcHOzs7ZGG/qamJ4tR0OBxut9vlcvn9flYOkKKmgsfp6WkoFCJFMBgkPUV8Ph87KysrWKDX6+Gvra15PJ719XWOge3t7Wg0io81FcwPb5lZW1sbmrEGXeRlohjJDllohNS7u7ubm5sU/1UHSuHWVKhUqp91YJhoFd0uLCzQNmopK3L29vYIyHJycnJ1dRWLxdDe39//PRGYNpsN5vz8POvy8jKaKYgptAMIUI4vNzc3jAnXmR0TRPj7+7vAg2kBmLhAzxiBKXAAZRF8dnYmDpj7cn9/T5xOp7k+30PFEqx2Op1opjJuMxRROWTuCLIh393d/akjkUi8vLy8vb1xgyQSSS0FntH/xsaGqBkashkn4HY8Pj5yZdFP8VQqBQ0+EthE4Ojo6NfXl0D/ZJFKpR0dHTSFKOT19PQwEf4onGIFfX194lf+KV4J2KHxmgr6zOVyRIAhi8F/wUnqg0ql8g8RDJWWYq8S2gAAAABJRU5ErkJggg==");
  }

  to {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABYAAAAPCAIAAABvD6g/AAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAHHSURBVDhPfZNNisJQEIQnz2hEg4ggiBDRg4iIF/CIbryF4FoQF26zDBJQUPyLxt/5YoEMTrAW4eVZVV3dbazBYDCfz2+3WxRFlmXl8/nr9fqThsfjkcvlLpfLbrdrNBrZbLbZbPZ6PXs2m/X7/Xa7bds2PPTGGGk+kMlk4jh2HId60CaTyWg04t6mcqfTOZ1Ovu9j7LouPGk+wK/r9bpcLiPBpVqtbjabVqtlgiDgfblcEpIgkAicivP5TBC8qLfdbvE6Ho/P59NUKhXEGgTvSpsKCQ6HA2SqYlQsFlEZjQAGcyKY2KlATxYsNPUwDBEms1NCbvmNOPv9nluA4xuygEabTAQmr8yVILwaImGpRsSQ4D/okWWhp8BqteJQKBRIYNCQh/GwbT0l+FtfZ2QQNG9K8iQIdgbv+/2OPXEYLQ0TOBVK8Z46T+oxyiQYt+gV4ctSqQyZvRBHG4Gf+JKERgBGuOAKSZDgDYJAgwCTp/TcmFqtNp1OWQTdUiqZ8AvwdBCUlAMlaZywi8WCbyTpxfO84XBIY9RhPAyP1eLNTZLtBZ2xYAUU4x8lu263WyqVrPF4zGdXr9dZrQRfgBdJlR8wjiiKfgGQxjZXVOAnEAAAAABJRU5ErkJggg==");
  }
}
/*popup*/

.wrapper-x4po40 {   background:url('data:image/png;base64,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');
border-radius:0;
width:77px;
height:54px
}
.wrapper-x4po40 svg {
display:none
}
.metadata-3IncIG {
    padding:10px 3px;
    height:auto
}
.metadataName-1KMZtB {
    font-size:14px;
    line-height:1
}
.metadataSize-2A2s1T {
    font-size:11px
}






`;
if (typeof GM_addStyle !== "undefined") {
  GM_addStyle(css);
} else {
  const styleNode = document.createElement("style");
  styleNode.appendChild(document.createTextNode(css));
  (document.querySelector("head") || document.documentElement).appendChild(styleNode);
}
})();
