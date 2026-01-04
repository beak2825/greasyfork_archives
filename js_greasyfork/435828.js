// ==UserScript==
// @name                WME Fix UI Memorial Edition
// @namespace           https://greasyfork.org/en/scripts/435828-wme-fix-ui-memorial-edition
// @description         Allows alterations to the WME UI to fix things screwed up or ignored by Waze
// @include             https://www.waze.com/editor*
// @include             https://www.waze.com/*/editor*
// @include             https://beta.waze.com/editor*
// @include             https://beta.waze.com/*/editor*
// @exclude             https://www.waze.com/*user/editor/*
// @supportURL          https://www.waze.com/forum/viewtopic.php?t=334618
// @version             1.97.257
// @grant               none
// @downloadURL https://update.greasyfork.org/scripts/435828/WME%20Fix%20UI%20Memorial%20Edition.user.js
// @updateURL https://update.greasyfork.org/scripts/435828/WME%20Fix%20UI%20Memorial%20Edition.meta.js
// ==/UserScript==

/*
Memorial Edition thanks:
 phuz, fuji2086, Timbones, laurenthembprd, jm6087, BeastlyHaz, LihtsaltMats
 
Original version thanks:
 Bellhouse, Twister-UK, Timbones, Dave2084, Rickzabel, Glodenox,
 JJohnston84, SAR85, Cardyin, JustinS83, berestovskyy, Sebiseba,
 The_Cre8r, ABelter

=======================================================================================================================
Bug fixes - MUST BE CLEARED BEFORE RELEASE
=======================================================================================================================

*/

(function ()
{
   // global variables
   let fumeVersion = "1.97.257";
   let fumeDate = "2025-11-07";
   const newVersionNotes =
   [
      "Should now initialise correctly for all users..."
   ];

   let sdk = null;

   let oldVersion;
   let prefix = "WMEFUME";
   let debug = false;
   let wmeFUinitialising = true;
   let kineticDragParams;
   let yslider;
   /*
   let layersButton;
   let refreshButton;
   let shareButton;
   */
   let zliResizeObserver = null;

   let hidePasses = false;
   let isBeta = null;

   let abAlerts = null;
   let abAlertBoxStack = [];
   let abAlertBoxTickAction = null;
   let abAlertBoxCrossAction = null;
   let abAlertBoxInUse = false;

   let mteCache = [];

   const urlSelectableItems =
   [
      //itemType, isArray?
      ['segments', true],
      ['venues', true],
      ['nodes', false],
      ['mapComments', false],
      ['cameras', false]
   ];

   function abAlertBoxObj(headericon, title, content, hasCross, tickText, crossText, tickAction, crossAction)
   {
      this.headericon = headericon;
      this.title = title;
      this.content = content;
      this.hasCross = hasCross;
      this.tickText = tickText;
      this.crossText = crossText;
      this.tickAction = tickAction;
      this.crossAction = crossAction;
   }
   function abCloseAlertBox()
   {
      document.getElementById('abAlerts').childNodes[0].innerHTML = modifyHTML('');
      document.getElementById('abAlerts').childNodes[1].innerHTML = modifyHTML('');
      document.getElementById('abAlertTickBtnCaption').innerHTML = modifyHTML('');
      document.getElementById('abAlertCrossBtnCaption').innerHTML = modifyHTML('');
      abAlertBoxTickAction = null;
      abAlertBoxCrossAction = null;
      document.getElementById('abAlerts').style.visibility = "hidden";
      document.getElementById('abAlertCrossBtn').style.visibility = "hidden";
      abAlertBoxInUse = false;
      if (abAlertBoxStack.length > 0)
      {
         abBuildAlertBoxFromStack();
      }
   }
   function abCloseAlertBoxWithTick()
   {
      if (typeof abAlertBoxTickAction === 'function')
      {
         abAlertBoxTickAction();
      }
      abCloseAlertBox();
   }
   function abCloseAlertBoxWithCross()
   {
      if (typeof abAlertBoxCrossAction === 'function')
      {
         abAlertBoxCrossAction();
      }
      abCloseAlertBox();
   }
   function abShowAlertBox(headericon, title, content, hasCross, tickText, crossText, tickAction, crossAction)
   {
      abAlertBoxStack.push(new abAlertBoxObj(headericon, title, content, hasCross, tickText, crossText, tickAction, crossAction));
      if (abAlertBoxInUse === false)
      {
         abBuildAlertBoxFromStack();
      }
   }
   function abBuildAlertBoxFromStack()
   {
      const tbIcon = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAPdXpUWHRSYXcgcHJvZmlsZSB0eXBlIGV4aWYAAHjapZhpciu7coT/YxVeAuZhORgjvAMv31+iW7Skc/xeXFuUSKrZxFCVlZkFs//rP4/5D36idd7EVGpuOVt+YovNd95U+/z0++xsvM/3x78f8f+P6+bzgedS4DU8/9b83v913X0GeF4679K3gep8Pxg/P2jxHb/+GuidKGhFWsV6B2rvQME/H7h3gP5sy+ZWy/ctjP28rq+d1OfP6CmUZ+tfg/z+PxaitxIXg/c7uGB5DuFdQNBfMKHzJtznyo16dN3EcwrtXQkB+VucPj/cZ46WGv9604+sfN65v183v7MV/XtL+BXk/Hn963Xj0t+zckP/beZY33f+5/W07X5W9Cv6+jtn1XP3zC56zIQ6v5v62sp9x32DKTR1NSwt28JfYohyH41HBdWTrC077eAxXXOedB0X3XLdHbfv63STJUa/jS+88X76cC/WUHzzk6y5EPVwx5fQwgqVJM+b9hj8Zy3uTtvsNHe2yszLcat3DOb4yj9+mH/6hXNUCs7Z+okV6/JewWYZypyeuY2MuPMGNd0Afz1+/yivgQwmRVkl0gjseIYYyf0PE4Sb6MCNidenXFxZ7wCEiKkTi3GBDJA1F5LLzhbvi3MEspKgztJ9iH6QAZeSXyzSxxAyuaGSmJqvFHdv9clz2XAdMiMTKeRQyE0LnWTFmMBPiRUM9RRSTCnlVFJNLfUccswp51yySLGXUKIpqeRSSi2t9BpqrKnmWmqtrfbmW4A0U8uttNpa6505OyN3vt25offhRxhxJDPyKKOONvoEPjPONPMss842+/IrLPhj5VVWXW317TZQ2nGnnXfZdbfdD1A7wZx40smnnHra6Z+svWn94/EPsuberPmbKd1YPlnjailfQzjRSVLOSBgq4sh4UQoAtFfObHUxemVOObMN+gvJs8iknC2njJHBuJ1Px33lzvgno8rc/ytvpsQfefP/18wZpe4fZu7PvP0ta0syNG/GnipUUG2g+vh81+5rl9j98Wr82Kv1E0awc4bd2xx7r33KHnn1teMZjWX1tJc/vR0KqqxBxFziS/XMclY+rZjF1a73Y41Z9+gpDjZwktVkfswT8vMW2vT/akV6E/uprbM2IjmWnwO0spkUN5vmdxTiuMoBHp2grp5GCtun7u93+HI2YyPJDq7v64QyiHsavC3jNDdbIlfUUu6OvWBcus/xeSsd/v5qvl0g6G2l2pl75hwOVM+Q/tzRzx29NLdbcrWQ8ZPI9DN+m8nUdAdiH06Q67kldCPF2UkwEcqjk2FX2ibUdpccVtuN2PncWlrhKKAkx8yAgDEPq6inNHB2bOolua877g0sIRGhtXc7aTtG2KmAr0lZEC/fotlMcmLKZbH6HXOfuVJQSq//7Br0I2jr5n31A43uWcqKpw2yvvZa2fDZWWW0tkA8WAE7HVTH8+x+dbeL/b79+6ohoXIQf1xrlYCaPcqFYF9AsDD4jgWP08OexHdvFxXQtAvW5vt4mUEiRY7VSzusZNjzXMzgN1KJEhcttpczXai7p7RG9HWRgrSIXBkTJU6d7PLZHgxbj8sk2pDSVfBj8Mqq0/XJ2g7FbSNYKGC+VGSkQqjDlWq36nudemfqggs52JSyyB/eWlTQHHOH2QuxKm99BPdBR0tvmQU4haKnmM8B3l/QNy/2y5qTnTgwmclGbU+hnxHC3PZ5mzNTUdkCai8CqhbXl1iombBZbexUQhy7v6E9YLfb37UAYDEjSZE7bILaYVIwulnKMGX3DBunPJwDAYuypIR5nefZX7WqtUPWREhjxc4NoVvoLPS9O+Hf1TnTnvmwWb7f1DCJzWMpe4WIpYOzKuxbhpuqAZYDgit5ubaE5vYAzszT1reCbtobfvknRwxA5Y+ID9Sti7p8UXd2HAPIpmSgvskH9eE9xvlJfP+W93Z43hr1Gi3hO8ACCe6k1I5qj3JZmJiVQHHVZ0z9mGPZEwUq34ktBFFWyLQxY5uZbyUUNzeRwFfgYa5E+YEprDMKz6rgFEA+VMdnqykSoDNA4qQvoatGn3ZuK2o2lte/Z7k0muwVpumoEJAeBGlSAglhG4qX1hkDZQnqMvViegaeA0if+HJ5/ACH4acKnFF420O1Ch0tyoc8xB0su/dl/INl3/Ibu1cz8AB8W8w07fEDwUL1CoF3CGIPk2QliopKzmfFHU0nUquOhb9T6gKFRJpdmEugLeqSWDSinkYA2YsFDPayc4HC2DMhDChepjuK4eSgD4J4Z8BoKOEszZbhDqUGcMnlAFERm34+14cX7fItC3PfgfwzEGxB5cMbvqTcRSbOQxADH6HEwG0rbYqM3edUK1QSt0LeXcfsG5wAYD63vlsJorGfEX/QTos70yd4v5gXTHTTJ7KkKZPo9ep7gAOrSGFSyh6OoEQavU6DbtJHWNAyPk5QPLWYsqHS0FOEmqxAKw2AJIDiG5AlNGwynZRfsWzOKsDMykctMjw4C6WSBbZWgSrl6xHZIs8ndINzaKLEQCvFVJCFvrvSgAbKMyTyqG8SuNLzUE+b3V0DkGRdsN2MXOeFTe8krZURsE/FFYICVzL5ksUnKkgTPF+mWSw+XAIgQZTvbP1Ge8tZfrmWdvH6VztzX2fu5lg2QeEeC3rpCKWSB19DIcA4TJtFiqLBsSbOp26EGNNEIwNqwEtnWbCAcezTUfYePod2y9gwMsO6y67ozSQBHnyqZIE4NBpVHGwbdkaYQN9om6ylG0nPRl2kNEfNUsBZmApDIBIKOJI0rumu6foTjNcBK+LZwtIEW9Mb24CQGY/XMLgTBzsLniPtDdKO4C5Ph1XBNMx1MBCAhIz6fg3vxSmOrcxdvwTj372S11JJOGJI+nafASLFpS9rKj09Y7GcExFvC5rEQKnit88Qo/lFMIgIzkpWpUFcXGNL4tJOrzDPTkG6RnxQKRwIM6m1SGJ5RaeOW/Yn+CFfOmgHsA1Alkohq+TE52fLHobEa2DjySsxAdVwHialdwUG5qACT1yBvGALXA6ALIKxTsmX4mkutJWAJzLl8rO8IWy252iQgcSguyo3gYxrrBwZocsf5u3xoeg7y+vD1fXC1uzk57/w4S+yB+xV7JG97uSVAmEXrI91B6oAUBtYhK1By3nIZ5/X+kDHETAgPJfoH9XYVv5AdvuyjoCB312V8YdZc7sp+dsjIIkZSQzy9/y/0Gp6n4nIoxRMLCwmuqM8Ku4FNhlHLJnFaQZVpmoW3RoKAOIQCSdTh8RX8KbrjzWW/4CzUO0x6NfOmqoieiq8ymCgDo7V+vUAxWzJaEmUqlhKXYnHjA0aJRVIHcgyGV23fdr53rZULJgGoxMprwjxPcXhoVG5RJw0ycGX4UdOVJghpz2GKoXajQOG7mydftmX2x15PFb9w0rHi1yQriHKk6l1/eqWQFAHUCbt0pyDCBxDpmSqcMRMRF/H04YtdjosSHVDeGht9f25R1UteaZOFbxXlXLIOBOcP3QC+89QqT6Ll4KtuI3yY/04l7GylViUgB8HOSywke9C3wOnwU0zy4QgR7D+9eMFhsMektywYGw4qFnyQz1YaCctSt5KQSkKeDCwtBkFU9lGR2tjKHBwu0kxDU9IHqTnhC/HBPRl1bslHM2q1OiMyDri4ZCK/aQmUoGZfg43gkcLre888bPsC2bd5zYmdGUITMtETI2FwniEM8ypmpmJfAhg6CRebDYje953HYPOQ1LNirOTk3TkbDWYsuUw/H49+roe/Z4UNBbnBQloreP8t2PpXk5quY2hC6ptpAwJgXSojRVcgV1bEC3Q+7plFVSZJ7wqzB42loy+vyEEE0DDnuKkAk9IIEiphQ5pbUldpQoWWaNYnQ4JHEZF9+x7jwcDhpvYvWCCOWwdsqRHe/mDThECo43BeYsk13Ut1v5yJfToadEcF/xSoeQIDK0Wm0BKqARMvnzUUlNA9eOSQOGkVZZVv7pIKWZfJkau7WkwqupEb89GA3FqJnpAB23YgJvUofMTrMvxIbHwyJJrPNmRma6ssJa5zZYFlu+65wfrnh+ke36AZGNBxlQLhOkuYFU1JiGhK5ZZmJifuuU98jYdXKsVDdvteq48bDrSwVdYgIhsFYfxZWfyeFA4Fjbgu6SQzE5NV0DcQXYpyhUCIIdybqNN/1dqnCzRQUbS9qEejX5pSYvRP9YCrpxEkJaYpRgda5IGggdgvV9LB6FifHCUAK3k9bmoJs1CCO3+IqybskcEUFcQRQuRslP4ikwM9d/uwUCcMgI6llkwP7thZzpmgjii7TSFx6qloFcfIBrdM319ncOwGUmD515cFeKLJtJ9v10uTZNT3HDydGbnJo4gbEkmjV3GjRBntbNl4Va+2uvo8IM6BsQuqVgBK92zk2Not20IG9G3GDL1omOfZHQI1u4hWJYPqjqkUSeGWNBCwPkYJlKgbgybIxKkQ9cpzMVWC2REznYbGgEGhzs2v3Tt+E3ywrZBFLV3NJFOPifZZGM66qq3562EVcoVVVylmkBr2g8VZi9nhye6BSlxmtqpK19JjCVGo5XotFu0bFBazJLsjLNs12cDzEkhTwqZ7odmDHWrQfYXigN+dcJDlM3MdKLtNslyroBJdouh6N4jTQ3Rx0YxSRFvkmVPEfR6zSx9Z1NTIe0TbAVWCzS6TmShw1BR5qQjjmCepqcGKKnK1WKv5hmwUEiv4V5hogNJ5Y8DQQyAlb/2AqbDcRJssmcAPzJ/VNP4rCvF7wkfPn+138L5ExUw7lq4Xn8WgJQc030tPHmiCJO0sav+MVPXm7CejYfDl2Eedpr4Sp37sWrohwUjQ5HqP5EgfSS7Up8wFyWJp/GXMIYwi/mXc4wYANQuwc7qvfGCJPNIIswu10Kyta9Gt2WohehPHZGlmPXByXaSZrqi2zZ2mq4ZET0d4LAm9AjOZlI5nCGuekJBYKkHMBSVIZur2uy9WWhU1tuyGFtuB7EyLBBZQ0WWzgZp1tT9yY52FaWUVkaCJOjMikyADkqqyEU/hyK695v7NP+L/aT5BGqtwwO7zSBHUJUWNUbHLWoH5pRg3tNX0mOkmDgVHWN5MSASsKGYC78tqp866EG7i6ArgEgmQSbBoC+BkWjvEVhTJA3I/ttUe7WTNJlS7XZVHeqmFcV2VxoLihpHVMQMTa339WCiQjU1XiSuo//XeiuLNxCpS+hwU15HUSAJprt9dH1BHccFNUmYy/wENV3ZiWpR57rnoVE1RmdGQrVJHXsWi+e6J+ZCbYn31DBY8+QA4MU/In7OWc38N1iEhwGR/v/iAAABgWlDQ1BJQ0MgcHJvZmlsZQAAeJx9kUsoRFEcxn9myCSyMAtJugusKCFZaoiUqWmM8lq4985Lzb2me0c2lsp2ysJjY7CwsWZrYauU8ijZ2lgRG+n6n5mpmWScOp1f3znf1znfAV8hY1pu/QBYds6JToW0+YVFrfEFPwGgi4Buutnw7GSMmuPzjjq13varrNrn/hwt8YRrQp0mPGZmnZzwivDIRi6reE84aKb1uPCZcJ8jFxR+ULpR4lfFqSL7VGbQiUXHhYPCWqqKjSo2044lPCzcHbdsyffNlziueFOxlVk3y/dUL2xO2HOzSpfZyRTThImgYbDOKhly9Mtqi+ISlf1QDX9H0R8RlyGuVUxxTLCGhV70o/7gd7ducmiwlNQcgoZnz3vvgcYd+M573teR530fg/8JLu2Kf60Aox+i5yta9yG0bsH5VUUzduFiG9ofs7qjFyW/TF8yCW+n8k0L0HYDTUul3sr7nNxDTLqauYb9A+hNSfZyjXcHqnv790y5vx8MNnJ+vog/WAAAD3BpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+Cjx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IlhNUCBDb3JlIDQuNC4wLUV4aXYyIj4KIDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+CiAgPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIKICAgIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIgogICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgIHhtbG5zOmV4aWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vZXhpZi8xLjAvIgogICAgeG1sbnM6R0lNUD0iaHR0cDovL3d3dy5naW1wLm9yZy94bXAvIgogICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iCiAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgIHhtcE1NOkRvY3VtZW50SUQ9ImdpbXA6ZG9jaWQ6Z2ltcDoxYThmMWIxZS1iMDhhLTQxN2EtOThkOS02Njg1OWNmZjg0ODgiCiAgIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6ZTQxMTMxMTUtNWJkNS00Yjg5LTg3YTUtNjQ3ZDlkNjVkN2IyIgogICB4bXBNTTpPcmlnaW5hbERvY3VtZW50SUQ9InhtcC5kaWQ6NmM3ZjJkYmQtZGQwYS00MDNjLThiYTMtMzAyNjRlYWMxNjI4IgogICBkYzpGb3JtYXQ9ImltYWdlL3BuZyIKICAgZXhpZjpQaXhlbFhEaW1lbnNpb249IjgwIgogICBleGlmOlBpeGVsWURpbWVuc2lvbj0iODAiCiAgIEdJTVA6QVBJPSIyLjAiCiAgIEdJTVA6UGxhdGZvcm09IldpbmRvd3MiCiAgIEdJTVA6VGltZVN0YW1wPSIxNjc4MjM1NDcyMjM0NjU2IgogICBHSU1QOlZlcnNpb249IjIuMTAuMzAiCiAgIHBob3Rvc2hvcDpDb2xvck1vZGU9IjMiCiAgIHBob3Rvc2hvcDpJQ0NQcm9maWxlPSJzUkdCIElFQzYxOTY2LTIuMSIKICAgdGlmZjpJbWFnZUxlbmd0aD0iODAiCiAgIHRpZmY6SW1hZ2VXaWR0aD0iODAiCiAgIHRpZmY6T3JpZW50YXRpb249IjEiCiAgIHRpZmY6UmVzb2x1dGlvblVuaXQ9IjIiCiAgIHRpZmY6WFJlc29sdXRpb249IjcyLzEiCiAgIHRpZmY6WVJlc29sdXRpb249IjcyLzEiCiAgIHhtcDpDcmVhdG9yVG9vbD0iR0lNUCAyLjEwIgogICB4bXA6TWV0YWRhdGFEYXRlPSIyMDIxLTEwLTI3VDA4OjUyOjUzKzAxOjAwIgogICB4bXA6TW9kaWZ5RGF0ZT0iMjAyMS0xMC0yN1QwODo1Mjo1MyswMTowMCI+CiAgIDx4bXBNTTpIaXN0b3J5PgogICAgPHJkZjpTZXE+CiAgICAgPHJkZjpsaQogICAgICBzdEV2dDphY3Rpb249InByb2R1Y2VkIgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJBZmZpbml0eSBEZXNpZ25lciAxLjEwLjMiCiAgICAgIHN0RXZ0OndoZW49IjIwMjEtMTAtMjdUMDg6NTI6NTMrMDE6MDAiLz4KICAgICA8cmRmOmxpCiAgICAgIHN0RXZ0OmFjdGlvbj0ic2F2ZWQiCiAgICAgIHN0RXZ0OmNoYW5nZWQ9Ii8iCiAgICAgIHN0RXZ0Omluc3RhbmNlSUQ9InhtcC5paWQ6ZGY4YTVhMzYtZDZkYy00ZDVmLWJjMWMtMzZhNWViZWY3YzU3IgogICAgICBzdEV2dDpzb2Z0d2FyZUFnZW50PSJHaW1wIDIuMTAgKFdpbmRvd3MpIgogICAgICBzdEV2dDp3aGVuPSIyMDIzLTAzLTA4VDAwOjMxOjEyIi8+CiAgICA8L3JkZjpTZXE+CiAgIDwveG1wTU06SGlzdG9yeT4KICA8L3JkZjpEZXNjcmlwdGlvbj4KIDwvcmRmOlJERj4KPC94OnhtcG1ldGE+CiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAKPD94cGFja2V0IGVuZD0idyI/Pv26nxYAAAAGYktHRAD/AP8A/6C9p5MAAAAJcEhZcwAACxMAAAsTAQCanBgAAAAHdElNRQfnAwgAHwyBbZEQAAAJD0lEQVRYw5WXeXDV1RXHP/f3+70tL28LISEhJCqyBYJiosgixQqyiFoI0NoKWq1lbMVOnVE7Zcap7dQ6dKE62DrttI7iVGVzGZWS0Q6LIAghQCwQskFeyEK2917y1t9y+0ceMS9A0TNz//md+zvne+8953zPEXwNMYKVGlCIFLchWA5MAooBf3pLCGgB6oCdII8gadOKdxjXsi3+nzLVslxVhFIG4kngbmAMoF7Dpgl0AFVIXpZC1trG7TC/MQA9WJkv4GkQa4Hc4XtNU2KYEinloBEhUFWBpmaYk0A38IbE2mgbt/Pi1wJgtK4Q0hI3CSH+BlQM3zMQNTjbFOGjTy7Q06tjWoMAFEXgcSss/FYBZZMDBPx2hMgAclQi10mL4/aSHfKqAFKtK4SwxEwhxBbgxuG61vYYL/29ju27UwRG5WG3O1AUBQRYloWhG/T1djGv3OTJRydwU6kfRckwXw+ssaTxhb34PXlFAHpL5c1CiG0jnbd3xtnw4kmO1uXgD+SgKArZ7iwe+O4qbJrG21u30xsKI6UkFo2S4wryx+dKmTbZP/KCG6WUq23FO45d+qAMc56fvvYM5ynd4p9vN3L4lI9AzqjBUwPTSqewcMECZtxyC2XTpg7Fgjs7m+7YWF7+Rz39A/pIAOOFEH81WirzMwDoLctVIXg6/eYZ0tmV4IOqMIGcUYhhDxsKhzl58iRNTU3U1ddn/ON2Z7P3CJw4FbpS3FUgxNNGcIUKoA1CV8rS0Z4R6T2hJLv+00ZLh44veRGbzc6o3FwURaGuvpHnf/u7dAZoCCGGskJRFBxZfuoawsy5NTcDePrQa6UUbwLHNb1lhSYG8zx3+K7Pq7v51Z+CGOo4yitKUDWV7GwPPn8ATdMQaawSME0TXU+RSiUxDINkMoFpGPSGujBN0LTLbmG0EPxUb1nxuCYQhekiMwRTSmhojqC5JzPhhhuJRqNEwiEi4TCRcCj93l8lWboaoKgKXq+f0bn5mIaJ3d6LuGqlEUuAAg3BbekK95VKwNyZeVSfPEO48xRn6uP84L7vUFSQh9Nhx+mwY7cNHkvXDeLJJImkTiql09rRxbH/1jAQPsOds8tQ1asiGCNgtgZi+ZXK6/gSD795ZhrBthgvvHR2MCNSOslUir6wREpr2KVJhFBQFEFuwMek64sIXjyHz2MjmTRxOK5YvVUJi7Q0sVzOA7rF69ua2flhGNcNs4iMn0PK5QIgHoux5/2dTA+ATdOo7jKYf/9yXFnuQcv5cS7sNlm7/gCV9/pZt2YCDrty+SMIUa6lWe0y6epOcOy4l5tLxzP9oZ8weUY58WgUzWbD4/ejqipHt2wGYOHDP2PR6u8R6evD0HVcbjeFJSWcfcei5vgFwvenyMt1XslNoTaMUjMpzZKkUga9/TF8o3L5dOd2ar84hNvj5ZFnfwlIKpfMQ0pJi2UyEA7z2sYXiA0MUDbzdiZMm04kmiCpG1iWvFoceLSrafJynZROCfGvD9qY39vDgspVLFy5GtM0MHSDszXVLFswCafDzu73P2f23Yt5bMNzqKqGlJIzNdUcrKll1VIHPm/hVblbSzcTo0cqXE6V9Y9Owudppmrr2zhdWdjsdvRUik93bGNmwGDqxOsQCObmH+f137/IgpWrsTucpJJJdm99i8ce8LCm8npczqu2EP1aupPJAGBZktb2GDs/vsDHBzXa2/ZCTw+Rvm5mTS3kR3PKmTF1AppmA+ChysWU1zXz762b2X8yyEA8RXNTI/0zCrGsZpYvKWLsGNdIdgRoU597qnQeMP3Sl3jC5JP9HTzzhy62J7+NvugJ5rsNli69h7yAj3Ur53OiOcTRug5qzg6u2qYudKmxevFsQnoWgdGFDBiS3gc38sGeixzdXU+uJ864QjealpENH6vPPTVFgKgElETS5I1tTTxfs4DwHQ9jxWNoThcVIozX66OnuwfDNPn0WCOnG4NEEhadfVFON57nYjiFw2GnubMfUwqi4T7umXoDnkSE03eso2p/HG/fcUon+i91TibIjRpwBOgwLTn2s8MX+XPDEtxrniXVGSTa8CUyGsHn8xFPJInEdfZ92YZpSZqb6jl5YpDWPR4vPl+AvbVtQ4Tkdrvx9rdR7JQExl/HoYkb2LRFoSDvIIvmF6AookNKDmqWtNoUoVS1tsUefvHdAuF85Ak0j59UZxBpmSjJOP4iP7phDvFEdraH22fPQ9dTANhsdlRVHXIO4HA40XUdIU1+WARxI4djq57kpdcaKJsSp2hM1i4B7Yq9+F0jFEq9/NZ7rd3nZ63BPnowZTQBFR47C4tyON9yHqfTmUGrqqridLpwOl2o6uVR3tfXg5YdQLE76UpC2AR7XhEN5d9n+4etXf1R/RWteIehAKxat7/21eOlW7w3zZYIgQZMcNlYMM7DL+6fy4WWc0jLxO3O+jpjBOFwiLq4QlXxXZyWObxyAYLmIMt5y+dZrxy4/o2lD+6p5RIJnQsmZMnv3jphG1N8J0IpXO6FlfZ2mk/XsujuhZSUFLN92zs4HE6isTi6rl9xxeNxOtrbONzajbrmWRKF4zm1bxfGxBlo3sDgzTmcRyi6cX3NXzb3Z/SEtaundyqCdQLZ4FfBpYJEYiEou+VWntjwa2qzx9GEjUZd0p5K4YoHccWDdKaSNOqS86qTzilzcf18E56ptyGEILMKywZFEY+fWjuzc3glHBIniZoEzjXbw+qbB84xvrMLEvXQLwQh8zqsZT9mrs9ilN1ilIyzLF4NwEfOcroVFz0phf1hhbilXOFhZIOC9WCWFqsZWYqHZH9Ftpxb3X84YrlWt/aFXw2nREXvAEJoX7Vz+yIKcwLgdGokLD8C6Hd4uJhQOBCBkHWZZ0smYkcVrMeztFjN3pu9cmSDmCGflXvk0QrtWORQ1b32nLxNQoiu4fqQCXt6oTGmcE7No0EdQ2NUYU/voG4E4Xc5cvM3DdTsu+9IhXZspPNrDqcVVedVkTO2DMR6C2UxkH8pcB0ClrnjAHwYdZGUGcNpp8DaJZCbRbir9ou7Cr75cDpcZlUnNVOqBRIxRyIWAeVAoQretMcI0AayWiB3CzioYLQdqnBeczz/H8ZD44ipEgS5AAAAAElFTkSuQmCC";

      abAlertBoxInUse = true;
      abAlertBoxTickAction = null;
      abAlertBoxCrossAction = null;
      var titleContent = '<span style="font-size:14px;padding:2px;">';
      //titleContent += '<i class="fa '+abAlertBoxStack[0].headericon+'"> </i>&nbsp;';
      titleContent += '<img src="' + tbIcon + '">';
      titleContent += abAlertBoxStack[0].title;
      titleContent += '</span>';
      document.getElementById('abAlerts').childNodes[0].innerHTML = modifyHTML(titleContent);
      document.getElementById('abAlerts').childNodes[1].innerHTML = modifyHTML(abAlertBoxStack[0].content);
      document.getElementById('abAlertTickBtnCaption').innerHTML = modifyHTML(abAlertBoxStack[0].tickText);
      if (abAlertBoxStack[0].hasCross)
      {
         document.getElementById('abAlertCrossBtnCaption').innerHTML = modifyHTML(abAlertBoxStack[0].crossText);
         document.getElementById('abAlertCrossBtn').style.visibility = "visible";
         if (typeof abAlertBoxStack[0].crossAction === "function")
         {
            abAlertBoxCrossAction = abAlertBoxStack[0].crossAction;
         }
      }
      else
      {
         document.getElementById('abAlertCrossBtn').style.visibility = "hidden";
      }
      if (typeof abAlertBoxStack[0].tickAction === "function")
      {
         abAlertBoxTickAction = abAlertBoxStack[0].tickAction;
      }
      document.getElementById('abAlerts').style.visibility = "";
      abAlertBoxStack.shift();
   }
   function abInitialiseAlertBox()
   {
      // create a new div to display script alerts
      abAlerts = document.createElement('div');
      abAlerts.id = "abAlerts";
      abAlerts.style.position = 'fixed';
      abAlerts.style.visibility = 'hidden';
      abAlerts.style.top = '50%';
      abAlerts.style.left = '50%';
      abAlerts.style.zIndex = 10000;
      abAlerts.style.backgroundColor = 'aliceblue';
      abAlerts.style.borderWidth = '3px';
      abAlerts.style.borderStyle = 'solid';
      abAlerts.style.borderRadius = '10px';
      abAlerts.style.boxShadow = '5px 5px 10px Silver';
      abAlerts.style.padding = '4px';
      abAlerts.style.transform = "translate(-50%, -50%)";

      var alertsHTML = '<div id="header" style="padding: 4px; background-color:LightBlue; font-weight: bold;">Alert title goes here...</div>';
      alertsHTML += '<div id="content" style="padding: 4px; background-color:White; overflow:auto;max-height:500px">Alert content goes here...</div>';
      alertsHTML += '<div id="controls" align="center" style="padding: 4px;">';
      alertsHTML += '<span id="abAlertTickBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px 10px 2px 10px;">';
      alertsHTML += '<i class="fa fa-check"> </i>';
      alertsHTML += '<span id="abAlertTickBtnCaption" style="font-weight: bold;"></span>';
      alertsHTML += '</span>';
      alertsHTML += '&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
      alertsHTML += '<span id="abAlertCrossBtn" style="cursor:pointer;font-size:14px;border:thin outset black;padding:2px 10px 2px 10px;">';
      alertsHTML += '<i class="fa fa-times"> </i>';
      alertsHTML += '<span id="abAlertCrossBtnCaption" style="font-weight: bold;"></span>';
      alertsHTML += '</span>';
      alertsHTML += '</div>';
      abAlerts.innerHTML = modifyHTML(alertsHTML);
      document.body.appendChild(abAlerts);
   }

   function SetStyle(elm, style, value, important)
   {
      if ((elm !== null) && (elm != undefined))
      {
         if (important === true)
         {
            value += '!important';
         }
         elm.style[style] = value;
      }
   }
   function modifyHTML(htmlIn)
   {
      if (typeof trustedTypes === "undefined")
      {
         return htmlIn;
      }
      else
      {
         const escapeHTMLPolicy = trustedTypes.createPolicy("forceInner", { createHTML: (to_escape) => to_escape });
         return escapeHTMLPolicy.createHTML(htmlIn);
      }
   }
   function getChecked(eID)
   {
      let retval = null;
      let elm = getById(eID);
      if (elm !== undefined)
      {
         retval = elm.checked;
      }
      return retval;
   }
   // contrast items
   function GetBorderContrast(contrast, isImportant)
   {
      var retval = 'border: 1px solid ' + ['', 'lightgrey', 'grey'][contrast];
      if (isImportant === true)
      {
         retval += '!important';
      }
      retval += '; ';
      return retval;
   }

   function tameSegmentTypeMenu()
   {
      // Remove whitespace from the segment type menu if it's being used
      if (getChecked('_cbTameSegmentTypeMenu') === true)
      {
         // Check the menu is being shown - this won't be the case in compact mode
         let rtm = document.querySelector('[name="roadType"]');
         if (rtm != null)
         {
            if (rtm.childElementCount > 0)
            {
               let menuDividers = rtm.getElementsByTagName('wz-menu-divider');
               let pe;
               let sr;
               for (pe of menuDividers)
               {
                  SetStyle(pe, "display", "none", false);
               }
               let menuTitles = rtm.getElementsByTagName('wz-menu-title');
               for (pe of menuTitles)
               {
                  sr = pe.shadowRoot.querySelector('.wz-menu-title');
                  SetStyle(sr, "padding", "0px 0px 0px 4px", false);
                  SetStyle(sr, "height", "100%", false);
                  SetStyle(sr, "lineHeight", "100%", false);
                  SetStyle(sr, "minHeight", "auto", false);
               }
               let menuEntries = rtm.getElementsByTagName('wz-option');
               for (pe of menuEntries)
               {
                  sr = pe.shadowRoot.querySelector('.wz-menu-item');
                  SetStyle(sr, "padding", "0px 0px 0px 24px", false);
                  SetStyle(sr, "height", "100%", false);
                  SetStyle(sr, "lineHeight", "100%", false);
                  SetStyle(sr, "minHeight", "auto", false);
               }
            }
         }
      }
   }
   function tameSegmentElevationMenu()
   {
      // Remove those options from the elevation menu which no-one is ever likely to need
      if (getChecked('_cbTameElevationMenu') === true)
      {
         if (document.getElementsByName('level').length > 0)
         {
            if (document.getElementsByName('level')[0].childElementCount > 0)
            {
               let menuEntries = document.getElementsByName('level')[0].getElementsByTagName('wz-option');
               let localeGround = I18n.lookup('edit.segment.levels')[0];
               for (let pe of menuEntries)
               {
                  let level = 0;
                  if (pe.value != localeGround)
                  {
                     level = parseInt(pe.value);
                  }
                  if ((level > 5) || (level < -5))
                  {
                     SetStyle(pe, "display", "none", false);
                  }
                  else
                  {
                     let sr = pe.shadowRoot.querySelector('.wz-menu-item');
                     let indent = 44 + (level * 8);
                     SetStyle(sr, "padding", "0px 0px 0px " + indent + "px", false);
                     SetStyle(sr, "height", "100%", false);
                     SetStyle(sr, "lineHeight", "100%", false);
                     SetStyle(sr, "minHeight", "auto", false);
                  }
               }
            }
         }
      }
   }
   function hideSegmentPanelLabels()
   {
      // Hide the labels in the segment edit panel to give more vertical space to the things we need to interact with
      if (getChecked('_cbHideSegmentPanelLabels') === true)
      {
         let tObj = document.getElementById('edit-panel').getElementsByTagName('wz-tab');
         if (tObj.length > 0)
         {
            tObj = tObj[0].getElementsByTagName('wz-label');
            if (tObj.length > 0)
            {
               for (let l of tObj)
               {
                  if (l.getElementsByTagName('wz-checkbox').length == 0)
                  {
                     l.style.display = "none";
                  }
               }
            }
         }
      }
   }
   function hideRoutingPreferenceDescription()
   {
      // Remove that slightly annoying "used as" message under the routing option buttons
      if (getChecked('_cbRemoveRoutingReminder') === true)
      {
         SetStyle(document.querySelector('.routing-road-type-message')?.parentElement, "display", "none", false);
      }
   }
   function compressSegmentPanel()
   {
      if (getChecked('_cbCompressSidebar') === true)
      {
         if (getById('_inpUICompression').value > 0)
         {
            // Reduce padding enough so that the compact mode segment type selectors stand a reasonable chance
            // of fitting onto two lines instead of needing to spill over onto a third...
            SetStyle(document.querySelector('wz-tab')?.shadowRoot.querySelector('.wz-tab'), "padding", "2px", false);

            // Reduce gap between the "Select entire street" and "Edit house numbers" buttons
            SetStyle(document.querySelector('#segment-edit-general'), "gap", "0px", false);

            // Reduce gap under the direction and lock level selectors
            SetStyle(document.querySelector('[class^="direction-editor"]'), "marginBottom", "0px", false);
            SetStyle(document.querySelector('.lock-edit-view'), "marginBottom", "0px", false);

            // Reduce height of the speed limit input boxes
            let nSLE = document.querySelectorAll('#segment-edit-general .speed-limit-input').length;
            if (nSLE > 0)
            {
               for (let i = 0; i < nSLE; ++i)
               {
                  let sr = document.querySelectorAll('#segment-edit-general .speed-limit-input')[i].shadowRoot;
                  SetStyle(sr.querySelector('.wz-text-input'), "height", "26px", false);
               }
            }

            // Reduce height of the elevation drop-down - all this just to tweak the height of ONE UI element, thank you
            // VERY much shadowroot :-/
            if (document.getElementsByName('level')[0] != undefined)
            {
               let sr = document.getElementsByName('level')[0].shadowRoot;
               SetStyle(sr.querySelector('.wz-select'), "height", "20px", false);
               SetStyle(sr.querySelector('.selected-value-wrapper'), "height", "20px", false);
               SetStyle(sr.querySelector('.select-wrapper'), "height", "20px", false);
               SetStyle(sr.querySelector('.select-box'), "height", "20px", false);
            }
         }
      }
   }

   function toRadians(degs)
   {
      return ((Math.PI * degs) / 180);
   }
   function distBetweenLatLons(p1, p2)
   {
      let r1 = [toRadians(p1[0]), toRadians(p1[1])];
      let r2 = [toRadians(p2[0]), toRadians(p2[1])];
      let term1 = Math.sin(r1[1]) * Math.sin(r2[1]);
      let term2 = Math.cos(r1[1]) * Math.cos(r2[1]) * Math.cos(r2[0] - r1[0]);
      return Math.acos(term1 + term2) * 6371000;
   }
   function getLineStringLength(lsGeom)
   {
      let retval = null;
      if(lsGeom.type == "LineString")
      {
         retval = 0;
         let sBits = lsGeom.coordinates.length - 1;
         for(let i = 0; i < sBits; ++i)
         {
            let p1 = lsGeom.coordinates[i];
            let p2 = lsGeom.coordinates[i + 1];
            retval += distBetweenLatLons(p1, p2);
         }
      }
      return retval;
   }

   function addAltSegmentLength()
   {
      let segLen = document.querySelector('.length-attribute')?.querySelector('.value');

      if (segLen !== undefined)
      {
         if (segLen.touchedByFUME === undefined)
         {
            let selSeg = sdk.Editing.getSelection();
            if(selSeg !== null)
            {
               let nSegments = selSeg.ids.length;
               let sLength = 0;
               while (nSegments > 0)
               {
                  --nSegments;
                  let segObj = sdk.DataModel.Segments.getById({segmentId:selSeg.ids[nSegments]});
                  let segLength = getLineStringLength(segObj.geometry);
                  if(segLength !== null)
                  {
                     sLength += segLength;
                  }
               }
               let altDist = GetAltDistanceString(sLength);

               segLen.innerText += ' / ' + altDist;
               segLen.touchedByFUME = true;
            }
         }
      }
   }

   function BOH_InhibitTooltipSuppression(puElm)
   {
      let keepPU = false;
      let cn = puElm?.firstChild?.className;
      if(cn !== undefined)
      {
         keepPU ||= (cn.indexOf('turn-preview') === 0);
         keepPU ||= ((cn.indexOf('editorCard') === 0) && (getChecked('_cbAllowEditorPopup') === true));
      }

      return keepPU;
   }
   function BOH_SuppressTooltips()
   {
      // Hide tooltip popups
      let puElm = document.querySelector('wz-tooltip-content');
      if (puElm !== null)
      {
         let inhibitSuppression = BOH_InhibitTooltipSuppression(puElm);
         if ((getChecked('_cbTameHNButtonPopup') === true) && (inhibitSuppression === false))
         {
            puElm.style.display = "none";
         }
         else
         {
            // Whilst the tooltip element appears to get nuked and rebuilt each time a popup is needed,
            // WME also seems to be able to remember which ones had been hidden by FUME, such that if 
            // the tame option is disabled, those popups will remain hidden until the session is
            // reloaded, unless we make sure they're shown again here...
            puElm.style.display = "";
         }
      }
   }
   function BOH_RestyleTurnPopup()
   {
      // Restyle turn arrow popup
      let tObj = document.querySelector('.tippy-box');
      if (tObj !== null)
      {
         let puRendered = (document.querySelector('.tippy-box').getAttribute("data-state") === "visible");
         if (puRendered === false)
         {
            window.setTimeout(BOH_RestyleTurnPopup,1);
            return;
         }

         let isTurnPopup = (tObj.innerText.indexOf(I18n.lookup("turn_tooltip.turn_state.allowed")) !== -1);
         isTurnPopup = isTurnPopup || (tObj.innerText.indexOf(I18n.lookup("turn_tooltip.turn_state.disallowed")) !== -1);

         if(isTurnPopup === true)
         {
            let turnEnabled = (tObj.querySelector('wz-toggle-switch')?.checked === true);
            let isUTurnPopup = (document.querySelector('.turn-arrow.hover')?.firstChild?.className.indexOf('uturn') >= 0);

            if((isUTurnPopup === true) && (getChecked('_cbInhibitUTurnPopup') === true))
            {
               tObj.style.display = "none";
               return;
            }
            if((isUTurnPopup === false) && (getChecked('_cbInhibitTurnPopup') === true))
            {
               tObj.style.display = "none";
               return;
            }


            let compress = getById('_inpUICompression').value;
            if (compress > 0)
            {
               // See how many root elements there are in the popup
               let n = tObj.querySelector('wz-list')?.childElementCount;
               if 
               (
                  (tObj.touchedByFUME !== true) && 
                  (
                     (n > 1) || 
                     (turnEnabled === false)
                  )
               )
               {
                  if(turnEnabled === true)
                  {
                     // If there's more than one such element in the popup, it means the popup is displaying all the elements
                     // for an enabled turn, which will also mean the TIO menu should be displayed, so we now wait for that
                     // to arrive before continuing...
                     let menuRendered = (document.querySelector('.tippy-box').querySelector('#opcode-select').getBoundingClientRect().width !== 0);
                     if (menuRendered === false)
                     {
                        return;
                     }
            
                     // Now the menu has been rendered, apply our tweaks to it
                     let m = tObj.querySelectorAll('wz-option').length;
                     while (m)
                     {
                        --m;
                        let sr = tObj.querySelectorAll('wz-option')[m].shadowRoot;
                        let mi = sr.querySelector('.wz-menu-item');
                        if ((mi !== null) && (mi !== undefined))
                        {
                           SetStyle(mi, "height", "100%", false);
                           SetStyle(mi, "lineHeight", "100%", false);
                           SetStyle(mi, "minHeight", "auto", false);
                        }
                     }
                  }
         
                  // Compress the root elements...
                  while (n)
                  {
                     --n;
                     let mi = tObj.querySelector('wz-list').childNodes[n];
                     if ((mi !== null) && (mi !== undefined))
                     {
                        SetStyle(mi, "minHeight", "auto", false);
                        let sr = mi.shadowRoot?.querySelector('.list-item-wrapper');
                        SetStyle(sr, "padding", "0px", false);
                     }
                  }
         
                  let mi = tObj.querySelector('.tooltip-control');
                  SetStyle(mi, "padding", "0px", false);
         
                  let tc = tObj.querySelector('.tippy-content');
                  if ((tc !== null) && (tc !== undefined))
                  {
                     let tcc = tc.firstChild;
                     if ((tcc !== null) && (tcc !== undefined))
                     {
                        SetStyle(tcc, "min-height", "auto", false);
                     }
                  }

                  if(turnEnabled === false)
                  {
                     // If we've applied compression to the popup, and if WME is displaying the
                     // small popup used when a turn is disabled (which gets placed below the turn
                     // arrow rather than to the side as for the larger enabled turn popup), then 
                     // we need to shift it up slightly to close the gap between the top of the
                     // popup and the turn arrow - if we leave it as-is then not only does it
                     // look a bit odd, but it also makes it harder to move the mouse pointer into
                     // the popup without accidentally mousing-over something else that might
                     // cause the popup to be closed...
                     let tParent = tObj.parentElement;
                     let t3dbits = tParent.style.transform.split(", ");
                     let yOff = parseFloat(t3dbits[1]);
                     yOff -= 10;
                     let newTransform = t3dbits[0] + ", " + yOff.toString() + "px)";
                     tParent.style.transform = newTransform;
                  }

                  let tcObj = tObj.querySelector('.tippy-content');
                  if(tcObj !== null)
                  {
                     tcObj.style.overflow = "visible";
                  }

                  tObj.touchedByFUME = true;
               }
            }
         }
      }   
   }
   function GetAltDistanceString(distMetres)
   {
      let altDist = '';

      // Convert into the most appropriate distance that complements
      // the natively displayed distance based on whether WME is running
      // in imperial or metric...
      if (sdk.Settings.getUserSettings().isImperial === true)
      {
         // m or km
         if (distMetres < 1000)
         {
            altDist = distMetres.toFixed(1) + " " + GetLocalisedDistanceUnits("m");
         }
         else
         {
            altDist = (distMetres / 1000).toFixed(1) + " " + GetLocalisedDistanceUnits("km");
         }
      }
      else
      {
         // ft or mi
         let ft = (distMetres * 3.28084);
         if (ft < 5280)
         {
            altDist = ft.toFixed(1) + " " + GetLocalisedDistanceUnits("ft");
         }
         else
         {
            altDist = (ft / 5280).toFixed(1) + " " + GetLocalisedDistanceUnits("mi");
         }
      }

      return altDist;
   }
   function AdjustForLatitude(distMetres)
   {
      let lat = sdk.Map.getMapCenter().lat;
      let cosLat = Math.cos((lat / 360) * (Math.PI * 2));
      return distMetres * cosLat;
   }
   function GetLocalisedDistanceUnits(rawUnits)
   {
      let retval = rawUnits;  // default to returning whatever was passed in
      let localised = I18n.lookup("measurements.length." + rawUnits);
      if (localised !== undefined)
      {
         let units = localised.split(' ');
         if (units.length == 2)
         {
            retval = units[1];
         }
      }
      return retval;
   }
   let prevDistance = -1;
   function BOH_AdjustMeasureTool()
   {
      let rDi = document.querySelector('.ruler-snackbar-tnum');
      if (rDi !== null)
      {
         let rLayer = W.map.getLayerByUniqueName("OpenLayers.Handler.Path");
         if (rLayer !== undefined)
         {
            // Get length of the measurement tool line as drawn onscreen
            let rDist = AdjustForLatitude(rLayer.features[0].geometry.getLength());
            if (rDist != prevDistance)
            {
               prevDistance = rDist;
               rDi.innerText = rDi.innerText.split("\n")[0] + "\n" + GetAltDistanceString(rDist);
            }
         }
      }
   }
   function BOH_EntryPointHandler()
   {
      let compress = getById('_inpUICompression').value;
      if (compress > 0)
      {
         if (document.getElementsByClassName('navigation-point-edit').length > 0)
         {
            let npOuter = document.getElementsByClassName('navigation-point-edit')[0];
            let npInner = npOuter.shadowRoot.querySelectorAll('.list-item-wrapper');
            if (npInner.length > 0)
            {
               for (let i of npInner)
               {
                  i.style.paddingTop = "4px";
                  i.style.paddingBottom = "4px";
               }
            }
         }
      }
   }
   function BOH_SegmentPanelMods()
   {
      tameSegmentTypeMenu();
      tameSegmentElevationMenu();
      hideSegmentPanelLabels();
      hideRoutingPreferenceDescription();
      compressSegmentPanel();
      addAltSegmentLength();
   }
   function BOH_MoveSearchThisArea()
   {
      let staElm = document.querySelector('#map-header-controls-region')?.firstChild;
      if((staElm === null) || (staElm === undefined))
      {
         return;
      }

      let staTouched = (staElm.touchedByFUME !== undefined);

      if(getChecked('_cbMoveSearchAreaButton') === true)
      {
         let mBCR = document.querySelector('#map')?.getBoundingClientRect();

         if(mBCR !== undefined)
         {
            // To avoid unecessary script activity, decide if we need to apply our mods based on
            // a) whether or not we've already done so, and
            // b) whether or not the map view has changed size since we last did so
            let skipUpdate = staTouched;
            {
               if(skipUpdate === true)
               {
                  skipUpdate = skipUpdate && (mBCR.width === staElm.touchedByFUME.width);
                  skipUpdate = skipUpdate && (mBCR.height === staElm.touchedByFUME.height);
               }
            }
            if(skipUpdate === false)
            {
               // Yup, we need to apply our mods...

               // Start by hiding the text
               let textElm = staElm.querySelector('.text');
               if(textElm !== null)
               {
                  textElm.style.display = "none";
               }
               // Then override the default button styling so it fits nicely around
               // the search icon we've left visible
               staElm.style.paddingLeft = "20px";
               staElm.style.paddingRight = "25px";
               staElm.style.minWidth = "auto";

               // Finally, work out how far to shift it across the map view so that it
               // sits nicely just to the right of the sidepanel, and either halfway
               // down the screen or just under the relocated map controls (if that option
               // is also selected and the height of the map view is short enough that
               // they're occupying that halfway point)
               let staBCR = staElm.getBoundingClientRect();
               let staTrans = staElm.style.transform;
               let tX = 0;
               let tY = 0;
               if(staTrans !== "")
               {
                  let tBits = staTrans.split('(')[1].split('px');
                  tX = parseFloat(tBits[0]) + 20;
                  tY = parseFloat(tBits[1].split(' ')[1]);
               }
               let shiftX = tX + mBCR.left - (staBCR.left + (staBCR.width / 2)) + 10;

               let yBase = (mBCR.bottom - mBCR.top) / 2;
               if(getChecked('_cbMoveZoomBar') === true)
               {
                  let rmcBCR = document.querySelector('.overlay-button.geo-location-control')?.getBoundingClientRect();
                  if(rmcBCR !== undefined)
                  {
                     if((rmcBCR.bottom + 80) > yBase)
                     {
                        yBase = rmcBCR.bottom + 80;
                     }
                  }
               }
               let shiftY = tY + yBase - staBCR.bottom;

               staElm.style.transform = "translate(" + shiftX + "px, " + shiftY + "px)";
               staElm.touchedByFUME = mBCR;
            }
         }
      }
      else
      {
         // If the user switches the option off, clear the styling overrides to reinstate the
         // original size/position of the button, and remove the attribute used to indicate
         // that the mods have been applied
         if(staTouched === true)
         {
            let textElm = staElm.querySelector('.text');
            if(textElm !== null)
            {
               textElm.style.removeProperty("display");
            }
            staElm.style.removeProperty("padding-left");
            staElm.style.removeProperty("padding-right");
            staElm.style.removeProperty("min-width");
            staElm.style.removeProperty("transform");
            staElm.touchedByFUME = undefined;
         }
      }
   }
   function BOH_CheckSnackbarText()
   {
      let sbElm = document.querySelector('#snackbar');
      if(sbElm !== null)
      {
         let iText = sbElm.innerText;
         if(iText === "")
         {
            window.setTimeout(BOH_CheckSnackbarText, 1);
         }
         else if(iText !== I18n.lookup("drawing.guidance_snackbar"))
         {
            // Once we know this snackbar notification isn't the one we want to
            // hide, display it to the user as if nothing had happened
            sbElm.style.display = "";
         }
         else
         {
            // no action required
         }
      }
   }
   function BOH_SuppressTheSnackbar()
   {
      if(getById('_cbInhibitSnackbar').checked === true)
      {
         let sbElm = document.querySelector('#snackbar');
         if(sbElm !== null)
         {
            if(sbElm.touchedByFUME === undefined)
            {
               // Invert the suppression logic to avoid brief flashes of the notification
               // banner whilst we wait for its contents to be rendered - if we hide it as
               // soon as the bare banner is shown, and then *un*hide it once we've been
               // able to determine that it contains something we still want to show the
               // user, this has the effect of simply marginally increasing the delay before
               // it's shown at all, as opposed to the more visually intrusive effect of
               // seeing it briefly flicker into view before disappearing again...
               sbElm.style.display="none";
               sbElm.touchedByFUME = true;               
               window.setTimeout(BOH_CheckSnackbarText, 1);
            }
         }
      }
   }
   function BOH_ApplyMTETweaks()
   {
      let mteDD = document.querySelector('#closure_eventId');

      if(mteDD !== null)
      {
         let eventText = mteDD?.selectBox?.innerText;
         let canTame = ((eventText !== undefined) && (eventText !== ""));
         if(canTame === true)
         {
            let MTEs = mteDD.querySelectorAll('wz-option');
            let hideExpired = getChecked("_cbHideExpiredMTEs");
            let hideOlder = getChecked("_cbHideOlderMTEs");
            let hideOthers = getChecked("_cbHideOtherEditorMTEs");
            let maxAge = getById("_inpMaxMTEAge").value;
            let tsNow = Date.now();
            let userID = W.loginManager.user.attributes.id;

            for(let i = 0; i < MTEs.length; ++i)
            {
               let mteID = MTEs[i]?.attributes?.value?.value;
               if(mteID !== undefined)
               {
                  let mteTitle = '';
                  let mteCacheIdx = FindMTEInCache(mteID);
                  if(mteCacheIdx !== null)
                  {
                     let mteObj = mteCache[mteCacheIdx];
                     let hideMTE = false;

                     if(hideExpired === true)
                     {
                        let mteEnd = new Date(mteObj.endDate);
                        if(mteEnd < tsNow)
                        {
                           hideMTE = true;
                        }
                     }
                     if((hideMTE === false) && (hideOlder === true))
                     {
                        let mteTS = new Date(mteObj.createdOn);
                        let mteAge = (tsNow - mteTS) / (1000 * 60 * 60 * 24);
                        if(mteAge > maxAge)
                        {
                           hideMTE = true;
                        }
                     }
                     if((hideMTE === false) && (hideOthers === true))
                     {
                        if((mteObj.createdBy !== userID) && (mteObj.updatedBy !== userID))
                        {
                           hideMTE = true;
                        }
                     }
                     
                     if(hideMTE === true)
                     {
                        MTEs[i].style.display = 'none';
                     }
                     else
                     {
                        let mteUserObj = W.model.users.getByIds([mteObj.createdBy]);
                        let mteCreator = 'Unknown';
                        if(mteUserObj.length === 1)
                        {
                           mteCreator = mteUserObj[0].attributes.userName;
                        }

                        mteTitle = "(" + mteCreator + ") " + mteObj.startDate + " to " + mteObj.endDate;
                     }
                  }
                  else
                  {
                     mteTitle = "MTE details not found...";
                  }
                  MTEs[i].title = mteTitle;
               }
            }

            // Reapply the dropdown styling now we know the MTE dropdown has stopped changing...
            RestyleDropDownEntries();
         }
         else
         {
            window.setTimeout(BOH_ApplyMTETweaks, 100);
         }
      }
   };   
   function BOH_TameMTEDropdown()
   {
      let mteDD = document.querySelector('#closure_eventId');
      let mteDDEnabled = false;
      if(mteDD !== null)
      {
         mteDDEnabled = (mteDD.disabled === false);
      }
      if(mteDDEnabled === true)
      {
         // Yet more changes to how the MTE dropdown is rendered, so now we wait until the
         // mutation observer tells us the dropdown has been enabled - this will be the last
         // mutation triggered by WME altering the dropdown contents - and *then* we revert
         // to ye olde polled checking of the contents until we see what we need...
         window.setTimeout(BOH_ApplyMTETweaks, 100);
      }
   }



   // Top-level observer for basically *anything* that changes within the DOM...
   var BodyObserver = new MutationObserver(function (mutations)
   {
      // To avoid performance issues if there's a frequently changing DOM element that we really
      // don't care about - e.g. the coordinate readout - check to see what changes triggered
      // this call to the observer, and only run through the handlers if one or more of the
      // changes were on things we can't ignore
      let skip = true;
      for(let i = 0; i < mutations.length; ++i)
      {
         let skipThis = (mutations[i].target.className == "wz-map-ol-control-span-mouse-position");
         skipThis = skipThis || (mutations[i].target.id == "oslNamesDiv");
         skipThis = skipThis || (mutations[i].target.id == "uroAMList");

         skip = skip && skipThis;
      }
      
      if(skip === false)
      {
         BOH_SuppressTooltips();
         BOH_RestyleTurnPopup();
         BOH_AdjustMeasureTool();
         BOH_EntryPointHandler();
         BOH_SegmentPanelMods();
         BOH_MoveSearchThisArea();
         RestyleDropDownEntries();
         AddCollapsiblePasses();
         EPObserver();
         DisableUITransitions();
         RTCArrowsFix();
         BOH_SuppressTheSnackbar();
         BOH_TameMTEDropdown();
      }
   });

   function EPObserver()
   {
      // Modify the rendering of the external providers list, so that each result is
      // shown in full, spanning multiple lines as required to show all the details
      // rather than truncating them and risking confusion over which result is which...

      // Only continue if the list is being shown
      let acMenu = document.getElementsByClassName('external-provider-edit-form')[0];
      if (acMenu == undefined) return;
      let acInner = acMenu.getElementsByTagName('wz-autocomplete')[0];
      if (acInner == undefined) return;

      // It is, so let's get tweaking...
      let acEntries = acInner.shadowRoot.querySelectorAll('wz-menu-item');
      if (acEntries.length != 0)
      {
         for (let i of acEntries)
         {
            // To accommodate suggestions that wrap onto 3+ lines, we need to remove the
            // height styling from the main menu item plus its child elements, so that each
            // entry can expand as needed to keep all of the text visible
            SetStyle(i, "--wz-menu-option-height", "auto", false);
            let wai = i.querySelector('.wz-autocomplete-item');
            SetStyle(wai, "height", "auto", false);
            SetStyle(wai, "padding-top", "2px", false);
            SetStyle(wai, "padding-bottom", "2px", false);

            // Most of the restyling fun takes place on this child element within the
            // list element
            let acText = i.querySelector('.wz-string-wrapper.primary-text');
            if(acText !== null)
            {
               // Restore some sanity to the entries, so we can see exactly what they
               // say and therefore know what it is we're selecting - UI Design 101...
               SetStyle(acText, "overflow", "visible", false);
               SetStyle(acText, "overflow", "visible", false);
               SetStyle(acText, "lineHeight", "100%", false);
               SetStyle(acText, "display", "block", false);
               SetStyle(acText, "whiteSpace", "normal", false);

               // And just for shits and giggles, the late April WME update now places each and every
               // character within an entry in its own childnode of that entry, so that styling can be
               // applied to each character individually...  As this messes up the entry lineheight
               // styling which used to be all that was needed to get things looking good here, we now
               // ALSO need to override the native styling on these child nodes.  What next devs, an
               // individual node for each pixel of each character???
               let acChars = acText.childNodes;
               for (let j of acChars)
               {
                  SetStyle(j, "lineHeight", "100%", false);
               }
            }

            // We also need to tweak the shadowroot version of the menu item itself, to
            // adjust the height style to prevent the item failing to grow tall enough
            // to fully accommodate 3+ line entries
            let srMenuItems = i.shadowRoot.querySelector('.wz-menu-item');
            SetStyle(srMenuItems, "height", "auto", false);
         }
      }

      // Having messed with whichever elements we found this time around, poll again
      // to account for the user continuing to type in the search box causing the
      // list to be regenerated with differing entries.  As we only get this far into
      // the function if the list is still visible, as soon as the user finishes their
      // search and the list is removed, the polling will stop until the next time
      // the MO fires - part-time polling, I can live with that if the alternative is
      // leaving the list entries in a sometimes unuseable state due to the odd
      // choice of native styles...
      window.setTimeout(EPObserver, 100);
   }
   function newSaveMode()
   {
      let sm = sdk.Editing.getCurrentSaveMode();
      if (sm === "IDLE")
      {
         float();
      }
   }
   function init1()
   {
      logit("Starting init1", "debug");

      if (W === undefined)
      {
         window.setTimeout(init1, 100);
         return;
      }

      logit("Initialising...");

      isBeta = (window.location.href.indexOf("//beta.waze") !== -1);
      if(isBeta === false)
      {
         // Get the interceptor set up ASAP, to reduce the risk of missing any MTE
         // details pulled in by WME as part of its own early startup processes
         setupFetchIntercept();
      }

      if (W.userscripts?.state?.isReady)
      {
         init1Finalise();
      }
      else
      {
         document.addEventListener("wme-ready", init1Finalise, { once: true });
      }
   }
   function init1Finalise()
   {
      sdk = getWmeSdk({scriptId:"fume",scriptName:"FUME"});

      if(isBeta === false)
      {
         addMyTab();
      }
      else
      {
         disableKinetic();
      }
   }
   function checkSelectableItemInURL()
   {
      let i = urlSelectableItems.length;
      let rType = null;
      while (i > 0)
      {
         --i;
         let checkFor = urlSelectableItems[i][0];
         if (location.search.match(checkFor))
         {
            rType = urlSelectableItems[i];
            break;
         }
      }
      return rType;
   }
   function searchSelectableItemsInURL(typeStr)
   {
      return location.search.match(new RegExp("[?&]" + typeStr + "?=([^&]*)"));
   }
   function getSelectableItemTotalFromURL()
   {
      let itemType = checkSelectableItemInURL();
      let nItems = 0;
      if (itemType !== null)
      {
         let match = searchSelectableItemsInURL(itemType[0]);
         nItems = decodeURIComponent(match[1]).split(',').length;
      }
      return nItems;
   }
   function reinstateAddMenu()
   {
      let menuElm = document.querySelector("[class^='menu--']");
      menuElm.style.display = "";
   }
   function killAddMenuOpenOnMouseOver2()
   {
      let menuElm = document.querySelector("[class^='menu--']");

      // Due to the way the menu gets rendered, we need to keep
      // checking for the presence of the "expanded" attribute that
      // WME natively uses to display the menu, and remove it until
      // it no longer gets added
      if(menuElm.expanded == true)
      {
         menuElm.removeAttribute("expanded");
         window.setTimeout(killAddMenuOpenOnMouseOver2, 1);
      }
      // Only once the attribute is no longer present can we then move
      // onto the final stage of our menu handling, by removing our
      // styling override (after a suitably short pause to let things
      // settle down in the rendering pipeline), so that a click on the
      // icon will allow the menu to be shown as desired.
      else
      {
         window.setTimeout(reinstateAddMenu, 100);
      }
   }
   function killAddMenuOpenOnMouseOver()
   {
      if(getById('_cbInhibitAddMenuAutoshow').checked === true)
      {
         // On mousing-over the "add something" menu icon, set a display="none" style
         // for the pop-out menu element, to prevent it being displayed by mousing-over
         // the icon.
         let menuElm = document.querySelector("[class^='menu--']");
         menuElm.style.display="none";

         // Having now hidden the menu, we need to setup the handlers that allow it to
         // be shown when we click on the icon...
         killAddMenuOpenOnMouseOver2();
      }
      else
      {
         reinstateAddMenu();
      }
   }
   function init2()
   {
      logit("Starting init2", "debug");
      if (W.userscripts === undefined)
      {
         //go round again if my tab isn't there yet
         if (!getById('sidepanel-FixUI'))
         {
            logit("Waiting for my tab to appear...", "warning");
            setTimeout(init2, 200);
            return;
         }
      }

      // setup event handlers for my controls:
      getById('_cbMoveZoomBar').onclick = createZoomBar;
      getById('_cbMoveSearchAreaButton').onclick = BOH_MoveSearchThisArea;
      getById('_cbMoveChatIcon').onclick = moveChatIcon;
      getById('_cbHighlightInvisible').onclick = highlightInvisible;
      getById('_cbDarkenSaveLayer').onclick = darkenSaveLayer;
      getById('_cbSwapRoadsGPS').onclick = swapRoadsGPS;
      getById('_cbShowMapBlockers').onclick = showMapBlockers;
      getById('_cbShrinkTopBars').onclick = shrinkTopBars;
      getById('_cbCompressSidebar').onclick = compressSidebar;
      getById('_cbCompressLayersMenu').onclick = compressLayersMenu;
      getById('_cbLayersColumns').onclick = compressLayersMenu;
      getById('_cbRestyleReports').onclick = restyleReports;
      getById('_cbNarrowSidePanel').onclick = narrowSidePanel;
      getById('_inpUICompression').onchange = applyEnhancements;
      getById('_inpUIContrast').onchange = applyEnhancements;
      getById('_inpDateFormat').onchange = applyDateFormat;
      getById('_cbResizeSearchBox').onclick = resizeSearch;
      getById('_cbInhibitAddMenuAutoshow').onclick = killAddMenuOpenOnMouseOver;

      getById('_inpASX').onchange = shiftAerials;
      getById('_inpASX').onwheel = shiftAerials;
      getById('_inpASY').onchange = shiftAerials;
      getById('_inpASY').onwheel = shiftAerials;
      getById('_inpASO').onchange = shiftAerials;
      getById('_inpASO').onwheel = shiftAerials;
      getById('_inpASXO').onchange = shiftAerials;
      getById('_inpASXO').onwheel = shiftAerials;
      getById('_inpASYO').onchange = shiftAerials;
      getById('_inpASYO').onwheel = shiftAerials;
      getById('_inpASOO').onchange = shiftAerials;
      getById('_inpASOO').onwheel = shiftAerials;

      getById('_resetAS').onclick = function ()
      {
         getById('_inpASX').value = 0;
         getById('_inpASY').value = 0;
         getById('_inpASXO').value = 0;
         getById('_inpASYO').value = 0;
         shiftAerials();
      };
      getById('_inpGSVContrast').onchange = adjustGSV;
      getById('_inpGSVBrightness').onchange = adjustGSV;
      getById('_cbGSVInvert').onchange = adjustGSV;
      getById('_inpGSVWidth').onchange = GSVWidth;
      getById('_cbDisableBridgeButton').onchange = disableBridgeButton;
      getById('_cbDisablePathButton').onchange = disablePathButton;
      getById('_cbDisableHazardMarkers').onchange = disableHazardMarkers;
      getById('_btnKillNode').onclick = killNode;
      getById('_cbDisableKinetic').onclick = disableKinetic;
      getById('_cbDisableScrollZoom').onclick = disableScrollZoom;
      getById('_cbDisableZoomAnimation').onclick = disableAnimatedZoom;
      getById('_cbDisableSaveBlocker').onclick = disableSaveBlocker;
      getById('_cbColourBlindTurns').onclick = colourBlindTurns;
      getById('_cbUnfloatButtons').onclick = unfloatButtons;
      getById('_cbMoveUserInfo').onclick = moveUserInfo;
      getById('_cbHackGSVHandle').onclick = hackGSVHandle;
      getById('street-view-drag-handle').ondblclick = GSVWidthReset;
      getById('_cbEnlargeGeoNodes').onclick = enlargeGeoNodes;
      getById('_inpEnlargeGeoNodes').onchange = enlargeGeoNodes;
      getById('_cbEnlargeGeoHandlesFU').onclick = enlargeGeoHandles;
      getById('_inpEnlargeGeoHandles').onchange = enlargeGeoHandles;
      getById('_cbEnlargePointMCs').onclick = enlargePointMCs;
      getById('_inpEnlargePointMCs').onchange = enlargePointMCs;
      getById('_cbEnlargeTurnClosures').onclick = enlargeTurnClosures;
      getById('_inpEnlargeTurnClosures').onchange = enlargeTurnClosures;
      getById('_cbEnlargeNodeClosures').onclick = enlargeNodeClosures;
      getById('_inpEnlargeNodeClosures').onchange = enlargeNodeClosures;

      // Add onclick handler to the dontShowAgain container if it exists
      let dsaElm = getById('FUME_DSA');
      if(dsaElm !== null)
      {
         dsaElm.onclick = DSIclicked;
      }

      //REGISTER WAZE EVENT HOOKS

      // events for Aerial Shifter
      W.map.events.register("zoomend", null, shiftAerials);
      W.map.events.register("moveend", null, shiftAerials);
      W.map.getLayerByUniqueName('satellite_imagery').events.register("loadend", null, shiftAerials);
      // events to change menu bar color based on map comments checkbox
      W.map.events.register("zoomend", null, warnCommentsOff);
      W.map.events.register("moveend", null, warnCommentsOff);
      // event to remove the overlay that blocks the sidebar UI if you zoom out too far
      W.map.events.register("zoomend", null, unblockSidePanel);
      // events to adjust the "Search this area" z-index so it gets rendered behind the drop-down menus
      W.map.events.register("zoomend", null, moveSearchThisArea);
      W.map.events.register("moveend", null, moveSearchThisArea);
      // event to re-hack my zoom bar if it's there
      W.map.getLayerByUniqueName("BASE_LAYER").events.register("loadend", null, ZLI);
      //window resize event to resize layers menu
      window.addEventListener('resize', compressLayersMenu, true);
      //window resize event to reapply zoombar fix
      window.addEventListener('resize', ZLI, true);
      //window resize event to resize search box
      window.addEventListener('resize', resizeSearch, true);

      //anything we might need to do when the mouse moves...
      W.map.events.register("mousemove", null, mouseMove);


      let tEvt = Object.assign({}, W.editingMediator._events['change:saveMode'][0]);
      tEvt.callback = newSaveMode;
      W.editingMediator._events['change:saveMode'].push(tEvt);

      // event handlers to help with the weird change log visibility problem...
      document.querySelector('#save-button').addEventListener('mouseover', saveMouseOver, true);
      document.querySelector('#save-button').addEventListener('mouseout', saveMouseOut, true);

      //window resize event to refloat the sharing box in the correct location
      window.addEventListener('resize', unfloat, true);

      W.prefs.on('change:compactDensity', function()
      {
         shrinkTopBars();
      });

      document.querySelector("[class^='menuContainer']").addEventListener("mouseenter", killAddMenuOpenOnMouseOver);

      //create Aerial Shifter warning div
      var ASwarning = document.createElement('div');
      ASwarning.id = "WMEFU_AS";
      ASwarning.innerHTML = modifyHTML("Aerials Shifted");
      ASwarning.setAttribute('style', 'top:20px; left:0px; width:100%; position:absolute; z-index:10000; font-size:100px; font-weight:900; color:rgba(255, 255, 0, 0.4); text-align:center; pointer-events:none; display:none;');
      getById("WazeMap").appendChild(ASwarning);

      loadSettings();

      //create Permalink Count div
      var WMEPC_div = document.createElement('div');
      var WMEPC_div_sub = document.createElement('div');
      WMEPC_div.id = "WMEFUPC";
      WMEPC_div.classList.add("toolbar-button", "toolbar-button-with-icon");
      WMEPC_div.title = "Number of selectable map objects in the URL\nClick to reselect them.";
      WMEPC_div.style.cursor = "pointer";
      WMEPC_div_sub.classList.add("item-container", "WMEFU-toolbar-button");
      WMEPC_div_sub.innerHTML = modifyHTML('<span class="item-icon" style="display:inline-flex"><i style="margin-top:8px" class="fa fa-link WMEFUPCicon"></i>&nbsp;' + getSelectableItemTotalFromURL() + '</span>');
      WMEPC_div.appendChild(WMEPC_div_sub);
      insertNodeBeforeNode(WMEPC_div, getById('search-autocomplete'));
      WMEPC_div.onclick = PCclicked;

      // overload the window unload function to save my settings
      window.addEventListener("beforeunload", saveSettings, false);
      // Alert to new version
      if (oldVersion != fumeVersion)
      {
         let releaseNotes = "Version " + fumeVersion + " (" + fumeDate + ") release notes<br><br>";
         releaseNotes += "<ul>";
         for (let i = 0; i < newVersionNotes.length; ++i)
         {
            releaseNotes += "<li>" + newVersionNotes[i];
         }
         releaseNotes += "</ul>";
         abShowAlertBox('fa-info-circle', 'WME Fix UI Memorial Edition', releaseNotes, false, "OK", "", null, null);
         saveSettings();
      }
      // fix for sidebar display problem in Safari, requested by edsonajj
      var isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
      if (isSafari)
      {
         addGlobalStyle('.flex-parent { height: 99% !important; }');
      }
      // stop wobbling status bar
      addGlobalStyle('.WazeControlMousePosition { font-family: monospace }');
      // move closed node icon below node markers
      // apply the settings
      shiftAerials();

      applyDateFormat();

      window.setTimeout(applyAllSettings, 1000);

      logit("Initialisation complete");
   }
   function setupFetchIntercept()
   {
      logit("setup interceptor");

      // https://stackoverflow.com/questions/45425169/intercept-fetch-api-requests-and-responses-in-javascript  
      const origFetch = window.fetch;
      window.fetch = async (...args) => 
      {
         let [resource, config ] = args;
         const response = await origFetch(resource, config);

         // Intercept any response which might include MTE details
         if(response.url !== undefined)
         {
            if((response.url.indexOf('Features') != -1) || (response.url.indexOf('MajorTrafficEvents') != -1))
            {
               response
               .clone()
               .json()
               .then(body => ParseFeaturesResponse(body));
            }
         }

         // This is a transparent interception, so all responses are passed back to WME without modification
         return response;
      };
   }   
   function ParseFeaturesResponse(body)
   {
      // If the features response contains details of any MTEs, check to see if they're
      // already in our local cache, and add them if they aren't...
      if(body?.majorTrafficEvents?.objects !== undefined)
      {
         for(let i  = 0; i < body.majorTrafficEvents.objects.length; ++i)
         {
            let mte = body.majorTrafficEvents.objects[i];
            if(FindMTEInCache(mte.id) === null)
            {
               mteCache.push(mte);
            }
         }
      }
   }
   function FindMTEInCache(mteID)
   {
      let retval = null;
      for(let j = 0; j < mteCache.length; ++j)
      {
         if(mteCache[j].id === mteID)
         {
            retval = j;
            break;
         }
      }
      return retval;
   }
   function applyDateFormat()
   {
      let df = getById('_inpDateFormat').value;
      let long = null;
      let long_with_time = null;


      if (df == 2)
      {
         long = "%a %Y-%m-%d, %H:%M";
         long_with_time = "%a %Y-%m-%d %H:%M";
      }
      else if (df == 1)
      {
         long = "%a %d-%m-%Y, %H:%M";
         long_with_time = "%a %d-%m-%Y %H:%M";
      }
      else
      {
         long = "%a %m-%d-%Y, %H:%M";
         long_with_time = "%a %m-%d-%Y %H:%M";
      }

      // Adjust the date string format used in the drives tab...
      I18n.translations[I18n.currentLocale()].date.formats.long_with_time = long_with_time;
      // ...and similarly in the edit history entries
      I18n.translations[I18n.currentLocale()].date.formats.long = long;
   }
   let wasDrawing = null;
   function mouseMove()
   {
      // Temporarily disable the Enlarge geo/junction nodes and Enlarge geo handles options
      // when drawing new geometry, to avoid the enlarged nodes/handles on other geometry
      // objects getting in the way of the new object being drawn...
      let isDrawing = sdk.Editing.isDrawingInProgress();
      if (isDrawing != wasDrawing)
      {
         enlargeGeoNodes(isDrawing);
         enlargeGeoHandles(isDrawing);
         wasDrawing = isDrawing;
      }
   }
   function unblockSidePanel()
   {
      // I can see why the devs thought blocking access to the sidepanel UI might make sense at wider
      // zoom levels, given that you can't select any map elements or therefore do any editing.  
      // The problem is that this blocking applies to ALL of the sidepanel tabs, including those which
      // COULD be useful regardless of the zoom level - drives, edit areas and userscripts...
      //
      // This one-liner simply kills the blocking overlay if it's present, restoring access to the
      // sidebar UI at all zoom levels.
      document.querySelector(".overlay.editingDisabled")?.remove();
   }
   function createTabHTML()
   {
      let innerHTML = "";
      innerHTML += '<b title="Shift aerial images layer to match GPS tracks and reduce image opacity">Aerial Shifter</b>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;';
      innerHTML += '<span class="fa fa-power-off" id="_resetAS" title="Clear X/Y offsets"></span><br>';
      innerHTML += '<div>' + I18n.lookup('layer_switcher.togglers.ITEM_SATELLITE_IMAGERY') + '</div>';
      innerHTML += '<div style="display:inline-block; padding-left:10px;"><input type="number" id="_inpASX" title="horizontal shift" max=300 min=-300 step=1 style="height:20px; width:50px;text-align:right;"/><b>m</b><span class="fa fa-arrow-right"></span></div>';
      innerHTML += '<div id="as2" style="display:inline-block;padding:0 5px;"><input type="number" id="_inpASY" title="vertical shift" max=300 min=-300 step=1 style="height:20px; width:50px;text-align:right;"/><b>m</b><span class="fa fa-arrow-up"></span></div>';
      innerHTML += '<div id="as3" style="display:inline-block"><input type="number" id="_inpASO" title="opacity" max=100 min=10 step=10 style="height:20px; width:50px;text-align:right;"/><b>%</b><span class="fa fa-adjust"></span></div>';
      innerHTML += '<div>' + I18n.lookup('layer_switcher.togglers.GROUP_IMAGERY') + '</div>';
      innerHTML += '<div style="display:inline-block; padding-left:10px;"><input type="number" id="_inpASXO" title="horizontal shift" max=300 min=-300 step=1 style="height:20px; width:50px;text-align:right;"/><b>m</b><span class="fa fa-arrow-right"></span></div>';
      innerHTML += '<div id="as4" style="display:inline-block;padding:0 5px;"><input type="number" id="_inpASYO" title="vertical shift" max=300 min=-300 step=1 style="height:20px; width:50px;text-align:right;"/><b>m</b><span class="fa fa-arrow-up"></span></div>';
      innerHTML += '<div id="as5" style="display:inline-block"><input type="number" id="_inpASOO" title="opacity" max=100 min=10 step=10 style="height:20px; width:50px;text-align:right;"/><b>%</b><span class="fa fa-adjust"></span></div>';

      innerHTML += '<br>';
      innerHTML += '<br>';

      innerHTML += '<b title="Adjust contrast, brightness, colours & width for Google Street View images">GSV image adjust</b><br>';
      innerHTML += '<span title="Contrast"><input type="number" id="_inpGSVContrast" max=200 min=25 step=25 style="height:20px; width:46px;text-align:right;"/><b>%</b><span class="fa fa-adjust"></span></span>&nbsp;&nbsp;';
      innerHTML += '<span title="Brightness"><input type="number" id="_inpGSVBrightness" max=200 min=25 step=25 style="height:20px; width:46px;text-align:right;"/><b>%</b><span class="fa fa-sun-o"></span></span>&nbsp;&nbsp;';
      innerHTML += '<span title="Invert colours"><input type="checkbox" id="_cbGSVInvert"/><span class="fa fa-tint"></span></span>&nbsp;&nbsp;';
      innerHTML += '<span title="Default width"><input type="number" id="_inpGSVWidth" max=90 min=10 step=10 style="height:20px; width:46px;text-align:right;"/><b>%</b><span class="fa fa-arrows-h"></span></span>&nbsp;&nbsp;&nbsp;';

      innerHTML += '<br>';
      innerHTML += '<br>';

      innerHTML += '<b>UI Enhancements</b><br>';
      innerHTML += '<input type="checkbox" id="_cbShrinkTopBars" /> ' +
         '<span title="Because we can\'t afford to waste screen space, particularly on\nstuff we didn\'t ask for and don\'t want, like the black bar.\nAnd why does the reload button have a re-do icon?!">Compress/enhance bars above the map</span><br>';
      innerHTML += '<input type="checkbox" id="_cbCompressSidebar" /> ' +
         '<span title="Because I\'m sick of having to scroll the side panel because of oversized fonts and wasted space">Compress/enhance side panel contents</span><br>';
      innerHTML += '<input type="checkbox" id="_cbCompressLayersMenu" /> ' +
         '<span title="Because it\'s already too big for small screens and Waze only plan to make it bigger">Compress/enhance layers menu</span><br>';
      innerHTML += '<span id="layersColControls"><input type="checkbox" id="_cbLayersColumns" /> ' +
         '<span title="Widen the layers menu to 2 columns - particulary for netbook users\nWon\'t work without some compression turned on">Two-column layers menu</span><br></span>';
      innerHTML += '<input type="checkbox" id="_cbRestyleReports" /> ' +
         '<span title="Another UI element configured for developers with massive screens instead of normal users">Compress/enhance report panels (UR/MP)</span><br>';
      innerHTML += '<input type="checkbox" id="_cbNarrowSidePanel" /> ' +
         '<span title="If you have a netbook, Waze isn\'t interested in your experience.\nYou need every bit of map space you can get - so have a present from me!">Reduce width of the side panel</span><span title="This will definitely interfere with scripts that rely on a fixed width for their tab contents." style="font-size: 16px; color: red;">&#9888</span><br>';
      innerHTML += '<br>';
      innerHTML += '<b title="Control the amount of compression/enhancment">UI Enhancement controls</b><br>';
      innerHTML += '<div style="display:inline-block"><select id="_inpUICompression" title="Compression enhancement" style="height:20px; padding:0px; border-radius=0px;"><option value="2">High</option><option value="1">Low</option><option value="0">None</option></select><span class="fa fa-compress"></span></div>&nbsp;&nbsp;&nbsp;&nbsp;';
      innerHTML += '<div style="display:inline-block"><select id="_inpUIContrast" title="Contrast enhancement" style="height:20px; padding:0px; border-radius=0px;"><option value="2">High</option><option value="1">Low</option><option value="0">None</option></select><span class="fa fa-adjust"></span></div>';
      innerHTML += '<br>';
      innerHTML += '<button id="_btnKillNode" style = "height: 18px; margin-top: 5px;" title="Hide the junction nodes layer to allow access to Map Comments hidden under nodes.\nThis stays in effect until the page is zoomed/panned/refreshed.">Hide junction nodes</button>&nbsp;&nbsp;';

      innerHTML += '<br><br>';

      innerHTML += '<b>UI Fixes/changes</b><br>';

      innerHTML += '<input type="checkbox" id="_cbHideExpiredMTEs" /> ' +
         '<span title="Hides MTEs in the dropdown if their end date is in the past">Hide expired MTEs</span><br>';
      innerHTML += '<input type="checkbox" id="_cbHideOlderMTEs" /> ' +
         '<span title="Hides MTEs older than the given age from the dropdown, because who wants to scroll\n' +
                        'through hundreds of entries to find the one you need, only to then select the wrong\n' + 
                        'one anyway because of how many have the same or similar name...">Hide older MTEs</span>' + 
         '<div style="display:inline-block">&nbsp;&nbsp;<input type="number" id="_inpMaxMTEAge" title="Max age (days) for MTE to remain visible" max=500 min=1 step=1 style="height:16px; padding:0 0 0 2px;; border:1px solid; width:37px;"/></div><br>';
      innerHTML += '<input type="checkbox" id="_cbHideOtherEditorMTEs" /> ' +
         '<span title="Hides MTEs in the dropdown unless they were created or last updated by me">Show only my MTEs</span><br>';

      innerHTML += '<input type="checkbox" id="_cbHideSegmentPanelLabels" /> ' +
         '<span title="Hide the labels in the segment sidepanel,\nbecause there are more important things to display in that precious space.">Hide segment sidepanel labels</span><br>';
      innerHTML += '<input type="checkbox" id="_cbTameSegmentTypeMenu" /> ' +
         '<span title="Do away with all the wasted space in the segment type menu,\nso that we can select types without having to scroll.">Tame segment type menu</span><br>';
      innerHTML += '<input type="checkbox" id="_cbTameElevationMenu" /> ' +
         '<span title="Do away with all the wasted space and unlikely to ever be used option in the elevation menu,\nso that we can select the ones we DO use without having to scroll.">Tame elevation menu</span><br>';
      innerHTML += '<input type="checkbox" id="_cbTameHNButtonPopup" /> ' +
         '<span title="Hide all those tooltip popups which might be useful the first once or twice you see them, but just start to get in the way after that">Tame tooltip popups</span><br>';
      innerHTML += '&nbsp;<input type="checkbox" id="_cbAllowEditorPopup" /> ' +
         '<span title="...except for the ones on live user icons, they can be useful">Keep live user icon popups</span><br>';
      innerHTML += '<input type="checkbox" id="_cbInhibitAddMenuAutoshow" /> ' +
         '<span title="Stops the add a new map element menu from popping into view the second you mouse-over its sidepanel icon">Tame add map element menu popup</span><br>';

      innerHTML += '<input type="checkbox" id="_cbInhibitTurnPopup" /> ' +
         '<span title="Prevent the popup menu appearing when mousing-over a turn arrow">Disable turn popup</span><br>';
      innerHTML += '<input type="checkbox" id="_cbInhibitUTurnPopup" /> ' +
         '<span title="Prevent the popup menu appearing when mousing-over a u-turn arrow">Disable u-turn popup</span><br>';

      innerHTML += '<input type="checkbox" id="_cbInhibitSnackbar" /> ' +
         '<span title="Because seasoned editors don\'t need constant reminders like this...">Disable start/end edit reminder</span><br>';

      innerHTML += '<input type="checkbox" id="_cbRemoveRoutingReminder" /> ' +
         '<span title="Remove the \'Segment will be used as\' message under the Routing buttons.">Remove segment routing message</span><br>';
      innerHTML += '<input type="checkbox" id="_cbReEnableSidePanel" /> ' +
         '<span title="Re-enable the side panel at wider zoom levels,\nbecause contrary to what the WME devs seem to think,\nthere is quite a lot you can still do there.">Re-enable side panel at wider zooms</span><br>';
      innerHTML += '<input type="checkbox" id="_cbResizeSearchBox" /> ' +
         '<span title="Allows the search box to use all the dead space in the top bar">Expand search box</span><br>';
      innerHTML += '<input type="checkbox" id="_cbMoveZoomBar" /> ' +
         '<span title="Because nobody likes a pointless UI change that breaks your workflow,\nimposed by idiots who rarely use the editor and don\'t listen to feedback.\nNO MATTER HOW HARD THEY TRY, I WILL BRING IT BACK!">Re-create zoom bar & move map controls</span><br>';
      innerHTML += '<input type="checkbox" id="_cbMoveSearchAreaButton" /> ' +
         '<span title="Shrink the \'search this area\' button, and relocate it next to the sidepanel">Shrink/move search this area button</span><br>';
      innerHTML += '<input type="checkbox" id="_cbFixExternalProviders" /> ' +
         '<span title="The External Providers interface has a description box that will only show one line of text.\nThis fixes that.">Expand External Provider details for places</span><br>';
      innerHTML += '<input type="checkbox" id="_cbMoveChatIcon" /> ' +
         '<span title="Here\'s a truly outstanding example of making a stupid change to the UI in order to\ndeal with another stupid change to the UI!\nBecause HQ couldn\'t make the new layers menu auto-hide, they moved the chat icon.\nTick this box to put it back where it belongs.">Move Chat icon back to right</span><br>';
      innerHTML += '<input type="checkbox" id="_cbHighlightInvisible" /> ' +
         '<span title="Typical WME design - the chat icon changes when you\'re invisible,\nbut the change is practically invisible!\nThis option provides a more obvious highlight.">Highlight invisible mode</span></span><br>';
      innerHTML += '<input type="checkbox" id="_cbDarkenSaveLayer" /> ' +
         '<span title="It\'s not bad enough they\'ve removed all the contrast to give you eyestrain,\nbut then they blind you every time you save. ">Darken screen overlay when saving</span><br>';
      innerHTML += '<input type="checkbox" id="_cbSwapRoadsGPS" /> ' +
         '<span title="Guess what? Waze thinks the GPS layer should now be over the segments layer.\nWhy should you have any choice about that?">Move GPS layer below segments layer</span><br>';
      innerHTML += '<input type="checkbox" id="_cbShowMapBlockers" /> ' +
         '<span title="Some WME elements block access to the map layers. These problems have been reported as bugs.\nUntil they\'re fixed, this functions makes them visible.">Show map-blocking WME bugs</span></span><br>';
      innerHTML += '<input type="checkbox" id="_cbDisableBridgeButton" /> ' +
         '<span title="The Bridge button is rarely useful, but often used incorrectly.\nIt\'s best to keep it disabled unless you need it.">Disable Bridge button</span><br>';
      innerHTML += '<input type="checkbox" id="_cbDisablePathButton" /> ' +
         '<span title="The far turn button seems to be an accidental click-magnet, making it all\ntoo easy to accidentally set a path without noticing until after you save...\nUse this option to disable it and avoid the embarrassment">Disable Far Turn button</span><br>';
      innerHTML += '<input type="checkbox" id="_cbDisableHazardMarkers" /> ' +
         '<span title="The new permanent hazard markers can get a bit in the way, and whilst \nWME allows you to turn them off, it would also be nice to simply dim/deactivate them as per turn arrows.\nThis option lets you do just that...">Disable Hazard Markers</span><br>';
      innerHTML += '<div style="display:inline-block"><select id="_inpDateFormat" title="Date format" style="height:20px; padding:0px; border-radius=0px;"><option value="2">Y/M/D</option><option value="1">D/M/Y</option><option value="0">M/D/Y</option></select></div>&nbsp;&nbsp;&nbsp;&nbsp;' +
         '<span title="Now YOU get to choose the sidepanel date format">Sidepanel date format</span><br>';
      innerHTML += '<input type="checkbox" id="_cbDisableKinetic" /> ' +
         '<span title="Kinetic panning is a new WME feature: if you release the mouse whilst dragging the map,\nthe map will keep moving. It can be very useful for panning large distances.\nIt can also be very annoying. Now YOU have control.">Disable Kinetic Panning</span><br>';
      innerHTML += '<input type="checkbox" id="_cbDisableZoomAnimation" /> ' +
         '<span title="Animated zooming is a new WME feature which some would prefer not to have enabled.  Click here to express that preference...">Disable Animated Zooming</span><br>';
      innerHTML += '<input type="checkbox" id="_cbDisableUITransitions" /> ' +
         '<span title="Because life is simply too short to waste time waiting for UI elements to oooooooooze into position">Disable UI Transitions</span><br>';
      innerHTML += '<input type="checkbox" id="_cbDisableScrollZoom" /> ' +
         '<span title="Zooming with the scroll wheel can be problematic when using an Apple Magic Mouse, which\nscrolls on touch. This will disable scroll-to-zoom.">Disable scroll-to-zoom</span><br>';
      innerHTML += '<input type="checkbox" id="_cbDisableSaveBlocker" /> ' +
         '<span title="When you hit Save, WME places a blocking element over the map until the save is complete\nThis disables that element, allowing you to pan the map and use GSV whilst a slow save is in progress.">Disable map blocking during save</span><br>';
      innerHTML += '<input type="checkbox" id="_cbColourBlindTurns" /> ' +
         '<span title="Change green turn arrows blue in order to make them more visible\nfor users with the most common type of colour blindness.">Change green turn arrows to blue</span><br>';
      innerHTML += '<input type="checkbox" id="_cbUnfloatButtons" /> ' +
         '<span title="Move Layers/Refresh buttons back into the toolbar and Share button into the\nfooter.\nWaze put little enough effort into giving us enough map area to work with,\nand then they drop little button turds all over it!">Remove floating buttons from map area</span><br>';
      innerHTML += '<input type="checkbox" id="_cbMoveUserInfo" /> ' +
         '<span title="The new user info button is very useful, but it\'s not a map editing control,\nso it shouldn\'t be in the toolbar. The same goes for the notification button.\nThis function moves them both to a sensible location.">Move user info/notification buttons</span><br>';
      innerHTML += '<input type="checkbox" id="_cbHackGSVHandle" /> ' +
         '<span title="Whilst being able to adjust the GSV width is useful, the drag handle\ninvisibly covers 30 pixels of map and is very easy to drag accidentally.\nThis function transforms it to a button drag control that\'s much less\nlikely to be used by accident.">Minimise GSV drag handle</span><br>';
      innerHTML += '<input type="checkbox" id="_cbEnlargeGeoNodes" /> ' +
         '<span title="If you\'re getting old, like me, grabbing those little circles is a pain!\nThis control lets you enlarge the geo nodes (and junction nodes for segments),\nwhich define the shapes of segments and place boundaries.">Enlarge geo/junction nodes</span><div style="display:inline-block">&nbsp;&nbsp;<input type="number" id="_inpEnlargeGeoNodes" title="radius (default=6)" max=12 min=8 step=2 style="height:16px; padding:0 0 0 2px;; border:1px solid; width:37px;"/></div><br>';
      innerHTML += '<input type="checkbox" id="_cbEnlargeGeoHandlesFU" /> ' +
         '<span title="If you\'re getting old, like me, grabbing those little circles is a pain!\nThis control lets you enlarge the geo handles, used to add geo nodes to segments and place boundaries.">Enlarge geo handles</span><div style="display:inline-block">&nbsp;&nbsp;<input type="number" id="_inpEnlargeGeoHandles" title="radius (default=4)" max=10 min=6 step=2 style="height:16px; padding:0 0 0 2px;; border:1px solid; width:37px;"/></div><br>';
      innerHTML += '<input type="checkbox" id="_cbEnlargePointMCs" /> ' +
         '<span title="This control lets you enlarge point map comments, because sometimes they can look a little swamped inamongst the rest of the stuff on show">Enlarge point map comments</span><div style="display:inline-block">&nbsp;&nbsp;<input type="number" id="_inpEnlargePointMCs" title="scale (default=1)" max=3 min=1 step=0.1 style="height:16px; padding:0 0 0 2px;; border:1px solid; width:37px;"/></div><br>';
      innerHTML += '<input type="checkbox" id="_cbEnlargeTurnClosures" /> ' +
         '<span title="This control lets you enlarge turn closure markers, to help them stand out against the turn arrow itself">Enlarge turn closure markers</span><div style="display:inline-block">&nbsp;&nbsp;<input type="number" id="_inpEnlargeTurnClosures" title="scale (default=1)" max=3 min=1 step=0.1 style="height:16px; padding:0 0 0 2px;; border:1px solid; width:37px;"/></div><br>';
      innerHTML += '<input type="checkbox" id="_cbEnlargeNodeClosures" /> ' +
         '<span title="This control lets you enlarge node closure markers, to help them stand out against the rest of the map clutter">Enlarge node closure markers</span><div style="display:inline-block">&nbsp;&nbsp;<input type="number" id="_inpEnlargeNodeClosures" title="scale (default=1)" max=3 min=1 step=0.1 style="height:16px; padding:0 0 0 2px;; border:1px solid; width:37px;"/></div><br>';

      // To avoid the need to deal with WME's sidebar optimisations, the DSA controls are now added to the end of our tab rather than to the settings tab...
      if (localStorage.dontShowAgain)
      {
         // localStorage.dontShowAgain is created by WME whenever the user opts to hide certain elements.  Ordinarily this would mean they'd never be
         // seen again so long as WME continued to respect the contents of these variables, and so long as the user didn't change browsers or wipe
         // the localStorage on their current one.  To give them the option of more easily reinstating these hidden elements, add a checkbox for each
         // entry in .dontShowAgain so the user can change their values.
         var dontShowAgain = JSON.parse(localStorage.dontShowAgain);
         var DSGroup = document.createElement('div');
         DSGroup.classList = "form-group";
         var DSLabel = document.createElement('label');
         DSLabel.classList = "control-label";
         DSLabel.innerHTML = modifyHTML("Disabled WME warnings");
         DSLabel.title = "This section will not update if you disable a warning\n";
         DSLabel.title += "from a WME pop-up. Re-load the page if you need\n";
         DSLabel.title += "to re-enable a warning you have just disabled.\n\n";
         DSLabel.title += "SECTION ADDED BY WME Fix UI.";
         DSGroup.appendChild(DSLabel);
         DSGroup.appendChild(document.createElement('br'));
         var DSCC = document.createElement('div');
         DSCC.classList = "controls-container";
         DSCC.id = "FUME_DSA";
         var DSInput;
         for (var property in dontShowAgain)
         {
            DSInput = document.createElement('input');
            DSInput.type = "checkbox";
            DSInput.id = "WMEFUDScb_" + property.toString();
            DSInput.setAttribute("orig", property.toString());
            let isChecked = dontShowAgain[property];
            if(isChecked === true)
            {
               // By default, the checked attribute exists and is set to false, so we only
               // need to set it here if we want to make the checkbox ticked by default...
               DSInput.setAttribute("checked", "");
            }
            DSLabel = document.createElement('label');
            DSLabel.setAttribute("for", DSInput.id);
            DSLabel.innerText = property.toString();
            DSCC.appendChild(DSInput);
            DSCC.appendChild(DSLabel);
            DSCC.appendChild(document.createElement('br'));
         }
         DSGroup.appendChild(DSCC);
         innerHTML += '<br>';
         innerHTML += DSGroup.innerHTML;
         innerHTML += '<br>';
      }

      innerHTML += '<br>';
      innerHTML += '<b><a href="https://www.waze.com/forum/viewtopic.php?t=334618" title="Forum topic" target="_blank"><u>' +
         'WME Fix UI Memorial Edition</u></a></b> &nbsp; v' + fumeVersion;

      return innerHTML;
   }
   function addMyTab()
   {
      logit("Creating tab...");
      tabCreate();
   }
   async function tabCreate()
   {
      let { tabLabel, tabPane } = W.userscripts.registerSidebarTab("FUME");
      tabLabel.innerText = "FUME";
      tabPane.innerHTML = modifyHTML(createTabHTML());
      await W.userscripts.waitForElementConnected(tabPane);

      logit("Tab now available...");
      abInitialiseAlertBox();
      document.getElementById('abAlertTickBtn').addEventListener('click', abCloseAlertBoxWithTick, true);
      document.getElementById('abAlertCrossBtn').addEventListener('click', abCloseAlertBoxWithCross, true);

      //pass control to init2
      init2();
   }
   function loadSettings()
   {
      // Remove old V1 settings if they're still hanging around
      if (localStorage.WMEFixUI)
      {
         localStorage.removeItem("WMEFixUI");
      }
      var options;
      if (localStorage.WMEFUSettings)
      {
         options = JSON.parse(localStorage.WMEFUSettings);
      }
      else
      {
         options = {};
      }
      oldVersion = (options.oldVersion !== undefined ? options.oldVersion : "0.0");
      getById('_cbMoveZoomBar').checked = (options.moveZoomBar !== undefined ? options.moveZoomBar : true);
      getById('_cbMoveSearchAreaButton').checked = (options.moveSearchAreaButton !== undefined ? options.moveSearchAreaButton : false);
      getById('_cbShrinkTopBars').checked = (options.shrinkTopBars !== undefined ? options.shrinkTopBars : true);
      getById('_cbCompressSidebar').checked = (options.restyleSidePanel !== undefined ? options.restyleSidePanel : true);
      getById('_cbRestyleReports').checked = (options.restyleReports !== undefined ? options.restyleReports : true);
      getById('_cbNarrowSidePanel').checked = (options.narrowSidePanel !== undefined ? options.narrowSidePanel : false);
      getById('_inpASX').value = (options.aerialShiftX !== undefined ? options.aerialShiftX : 0);
      getById('_inpASY').value = (options.aerialShiftY !== undefined ? options.aerialShiftY : 0);
      getById('_inpASO').value = (options.aerialOpacity !== undefined ? options.aerialOpacity : 100);
      getById('_inpASXO').value = (options.aerialShiftXO !== undefined ? options.aerialShiftXO : 0);
      getById('_inpASYO').value = (options.aerialShiftYO !== undefined ? options.aerialShiftYO : 0);
      getById('_inpASOO').value = (options.aerialOpacityO !== undefined ? options.aerialOpacityO : 100);
      getById('_cbFixExternalProviders').checked = (options.fixExternalProviders !== undefined ? options.fixExternalProviders : true);
      getById('_inpGSVContrast').value = (options.GSVContrast !== undefined ? options.GSVContrast : 100);
      getById('_inpGSVBrightness').value = (options.GSVBrightness !== undefined ? options.GSVBrightness : 100);
      getById('_cbGSVInvert').checked = (options.GSVInvert !== undefined ? options.GSVInvert : false);
      getById('_inpGSVWidth').value = (options.GSVWidth !== undefined ? options.GSVWidth : 50);
      getById('_cbCompressLayersMenu').checked = (options.restyleLayersMenu !== undefined ? options.restyleLayersMenu : true);
      getById('_cbLayersColumns').checked = (options.layers2Cols !== undefined ? options.layers2Cols : false);
      getById('_cbMoveChatIcon').checked = (options.moveChatIcon !== undefined ? options.moveChatIcon : true);
      getById('_cbHighlightInvisible').checked = (options.highlightInvisible !== undefined ? options.highlightInvisible : true);
      getById('_cbDarkenSaveLayer').checked = (options.darkenSaveLayer !== undefined ? options.darkenSaveLayer : true);
      getById('_inpUIContrast').value = (options.UIContrast !== undefined ? options.UIContrast : 1);
      getById('_inpUICompression').value = (options.UICompression !== undefined ? options.UICompression : 1);
      getById('_inpDateFormat').value = (options.DateFormat !== undefined ? options.DateFormat : 2);
      getById('_cbSwapRoadsGPS').checked = (options.swapRoadsGPS !== undefined ? options.swapRoadsGPS : true);
      getById('_cbShowMapBlockers').checked = (options.showMapBlockers !== undefined ? options.showMapBlockers : true);
      getById('_cbHideSegmentPanelLabels').checked = (options.hideSegmentPanelLabels !== undefined ? options.hideSegmentPanelLabels : false);
      getById('_cbHideOlderMTEs').checked = (options.HideOlderMTEs !== undefined ? options.HideOlderMTEs : false);
      getById('_inpMaxMTEAge').value = (options.MaxMTEAge !== undefined ? options.MaxMTEAge : 60);
      getById('_cbHideOtherEditorMTEs').checked = (options.ShowOnlyMyMTEs !== undefined ? options.ShowOnlyMyMTEs : false);
      getById('_cbHideExpiredMTEs').checked = (options.HideExpiredMTEs !== undefined ? options.HideExpiredMTEs : false);
      getById('_cbTameSegmentTypeMenu').checked = (options.tameSegmentMenu !== undefined ? options.tameSegmentMenu : false);
      getById('_cbTameElevationMenu').checked = (options.tameElevationMenu !== undefined ? options.tameElevationMenu : false);
      getById('_cbTameHNButtonPopup').checked = (options.tameHNButtonPopup !== undefined ? options.tameHNButtonPopup : false);
      getById('_cbAllowEditorPopup').checked = (options.AllowEditorPopup !== undefined ? options.AllowEditorPopup : false);
      getById('_cbInhibitAddMenuAutoshow').checked = (options.tameAddMenuPopup !== undefined ? options.tameAddMenuPopup : false);
      getById('_cbInhibitTurnPopup').checked = (options.tameTurnPopup !== undefined ? options.tameTurnPopup : false);
      getById('_cbInhibitUTurnPopup').checked = (options.tameUTurnPopup !== undefined ? options.tameUTurnPopup : false);
      getById('_cbInhibitSnackbar').checked = (options.suppressSnackbar !== undefined ? options.suppressSnackbar : false);
      getById('_cbRemoveRoutingReminder').checked = (options.removeRoutingReminder !== undefined ? options.removeRoutingReminder : false);
      getById('_cbReEnableSidePanel').checked = (options.reEnableSidePanel !== undefined ? options.reEnableSidePanel : false);
      getById('_cbDisableBridgeButton').checked = (options.disableBridgeButton !== undefined ? options.disableBridgeButton : true);
      getById('_cbDisablePathButton').checked = (options.disablePathButton !== undefined ? options.disablePathButton : false);
      getById('_cbDisableHazardMarkers').checked = (options.disableHazardMarkers !== undefined ? options.disableHazardMarkers : false);
      getById('_cbDisableKinetic').checked = (options.disableKinetic !== undefined ? options.disableKinetic : false);
      getById('_cbDisableScrollZoom').checked = (options.disableScrollZoom !== undefined ? options.disableScrollZoom : false);
      getById('_cbDisableZoomAnimation').checked = (options.disableAnimatedZoom !== undefined ? options.disableAnimatedZoom : false);
      getById('_cbDisableUITransitions').checked = (options.disableUITransitions !== undefined ? options.disableUITransitions : false);
      getById('_cbDisableSaveBlocker').checked = (options.disableSaveBlocker !== undefined ? options.disableSaveBlocker : false);
      getById('_cbColourBlindTurns').checked = (options.colourBlindTurns !== undefined ? options.colourBlindTurns : false);
      getById('_cbUnfloatButtons').checked = (options.unfloatButtons !== undefined ? options.unfloatButtons : false);
      getById('_cbMoveUserInfo').checked = (options.moveUserInfo !== undefined ? options.moveUserInfo : false);
      getById('_cbHackGSVHandle').checked = (options.hackGSVHandle !== undefined ? options.hackGSVHandle : false);
      getById('_cbEnlargeGeoNodes').checked = (options.enlargeGeoNodes !== undefined ? options.enlargeGeoNodes : false);
      getById('_inpEnlargeGeoNodes').value = (options.geoNodeSize !== undefined ? options.geoNodeSize : 8);
      getById('_cbEnlargeGeoHandlesFU').checked = (options.enlargeGeoHandles !== undefined ? options.enlargeGeoHandles : false);
      getById('_inpEnlargeGeoHandles').value = (options.geoHandleSize !== undefined ? options.geoHandleSize : 6);
      getById('_cbEnlargePointMCs').checked = (options.enlargePointMCs !== undefined ? options.enlargePointMCs : false);
      getById('_inpEnlargePointMCs').value = (options.pointMCScale !== undefined ? options.pointMCScale : 1);
      getById('_cbEnlargeTurnClosures').checked = (options.enlargeTurnClosures !== undefined ? options.enlargeTurnClosures : false);
      getById('_inpEnlargeTurnClosures').value = (options.turnClosureScale !== undefined ? options.turnClosureScale : 1);
      getById('_cbEnlargeNodeClosures').checked = (options.enlargeNodeClosures !== undefined ? options.enlargeNodeClosures : false);
      getById('_inpEnlargeNodeClosures').value = (options.nodeClosureScale !== undefined ? options.nodeClosureScale : 1);
      getById('_cbResizeSearchBox').checked = (options.resizeSearchBox !== undefined ? options.resizeSearchBox : false);
      hidePasses = (options.hidePasses !== undefined ? options.hidePasses : false);
   }
   function saveSettings()
   {
      if (localStorage)
      {
         logit("saving options to local storage");
         var options = {};
         options.oldVersion = fumeVersion;
         options.moveZoomBar = getById('_cbMoveZoomBar').checked;
         options.moveSearchAreaButton = getById('_cbMoveSearchAreaButton').checked;
         options.shrinkTopBars = getById('_cbShrinkTopBars').checked;
         options.restyleSidePanel = getById('_cbCompressSidebar').checked;
         options.restyleReports = getById('_cbRestyleReports').checked;
         options.narrowSidePanel = getById('_cbNarrowSidePanel').checked;
         options.aerialShiftX = getById('_inpASX').value;
         options.aerialShiftY = getById('_inpASY').value;
         options.aerialOpacity = getById('_inpASO').value;
         options.aerialShiftXO = getById('_inpASXO').value;
         options.aerialShiftYO = getById('_inpASYO').value;
         options.aerialOpacityO = getById('_inpASOO').value;
         options.fixExternalProviders = getById('_cbFixExternalProviders').checked;
         options.GSVContrast = getById('_inpGSVContrast').value;
         options.GSVBrightness = getById('_inpGSVBrightness').value;
         options.GSVInvert = getById('_cbGSVInvert').checked;
         options.GSVWidth = getById('_inpGSVWidth').value;
         options.restyleLayersMenu = getById('_cbCompressLayersMenu').checked;
         options.layers2Cols = getById('_cbLayersColumns').checked;
         options.moveChatIcon = getById('_cbMoveChatIcon').checked;
         options.highlightInvisible = getById('_cbHighlightInvisible').checked;
         options.darkenSaveLayer = getById('_cbDarkenSaveLayer').checked;
         options.UIContrast = getById('_inpUIContrast').value;
         options.UICompression = getById('_inpUICompression').value;
         options.DateFormat = getById('_inpDateFormat').value;
         options.swapRoadsGPS = getById('_cbSwapRoadsGPS').checked;
         options.showMapBlockers = getById('_cbShowMapBlockers').checked;
         options.HideOlderMTEs = getById('_cbHideOlderMTEs').checked;
         options.MaxMTEAge = getById('_inpMaxMTEAge').value;
         options.ShowOnlyMyMTEs = getById('_cbHideOtherEditorMTEs').checked;
         options.HideExpiredMTEs = getById('_cbHideExpiredMTEs').checked;
         options.hideSegmentPanelLabels = getById('_cbHideSegmentPanelLabels').checked;
         options.tameSegmentMenu = getById('_cbTameSegmentTypeMenu').checked;
         options.tameElevationMenu = getById('_cbTameElevationMenu').checked;
         options.tameHNButtonPopup = getById('_cbTameHNButtonPopup').checked;
         options.AllowEditorPopup = getById('_cbAllowEditorPopup').checked;
         options.tameAddMenuPopup = getById('_cbInhibitAddMenuAutoshow').checked;
         options.tameTurnPopup = getById('_cbInhibitTurnPopup').checked;
         options.tameUTurnPopup = getById('_cbInhibitUTurnPopup').checked;
         options.suppressSnackbar = getById('_cbInhibitSnackbar').checked;
         options.removeRoutingReminder = getById('_cbRemoveRoutingReminder').checked;
         options.reEnableSidePanel = getById('_cbReEnableSidePanel').checked;
         options.disableBridgeButton = getById('_cbDisableBridgeButton').checked;
         options.disablePathButton = getById('_cbDisablePathButton').checked;
         options.disableHazardMarkers = getById('_cbDisableHazardMarkers').checked;
         options.disableKinetic = getById('_cbDisableKinetic').checked;
         options.disableScrollZoom = getById('_cbDisableScrollZoom').checked;
         options.disableAnimatedZoom = getById('_cbDisableZoomAnimation').checked;
         options.disableUITransitions = getById('_cbDisableUITransitions').checked;
         options.disableSaveBlocker = getById('_cbDisableSaveBlocker').checked;
         options.colourBlindTurns = getById('_cbColourBlindTurns').checked;
         options.unfloatButtons = getById('_cbUnfloatButtons').checked;
         options.moveUserInfo = getById('_cbMoveUserInfo').checked;
         options.hackGSVHandle = getById('_cbHackGSVHandle').checked;
         options.enlargeGeoNodes = getById('_cbEnlargeGeoNodes').checked;
         options.geoNodeSize = getById('_inpEnlargeGeoNodes').value;
         options.enlargeGeoHandles = getById('_cbEnlargeGeoHandlesFU').checked;
         options.geoHandleSize = getById('_inpEnlargeGeoHandles').value;
         options.enlargePointMCs = getById('_cbEnlargePointMCs').checked;
         options.pointMCScale = getById('_inpEnlargePointMCs').value;
         options.enlargeTurnClosures = getById('_cbEnlargeTurnClosures').checked;
         options.turnClosureScale = getById('_inpEnlargeTurnClosures').value;
         options.enlargeNodeClosures = getById('_cbEnlargeNodeClosures').checked;
         options.nodeClosureScale = getById('_inpEnlargeNodeClosures').value;
         options.resizeSearchBox = getById('_cbResizeSearchBox').checked;
         options.hidePasses = hidePasses;
         localStorage.WMEFUSettings = JSON.stringify(options);
      }
   }
   function applyAllSettings()
   {
      kineticDragParams = W.map.controls.find(control => control.dragPan).dragPan.kinetic;

      if(jQuery.ui === undefined)
      {
         logit("jQuery.ui not found, installing...");
         $.getScript("https://code.jquery.com/ui/1.14.1/jquery-ui.js");
      }
      else
      {
         logit("jQuery.ui already loaded by someone else...");
      }

      logit("Applying settings...");

      unfloatButtons();
      shrinkTopBars();
      compressSidebar();
      restyleReports();
      narrowSidePanel();
      warnCommentsOff();
      adjustGSV();
      GSVWidth();
      compressLayersMenu();
      moveChatIcon();
      highlightInvisible();
      darkenSaveLayer();
      swapRoadsGPS();
      showMapBlockers();
      disableBridgeButton();
      disablePathButton();
      disableHazardMarkers();
      disableKinetic();
      disableScrollZoom();
      disableAnimatedZoom();
      disableSaveBlocker();
      colourBlindTurns();
      createZoomBar();

      moveUserInfo();
      moveSearchThisArea();

      hackGSVHandle();
      enlargeGeoNodes(false);
      enlargeGeoHandles(false);
      enlargePointMCs();
      enlargeTurnClosures();
      enlargeNodeClosures();
      hideUnuseableStuff();
      resizeSearch();

      OBObserver.observe(getById('overlay-buttons'), { childList: true, subtree: true });

      BodyObserver.observe(document.body, { childList: true, subtree: true});

      wmeFUinitialising = false;
      saveSettings();
   }

   function applyEnhancements()
   {
      shrinkTopBars();
      compressSidebar();
      restyleReports();
      compressLayersMenu();
      moveUserInfo();
   }
   function moveSVRecentreIcons()
   {
      let fname = 'moveSVRecentreIcons';
      let enabled = getChecked('_cbMoveZoomBar');
      if (enabled === true)
      {
         if (getById('WMEFUzoom') === null) return;
         // Apply the styling related to the zoombar, so that we can get an accurate read of its
         // size/location in a moment...
         var styles = "";
         //Overall bar
         styles += '.olControlPanZoomBar { left: 10px; top: 35px; height: 158px; border: 1px solid #f0f2f2; background-color: #f0f2f2; border-radius: 30px; width: 24px; box-sizing: initial; }';
         //zoom in/out buttons
         styles += '.olButton { background-color: white; border-radius: 30px; width: 24px; height: 24px; cursor: pointer; }';
         styles += '.olControlZoomButton { padding: 3px 5px; font-size: 18px; }';
         //slider stops
         styles += '.yslider-stops { width: 24px; height: 110px; background-color: #f3f3f3; background-image: linear-gradient(90deg, transparent 45%, #dedede 45%, #dedede 55%, transparent 55%), linear-gradient(#dedede 1px, transparent 1px); background-size: 50% 8px; background-repeat: repeat-y; background-position: 6px; }';
         //slider
         styles += '.slider { position: absolute; font-size: 15px; font-weight: 900; line-height: 1; text-align: center; width: 24px; height: 18px; margin-top: -29px; padding-top: 1px; border: 1px solid lightgrey; border-radius: 10px; background-color: white; cursor: ns-resize; }';
         addStyle(prefix + fname, styles);

         // Force a re-render of the zoombar, so that the graphics elements which are missing at this point
         // get inserted - this is also required to get an accurate size/location read...
         ZLI();

         // Get the absolute positions/sizes of the newly generated zoombar, the existing element that contains
         // the SV and location buttons, and the size of the SV button
         var zbBCR = getById('WMEFUzoom').getBoundingClientRect();
         var bcBCR = getByClass('bottom.overlay-buttons-container').getBoundingClientRect();
         var btnBCR = getByClass('street-view-control').getBoundingClientRect();
         // Use this information to calculate what the x/y positions will need to be for the buttons to position
         // them correctly below the zoombar.  Note that the x position will be negative, as this gets applied 
         // relative to the parent container in which the button container resides, rather than to the map view
         var bcPosX = zbBCR.left - bcBCR.left;
         var bcPosY = zbBCR.top + zbBCR.height;
         // Also work out how tall the button container will need to be once we've hidden the native zoom
         // controls
         var bcHeight = (btnBCR.height * 2) + 10;

         // Now apply the full set of styling...
         styles = "";
         // All the stuff for the zoom bar again
         styles += '.olControlPanZoomBar { left: 10px; top: 35px; height: 158px; border: 1px solid #f0f2f2; background-color: #f0f2f2; border-radius: 30px; width: 24px; box-sizing: initial; }';
         styles += '.olButton { background-color: white; border-radius: 30px; width: 24px; height: 24px; cursor: pointer; }';
         styles += '.olControlZoomButton { padding: 3px 5px; font-size: 18px; }';
         styles += '.yslider-stops { width: 24px; height: 110px; background-color: #f3f3f3; background-image: linear-gradient(90deg, transparent 45%, #dedede 45%, #dedede 55%, transparent 55%), linear-gradient(#dedede 1px, transparent 1px); background-size: 50% 8px; background-repeat: repeat-y; background-position: 6px; }';
         styles += '.slider { position: absolute; font-size: 15px; font-weight: 900; line-height: 1; text-align: center; width: 24px; height: 18px; margin-top: -29px; padding-top: 1px; border: 1px solid lightgrey; border-radius: 10px; background-color: white; cursor: ns-resize; }';

         // Then the rest of it...
         // Hide the native zoom control
         styles += '.zoom-bar-container { display: none; }';
         // shift UR/MP panel to the right
         styles += '.panel.show { margin-left: 55px; }';
         // Move the SV/location buttons under the zoom bar
         styles += '.bottom.overlay-buttons-container { position: absolute; left: ' + bcPosX + 'px; top: ' + bcPosY + 'px; height: ' + bcHeight + 'px; }';
         styles += '.street-view-region { margin-bottom: 8px; }';

         // keep the issue tracker filter panel above the relocated ruler/SV/recentre buttons
         styles += '#feed-filter-region { z-index: 1; }';

         addStyle(prefix + fname, styles);

         ZLI();
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
      }

   }
   function createZoomBar()
   {
      let enabled = getChecked('_cbMoveZoomBar');
      if (enabled === true)
      {
         // Create the zoombar element and add it to the map view
         yslider = new OpenLayers.Control.PanZoomBar({ zoomStopHeight: 5, panIcons: false });
         yslider.position.x = 10;
         yslider.position.y = 35;
         yslider.id = 'WMEFUzoom';
         W.map.addControl(yslider);

         W.map.events.register("zoomend", null, ZLI);
         zliResizeObserver = new ResizeObserver(ZLIDeferred);
         zliResizeObserver.observe(document.getElementById('street-view-container'));
         zliResizeObserver.observe(document.getElementById('sidebar'));
      }
      else if (enabled === false)
      {
         if (yslider)
         {
            yslider.destroy();
         }
         W.map.events.unregister("zoomend", null, ZLI);
         if (zliResizeObserver !== null)
         {
            zliResizeObserver.disconnect();
         }
      }
      moveSVRecentreIcons();
   }
   function ZLIDeferred()
   {
      // The ResizeObserver attached to the StreetView container fires not only when the container is
      // opened or closed, but also when its width is altered by dragging the vertical divider.  On
      // some systems, the RO events that are triggered by this latter type of resizing are processed
      // before the StreetView container has finished redrawing - on such systems, if we were to call
      // ZLI directly from the RO event, the zoom bar would end up being trashed again if the user
      // resized using the divider, so we add a short delay after the RO event before calling ZLI.
      setTimeout(ZLI, 200);
      // Likewise for the function used to relocate the SV and recentre icons...
      setTimeout(moveSVRecentreIcons, 200);
   }
   function ZLI()
   {
      if (yslider?.div !== undefined)
      {
         let zoom = sdk.Map.getZoomLevel();

         //Need to reset the OpenLayers-created settings from the zoom bar when it's redrawn
         //Overall bar
         yslider.div.style.left = "";
         yslider.div.style.top = "";
         //zoom in/out buttons
         yslider.buttons[0].style = "";
         yslider.buttons[0].innerHTML = modifyHTML("<div class='olControlZoomButton fa fa-plus' ></div>");
         yslider.buttons[1].style = "";
         yslider.buttons[1].innerHTML = modifyHTML("<div class='olControlZoomButton fa fa-minus' ></div>");
         //slider stops
         yslider.zoombarDiv.classList.add("yslider-stops");
         yslider.zoombarDiv.classList.remove("olButton");
         yslider.zoombarDiv.style = "";
         //slider
         yslider.slider.innerHTML = modifyHTML("");
         yslider.slider.style = "";
         yslider.slider.classList.add("slider");
         yslider.moveZoomBar();
         //Actually set the ZLI
         yslider.slider.innerText = zoom;
         yslider.slider.title = "Zoom level indicator by WMEFU";
         switch (zoom)
         {
            case 4:
            case 5:
            case 6:
            case 7:
            case 8:
            case 9:
            case 10:
            case 11:
            case 12:
            case 13:
               yslider.slider.style.background = '#ef9a9a';
               yslider.slider.title += "\nCannot permalink any segments at this zoom level";
               break;
            case 14:
            case 15:
               yslider.slider.style.background = '#ffe082';
               yslider.slider.title += "\nCan only permalink primary or higher at this zoom level";
               break;
            default:
               yslider.slider.style.background = '#ffffff';
               yslider.slider.title += "\nCan permalink any segments at this zoom level";
               break;
         }


         if (zoom < 12)
         {
            // Re-enable the sidepanel UI if the user has opted to do so...
            if (getChecked('_cbReEnableSidePanel') === true)
            {
               if (document.getElementsByClassName('overlay editingDisabled').length > 0)
               {
                  document.getElementsByClassName('overlay editingDisabled')[0].remove();
               }
            }

            // ...and always relocate the warning dialog you get if the feed tab is active, so that
            // it sits nicely below the tabs regardless of how many there are.
            if (document.getElementsByClassName('zoom-edit-message editingDisabled').length > 0)
            {
               let eTop = document.getElementById('user-tabs').getBoundingClientRect().height;
               eTop = Math.round(eTop) + 'px';
               document.getElementsByClassName('zoom-edit-message editingDisabled')[0].style.top = eTop;
               document.getElementsByClassName('zoom-edit-message editingDisabled')[0].style.left = '0px';
            }
         }
      }
   }
   function resizeSearch()
   {
      let sb = document.querySelector('#search-autocomplete');
      let enabled = getChecked('_cbResizeSearchBox');
      if (enabled === true)
      {
         sb.style.maxWidth = "100%";
      }
      else if (enabled === false)
      {
         sb.style.maxWidth = "450px";
      }
   }
   function moveSearchThisArea()
   {
      if (document.querySelector('div.w-icon-search')?.parentElement?.parentElement !== undefined)
      {
         document.querySelector('div.w-icon-search').parentElement.parentElement.style.zIndex = "5";
      }
   }
   function UnmoveUserInfo()
   {
      let ina = document.querySelector('.secondary-toolbar').lastChild;
      insertNodeAfterNode(document.querySelector('wz-user-box'), ina);
      insertNodeAfterNode(document.querySelector('.user-toolbar'), ina);
   }
   function moveUserInfo()
   {
      // Now functioning correctly for prod & beta
      let fname = 'moveUserInfo';
      let styles = "";
      let mStyle = '';

      let enabled = getChecked('_cbMoveUserInfo');
      if (enabled === true)
      {
         // styles += '#user-box-region { margin-left: 5px; }';
         styles += '.notifications-button { display: flex; }';
         styles += '#app-head aside #left-app-head .waze-logo { width: 50px; }';
         styles += '.user-toolbar .notifications-button { padding: 0 4px; }';
         styles += '.notifications-box-container { transform: translate3d(300px, 0px, 0px) !important; }';

         addStyle(prefix + fname, styles);

         insertNodeBeforeNode(document.querySelector('.user-toolbar'), getById('left-app-head'));
         insertNodeBeforeNode(document.querySelector('wz-user-box'), getById('left-app-head'));


         mStyle = 'translate3d(240px, 0px, 0px)';

         //Fix to move control button of Invalidated Camera Mass Eraser
         if (getById("_UCME_btn"))
         {
            getById("advanced-tools").appendChild(getById("_UCME_btn"));
            getById('UCME_btn').parentNode.removeChild(getById('UCME_btn'));
         }
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
         UnmoveUserInfo();
      }

      unfloat();

      // Keep the user profile box aligned to the profile picture
      let sr = document.querySelector('wz-user-box');
      if (sr !== null) sr = sr.shadowRoot;
      if (sr !== null)
      {
         let mObj = sr.querySelector('wz-menu');
         if (mObj !== null)
         {
            mObj.style.transform = mStyle;
         }
      }
   }
   function RemoveTopBarCompression()
   {
      let a = document.querySelector('wz-header')?.shadowRoot.querySelector('.content-wrapper');
      if ((a != null) & (a != undefined))
      {
         a.style.height = "";
      }
      a = document.querySelector('.restricted-driving-area')?.parentElement;
      if ((a != null) & (a != undefined))
      {
         a.style.position = "";
      }
   }
   function ApplyTopBarShadowRootWzButtonCompression()
   {
      let retval = true;

      if (getChecked('_cbShrinkTopBars') === true)
      {
         let compress = getById('_inpUICompression').value;
         if (compress > 0)
         {
            const c1 = ['', '35px', '24px'];
            let tbRoot = document.querySelector('#app-head');
            if (tbRoot != null)
            {
               let btnWraps = tbRoot.querySelectorAll('.toolbar-button-wrapper');
               for (let i = 0; i < btnWraps.length; ++i)
               {
                  let btnElm = btnWraps[i].querySelector('wz-button');

                  if (btnElm !== undefined)
                  {
                     let srButton = btnElm?.shadowRoot?.querySelector('.wz-button');
                     if ((srButton !== undefined) && (srButton !== null))
                     {
                        srButton.style.height = c1[compress];
                     }
                     else
                     {
                        retval = false;
                     }
                  }
               }
            }
         }
      }
      return retval;
   }
   function shrinkTopBars()
   {
      let fname = 'shrinkTopBars';
      let styles = "";

      RemoveTopBarCompression();

      let enabled = getChecked('_cbShrinkTopBars');
      if (enabled === true)
      {
         let contrast = getById('_inpUIContrast').value;
         let compress = getById('_inpUICompression').value;

         if((sdk.Settings.getUserSettings().isCompactMode === true) && (compress == 2))
         {
            // Limit how much compression is applied to the topbar if WME's compact mode
            // is enabled, as that doesn't play nicely with our maximum compression level...
            compress = 1;
         }

         //always do this stuff
         //event mode button
         styles += '#mode-switcher-region .title-button .icon { font-size: 13px; font-weight: bold; color: black; }';
         //black bar
         styles += '#topbar-container { pointer-events: none; }';
         styles += '#map #topbar-container .topbar > div { pointer-events: initial; }';
         //change toolbar buttons - from JustinS83
         $('#mode-switcher-region .title-button .icon').removeClass('w-icon-caret-down');
         $('#mode-switcher-region .title-button .icon').addClass('fa fa-calendar');
         // HN editing tweaks
         styles += '#map-lightbox .content { pointer-events: none; }';
         styles += '#map-lightbox .content > div { pointer-events: initial; }';
         styles += '#map-lightbox .content .header { pointer-events: none !important; }';
         styles += '.toolbar .toolbar-button.add-house-number { background-color: #61cbff; float: right; font-weight: bold; }';
         styles += '.waze-icon-exit { background-color: #61cbff; font-weight: bold; }';
         // event mode button
         styles += '.toolbar.toolbar-mte .add-button { background-color: orange; font-weight: bold; }';

         // fix for narrow windows and new toolbar
         let nbuttons = 3 + (getChecked('_cbUnfloatButtons') ? 2 : 0);
         let minW = nbuttons * ([58, 49, 33][compress]) + [80, 65, 55][compress];
         styles += '#edit-buttons { min-width: ' + minW + 'px; }';
         styles += '#toolbar { padding: 0px ; }';

         if (compress > 0)
         {
            const c1 = ['', '35px', '24px'];
            const c2 = ['', '13px', '12px'];

            //overall menu bar
            styles += '#left-app-head { height: ' + c1[compress] + ' !important; }';
            styles += '#app-head { height: ' + c1[compress] + '; }';
            styles += '#toolbar { height: ' + c1[compress] + ' !important; }';
            styles += '.group-title-tooltip-wrap { height: ' + c1[compress] + ' !important; }';
            styles += '.restricted-driving-area wz-tooltip-target { height: ' + c1[compress] + ' !important; }';
            styles += '.edit-area { height: calc(100% - ' + c1[compress] + '); }';
            styles += '#user-toolbar { height: ' + c1[compress] + '; }';
            styles += 'wz-user-box { scale: ' + ((parseInt(c1[compress]) * 100) / 36) + '%; }';
            styles += '#app-head aside .short-title { font-size: ' + c2[compress] + '; margin-right: 4px; }';
            styles += '#app-head aside #debug { padding-right: ' + ['', '10px', '6px'][compress] + '; line-height: ' + ['', '15px', '12px'][compress] + '; white-space: nowrap; }';
            styles += '.mode-switcher-view .title-button .icon { line-height: ' + c1[compress] + '; }';
            styles += '.mode-switcher-view .dropdown-menu { top: ' + c1[compress] + '; }';
            styles += '.toolbar { font-size: ' + c2[compress] + '; }';
            styles += '.toolbar { height: ' + c1[compress] + ' !important; }';
            styles += '.toolbar { gap: 4px; }';
            styles += '.toolbar-collection-view { gap: 4px !important; }';
            styles += '.toolbar .toolbar-group { margin-right: 0px !important; }';
            styles += '#edit-buttons { gap: 2px; }';
            styles += '#search-autocomplete { flex: 2 1 auto; }';

            // New "thing" popup menu - attempting to override the "top" style added by WME here is a no-go, as that
            // appears to get applied to the menu *after* this function is called, so to avoid the need for yet another
            // time-based style hack, just alter the top margin of the menu element to give the same effective shift
            // needed to keep the top of the menu visible as we reduce the height of the topbar...

            // Note: need to use a semi-wildcarded selector in order to apply this fix *only* to the element tagged as
            // wz-menu which *also* has a classname starting "menu" (it's one of those OH SO delightful classes with a
            // random suffix which means we can't simply do a direct match on it), as simply selecting wz-menu also
            // applies this fix to other stuff (such as the "invisible" section of the TIO edit UI, which caused the
            // weird and unepected formatting error in earlier versions of FUME...).
            styles += 'wz-menu[class^="menu"] { margin-top: ' + ['', '70px', '70px'][compress] + '; }';

            //search box
            styles += '#search-autocomplete { padding-top: ' + ['', '3px', '1px'][compress] + ' !important; }';
            styles += '.form-search { height: ' + ['', '27px', '22px'][compress] + '; }';
            styles += '.form-search .search-query { height: ' + ['', '27px', '22px'][compress] + '; font-size: ' + c2[compress] + '; }';
            styles += '.form-search .input-wrapper .search-icon { font-size: ' + ['', '18px', '16px'][compress] + '; left: ' + ['', '9px', '6px'][compress] + '; }';
            styles += '.form-search .search-query { padding-left: ' + ['', '34px', '24px'][compress] + ';; }';

            //edit-buttons section
            styles += '#edit-buttons { margin-right: ' + ['', '9px', '2px'][compress] + '; }';

            //toolbar dropdowns
            styles += '.toolbar .toolbar-group { margin-right: ' + ['', '14px', '8px'][compress] + '; padding-top: 0px; height: ' + c1[compress] + '; }';
            styles += '.toolbar .group-title { height: ' + ['', '34px', '24px'][compress] + '; line-height: ' + ['', '34px', '24px'][compress] + '; }';
            styles += '.toolbar .dropdown-menu { top: ' + ['', '34px', '24px'][compress] + ' !important; left: ' + ['', '7px', '4px'][compress] + ' !important; }';
            styles += 'wz-menu { top: ' + ['', '34px', '24px'][compress] + ' !important; }';

            //toolbar buttons
            styles += '.toolbar .toolbar-button { margin-top: ' + ['', '3px', '1px'][compress] + '; margin-left: 3px; padding-left: ' + ['', '10px', '5px'][compress] + '; padding-right: ' + ['', '10px', '5px'][compress] + '; height: ' + ['', '27px', '22px'][compress] + '; line-height: ' + ['', '27px', '22px'][compress] + '; }';
            styles += '.toolbar .toolbar-button { padding-left: ' + ['', '2px', '2px'][compress] + '; padding-right: ' + ['', '2px', '2px'][compress] + '; }';
            styles += '.toolbar .toolbar-button .item-container { padding-left: ' + ['', '9px', '2px'][compress] + '; padding-right: ' + ['', '9px', '2px'][compress] + '; }';
            styles += '.toolbar .item-icon { font-size: ' + ['', '22px', '20px'][compress] + ' !important; }';
            styles += '.toolbar .toolbar-button > .item-icon { top: ' + ['', '5px', '2px'][compress] + '; }';
            styles += '.toolbar .toolbar-separator { height: ' + ['', '34px', '22px'][compress] + '; }';
            styles += '.toolbar-button-wrapper { padding: 0!important; }';

            //extra hack for my Permalink Counter button
            styles += '.WMEFUPCicon { margin-top: ' + ['', '4px !important', '2px !important'][compress] + '; }';

            //floating buttons
            styles += '.overlay-button { height: ' + ['', '33px', '26px'][compress] + '; width: ' + ['', '33px', '26px'][compress] + '; font-size: ' + ['', '22px', '20px'][compress] + '; padding: ' + ['', '3px', '1px'][compress] + '; }';
            styles += '#Info_div { height: ' + ['', '33px', '26px'][compress] + ' !important; width: ' + ['', '33px', '26px'][compress] + ' !important; }';
            styles += '.zoom-bar-container {width: ' + ['', '33px', '26px'][compress] + ' !important; }';
            styles += '.zoom-bar-container .overlay-button {height: ' + ['', '33px', '26px'][compress] + ' !important; }';
            styles += '#overlay-buttons .overlay-buttons-container > div:last-child { margin-bottom: 0; }';

            //layers menu
            // styles += '.layer-switcher .toolbar-button { margin-top: ' + ['','1px','0px'][compress] + ' !important; font-size: ' + ['','22px','20px'][compress] + ' !important; height: ' + ['','32px','24px'][compress] + '; }';

            //user button
            styles += '#user-box-region { margin-right: ' + ['', '8px', '2px'][compress] + '; }';
            styles += '.user-box-avatar { height: ' + ['', '32px', '23px'][compress] + ' !important; font-size: ' + ['', '22px', '20px'][compress] + '; }';
            styles += '.app .level-icon { width: ' + ['', '32px', '23px'][compress] + ' !important;  height: ' + ['', '32px', '23px'][compress] + ' !important;}';

            //new save menu
            styles += '.changes-log-region { top: ' + ['', '26px', '21px'][compress] + '; }';

            //black bar
            styles += '.topbar { height: ' + ['', '24px', '18px'][compress] + '; line-height: ' + ['', '24px', '18px'][compress] + '; }';

            //fix for WME Presets button
            styles += '#WMEPresetsDiv > i { height: 100%;}';

            // remove the unecessary space to the left of the notification icon
            styles += '.secondary-toolbar-spacer { display: none; }';

            // All the stuff that can no longer be done via CSS due to shadowroot...
            ApplyTopBarShadowRootWzButtonCompression();

            let hdrStyle = "height: " + c1[compress] + ";";
            hdrStyle += "padding: 0px 16px 0px 16px;";
            document.querySelector('wz-header').shadowRoot.querySelector('.content-wrapper').setAttribute("style", hdrStyle);
            document.querySelector('#delete-button')?.shadowRoot.querySelector('button')?.setAttribute("style", "height: auto!important;");
            document.querySelector('#undo-button')?.shadowRoot.querySelector('button')?.setAttribute("style", "height: auto!important;");
            document.querySelector('#redo-button')?.shadowRoot.querySelector('button')?.setAttribute("style", "height: auto!important;");
            document.querySelector('#notification-button')?.shadowRoot.querySelector('button')?.setAttribute("style", "height: auto!important;");
            document.querySelector('.reload-button')?.shadowRoot.querySelector('button')?.setAttribute("style", "min-width: auto!important;");
            document.querySelector('.layer-switcher-button')?.shadowRoot.querySelector('button')?.setAttribute("style", "min-width: auto!important;");
         }
         else
         {
            RemoveTopBarCompression();
         }
         if (contrast > 0)
         {
            //toolbar dropdown menus
            styles += '.toolbar .group-title { color: black; }';
            styles += '.toolbar .toolbar-button { border-radius: 8px; ' + GetBorderContrast(contrast, false) + 'color: black; }';
            //layers icon - until Waze fix it
            styles += '.layer-switcher .waze-icon-layers.toolbar-button{ background-color: white; }';
         }
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
         //change toolbar buttons - from JustinS83
         $('#mode-switcher-region .title-button .icon').removeClass('fa fa-calendar');
         $('#mode-switcher-region .title-button .icon').addClass('fa fa-angle-down');
      }

      window.dispatchEvent(new Event('resize'));
   }
   function compressSidebar()
   {
      let fname = 'compressSidebar';

      compressSegmentPanel();

      // Apply a permanently active styling fix to enable wrapping in the drives tab,
      // to counter the effects of lengthening the datetime string format...
      let styles = "";
      styles += '.list-item-card-title { white-space: pre-wrap; }';
      addStyle(prefix + fname + "_permanent", styles);

      // Now go and do the optional styling stuff
      styles = "";

      let enabled = getChecked('_cbCompressSidebar');
      if (enabled === true)
      {
         var contrast = getById('_inpUIContrast').value;
         var compress = getById('_inpUICompression').value;
         //Neuter the top gradient
         styles += '#sidebar .tab-scroll-gradient { pointer-events: none; }';
         //Nuke the bottom gradient
         styles += '#sidebar #links:before { display: none; }';
         // Make map comment text always visible
         styles += '.map-comment-name-editor .edit-button { display: block !important; }';
         // fix the latest layout bug (add closure button at the bottom of the screen) introduced by a WME update...
         styles += '.closures-list { height: auto; }';

         if (compress > 0)
         {
            //Lock level
            styles += '.lock-level-selector { display: flex; }';
            styles += '#edit-panel .lock-edit-view label { line-height: 140% !important; }';
            styles += '#edit-panel .lock-edit-view label { height: auto !important; width: auto !important; }';
            styles += '#edit-panel .lock-edit-view label { margin-right: 2px !important; }';
            styles += '#edit-panel .lock-edit-view label { margin-bottom: 6px !important; }';
            //general compression enhancements
            styles += '#sidebar { line-height: ' + ['', '18px', '16px'][compress] + ' !important;}';
            styles += '#sidebar .tab-content .tab-pane { padding: ' + ['', '8px', '1px'][compress] + '; }';
            styles += '#sidebar #sidebarContent { font-size: ' + ['', '13px', '12px'][compress] + '; }';
            styles += '#sidebar #advanced-tools { padding: ' + ['', '0 9px', '0 4px'][compress] + '; }';
            styles += '#sidebar .waze-staff-tools { margin-bottom: ' + ['', '9px', '4px'][compress] + '; height: ' + ['', '25px', '20px'][compress] + '; }';
            styles += '#sidebar .categories-card-content { row-gap: ' + ['', '3px', '0px'][compress] + '; }';
            //Tabs
            styles += '#sidebar .nav-tabs { padding-bottom: ' + ['', '3px', '2px'][compress] + '; }';
            styles += '#sidebar #user-info #user-tabs { padding: ' + ['', '0 9px', '0 4px'][compress] + '; }';
            styles += '#sidebar .tabs-container { padding: ' + ['', '0 9px', '0 4px'][compress] + '; }';
            styles += '#sidebar .nav-tabs li a { margin-top: ' + ['', '2px', '1px'][compress] + '; margin-left: ' + ['', '3px', '1px'][compress] + '; padding: ' + ['', '0 6px', '0 2px'][compress] + '; line-height: ' + ['', '24px', '21px'][compress] + '; height: ' + ['', '24px', '21px'][compress] + '; }';
            styles += '#sidebar .nav-tabs li { flex-grow: 0; }';
            //Feed
            styles += '.feed-item { margin-bottom: ' + ['', '3px', '1px'][compress] + '; }';
            styles += '.feed-item .inner { padding: ' + ['', '5px', '0px'][compress] + '; }';
            styles += '.feed-item .content .title { margin-bottom: ' + ['', '1px', '0px'][compress] + '; }';
            styles += '.feed-item .motivation { margin-bottom: ' + ['', '2px', '0px'][compress] + '; }';
            //Drives & Areas
            styles += '#sidebar .message { margin-bottom: ' + ['', '6px', '2px'][compress] + '; }';
            styles += '#sidebar .result-list .result { padding: ' + ['', '6px 17px', '2px 9px'][compress] + '; margin-bottom: ' + ['', '3px', '1px'][compress] + '; }';
            styles += '#sidebar .result-list .session { background-color: lightgrey; }';
            styles += '#sidebar .result-list .session-available { background-color: white; }';
            styles += '#sidebar .result-list .result.selected { background-color: lightgreen; }';
            styles += 'div#sidepanel-drives { height: auto !important; }';

            //SEGMENT EDIT PANEL
            //general changes
            //checkbox groups
            styles += '#sidebar .controls-container { padding-top: ' + ['', '4px', '1px'][compress] + '; display: inline-block; font-size: ' + ['', '12px', '11px'][compress] + '; }';
            styles += '#sidebar .controls-container input[type="checkbox"] + label { padding-left: ' + ['', '21px', '17px'][compress] + ' !important; } }';
            //form groups
            styles += '#sidebar .form-group { margin-bottom: ' + ['', '5px', '0px'][compress] + '; }';
            //dropdown inputs
            styles += '#sidebar .form-control { height: ' + ['', '27px', '19px'][compress] + '; padding-top: ' + ['', '4px', '0px'][compress] + '; padding-bottom: ' + ['', '4px', '0px'][compress] + '; font-size: ' + ['', '13px', '12px'][compress] + '; color: black; }';
            //buttons
            styles += '#edit-panel .waze-btn { padding-top: 0px !important; padding-bottom: ' + ['', '3px', '1px'][compress] + '; height: ' + ['', '20px', '18px'][compress] + ' !important; line-height: ' + ['', '20px', '18px'][compress] + ' !important; font-size: ' + ['', '13px', '12px'][compress] + '; }';
            //			styles += '#edit-panel .waze-btn { padding-top: ' + ['','3px','0px'][compress] + ' !important; padding-bottom: ' + ['','3px','1px'][compress] + '; height: ' + ['','20px','18px'][compress] + ' !important; line-height: ' + ['','20px','18px'][compress] + ' !important; font-size: ' + ['','13px','12px'][compress] + '; }';
            //radio button controls
            styles += '.waze-radio-container label { height: ' + ['', '19px', '16px'][compress] + '; width: ' + ['', '19px', '16px'][compress] + '; line-height: ' + ['', '19px', '16px'][compress] + '; font-size: ' + ['', '13px', '12px'][compress] + '; margin-bottom: ' + ['', '3px', '1px'][compress] + '; }';
            styles += '.waze-radio-container label { width: auto; padding-left: ' + ['', '6px', '3px'][compress] + ' !important; padding-right: ' + ['', '6px', '3px'][compress] + ' !important; }';
            //text input areas
            styles += '#sidebar textarea.form-control { height: auto; }';
            styles += '#sidebar textarea { max-width: unset; }';
            //specific changes
            //Selected segments info
            styles += '#edit-panel .selection { padding-top: ' + ['', '8px', '2px'][compress] + '; padding-bottom: ' + ['', '8px', '4px'][compress] + '; }';
            styles += '#edit-panel .segment .direction-message { margin-bottom: ' + ['', '9px', '3px'][compress] + '; }';
            //Segment details (closure warning)
            styles += '#edit-panel .segment .segment-details { padding: ' + ['', '10px', '5px'][compress] + '; padding-top: 0px; }';
            //All control labels
            styles += '#edit-panel .control-label { font-size: ' + ['', '11px', '10px'][compress] + '; margin-bottom: ' + ['', '4px', '1px'][compress] + '; }';
            //Address input
            styles += '#edit-panel .address-edit-view { cursor: pointer; margin-bottom: ' + ['', '6px', '2px'][compress] + '!important; }';
            styles += '#edit-panel .address-edit-input { padding: ' + ['', '4px', '1px'][compress] + '; font-size: ' + ['', '13px', '12px'][compress] + '; }';
            styles += '.tts-button { height: ' + ['', '28px', '21px'][compress] + '; }';
            //alt names
            styles += '.alt-street-list { margin-bottom: ' + ['', '4px', '0px'][compress] + '; }';
            styles += '#edit-panel .add-alt-street-form .alt-street { padding-top: ' + ['', '13px', '3px'][compress] + '; padding-bottom: ' + ['', '13px', '3px'][compress] + '; }';
            styles += '#edit-panel .add-alt-street-form .alt-street .alt-street-delete { top: ' + ['', '12px', '4px'][compress] + '; }';
            styles += '#edit-panel .segment .address-edit-view .address-form .action-buttons { padding-top: ' + ['', '11px', '6px'][compress] + '; padding-bottom: ' + ['', '11px', '6px'][compress] + '; margin-top: ' + ['', '5px', '0px'][compress] + '; height: ' + ['', '45px', '28px'][compress] + '; }';
            styles += '#edit-panel .add-alt-street-form .new-alt-street { padding-top: ' + ['', '8px', '3px'][compress] + '; padding-bottom: ' + ['', '8px', '3px'][compress] + '; }';
            //restrictions control
            styles += '#edit-panel .restriction-list { margin-bottom: ' + ['', '5px', '0px'][compress] + '; }';
            //speed limit controls
            styles += '#edit-panel .speed-limit { margin-top: ' + ['', '0px', '-5px'][compress] + '; margin-bottom: ' + ['', '5px', '2px'][compress] + ';}';
            styles += '#edit-panel .segment .speed-limit label { margin-bottom: ' + ['', '3px', '1px'][compress] + '; }';
            styles += '#edit-panel .segment .speed-limit .form-control { height: ' + ['', '23px', '19px'][compress] + '; padding-top: ' + ['', '4px', '2px'][compress] + '; font-size: ' + ['', '13px', '12px'][compress] + '; width: 5em; margin-left: 0px; }';
            styles += '#edit-panel .segment .speed-limit .direction-label { font-size: ' + ['', '12px', '11px'][compress] + '; line-height: ' + ['', '2.0em', '1.8em'][compress] + '; }';
            styles += '#edit-panel .segment .speed-limit .unit-label { font-size: ' + ['', '12px', '11px'][compress] + '; line-height: ' + ['', '2.0em', '1.8em'][compress] + '; margin-left: 0px;}';
            styles += '#edit-panel .segment .speed-limit .average-speed-camera { margin-left: 40px; }';
            styles += '#edit-panel .segment .speed-limit .average-speed-camera .camera-icon { vertical-align: top; }';
            styles += '#edit-panel .segment .speed-limit .verify-buttons { margin-bottom: ' + ['', '5px', '0px'][compress] + '; }';
            //more actions section
            styles += '#edit-panel .more-actions { padding-top: ' + ['', '6px', '2px'][compress] + '; }';
            styles += '#edit-panel .more-actions .waze-btn.waze-btn-white { padding-left: 0px; padding-right: 0px; }';

            //additional attributes
            styles += '#edit-panel .additional-attributes { margin-bottom: ' + ['', '3px', '1px'][compress] + '; }';
            //history items
            styles += '.toggleHistory { padding: ' + ['', '7px', '3px'][compress] + '; }';
            styles += '.element-history-item:not(:last-child) { margin-bottom: ' + ['', '3px', '1px'][compress] + '; }';
            styles += '.element-history-item .tx-header { padding: ' + ['', '6px', '2px'][compress] + '; }';
            styles += '.element-history-item .tx-header .tx-author-date { margin-bottom: ' + ['', '3px', '1px'][compress] + '; }';
            styles += '.element-history-item .tx-content { padding: ' + ['', '7px 7px 7px 22px', '4px 4px 4px 22px'][compress] + '; }';
            styles += '.loadMoreContainer { padding: ' + ['', '5px 0px', '3px 0px'][compress] + '; }';
            //closures tab
            styles += '.closures-tab wz-button { transform: scale(' + ['', '0.85', '0.7'][compress] + '); padding: 0px!important; }';
            styles += '.closures > div:not(.closures-list) { padding: ' + ['', '0px', '0px'][compress] + '; }';
            styles += 'body { --wz-text-input-height: ' + ['', '30px', '20px'][compress] + '; }';
            styles += 'body { --wz-select-height: ' + ['', '30px', '20px'][compress] + '; }';
            styles += 'input.wz-text-input { height: ' + ['', '30px', '20px'][compress] + '; }';
            styles += '.edit-closure .closure-nodes .closure-node-item .closure-node-control { padding: ' + ['', '7px', '2px'][compress] + '; }';
            //closures list
            styles += '.closures-list .add-closure-button { line-height: ' + ['', '20px', '18px'][compress] + '; }';
            styles += '.closures-list .closure-item:not(:last-child) { margin-bottom: ' + ['', '6px', '2px'][compress] + '; }';
            styles += '.closures-list .closure-item .details { padding: ' + ['', '5px', '0px'][compress] + '; font-size: ' + ['', '12px', '11px'][compress] + '; }';
            styles += '.closures-list .closure-item .buttons { top: ' + ['', '7px', '4px'][compress] + '; }';
            //tweak for Junction Box button
            styles += '#edit-panel .junction-actions > button { width: inherit; }';

            //PLACE DETAILS
            styles += '#edit-panel .navigation-point-list { margin-bottom: ' + ['', '4px', '0px'][compress] + '; }';
            //alert
            styles += '#edit-panel .header-alert { margin-bottom: ' + ['', '6px', '2px'][compress] + '; padding: ' + ['', '6px 32px', '2px 32px'][compress] + '; }';
            //address input
            styles += '#edit-panel .full-address { padding-top: ' + ['', '4px', '1px'][compress] + '; padding-bottom: ' + ['', '4px', '1px'][compress] + '; font-size: ' + ['', '13px', '12px'][compress] + '; }';
            //alt names
            styles += '#edit-panel .aliases-view .list li { margin: ' + ['', '12px 0', '4px 0'][compress] + '; }';
            styles += '#edit-panel .aliases-view .delete { line-height: inherit; }';
            //categories
            styles += '#edit-panel .categories .select2-search-choice .category { margin: ' + ['', '2px 0 2px 4px', '1px 0 1px 3px'][compress] + '; height: ' + ['', '18px', '15px'][compress] + '; line-height: ' + ['', '18px', '15px'][compress] + '; }';
            styles += '#edit-panel .categories .select2-search-field input { height: ' + ['', '18px', '17px'][compress] + '; }';
            styles += '#edit-panel .categories .select2-choices { min-height: ' + ['', '26px', '19px'][compress] + '; }';
            styles += '#edit-panel .categories .select2-container { margin-bottom: 0px; }';
            //entry/exit points
            styles += '#edit-panel .navigation-point-view .navigation-point-list-item .preview { padding: ' + ['', '3px 7px', '0px 4px'][compress] + '; font-size: ' + ['', '13px', '12px'][compress] + '; }';
            styles += '#edit-panel .navigation-point-view .add-button { height: ' + ['', '28px', '18px'][contrast] + '; line-height: ' + ['', '17px', '16px'][contrast] + '; font-size: ' + ['', '13px', '12px'][compress] + '; }';
            //type buttons
            styles += '#sidebar .area-btn, #sidebar .point-btn { display: flex; align-items: center; justify-content: center; height: ' + ['', '22px', '20px'][compress] + '; line-height: ' + ['', '19px', '16px'][compress] + '; font-size: ' + ['', '13px', '12px'][compress] + '; }';
            styles += '#sidebar .area-btn:before, #sidebar .point-btn:before { top: 0px; margin-right: 8px; }';
            //external providers
            styles += '.select2-container { font-size: ' + ['', '13px', '12px'][compress] + '; }';
            styles += '#edit-panel .external-providers-view .external-provider-item { margin-bottom: ' + ['', '6px', '2px'][compress] + '; }';
            styles += '.external-providers-view > div > ul { margin-bottom: ' + ['', '4px', '0px'][compress] + '; }';
            styles += '#edit-panel .external-providers-view .add { padding: ' + ['', '3px 12px', '1px 9px'][compress] + '; }';
            styles += '#edit-panel .waze-btn.waze-btn-smaller { line-height: ' + ['', '26px', '21px'][compress] + '; }';
            //residential toggle
            styles += '#edit-panel .toggle-residential { height: ' + ['', '27px', '22px'][compress] + '; }';
            //more info
            styles += '.service-checkbox { font-size: ' + ['', '13px', '12px'][compress] + '; }';

            //PARKING LOT SPECIFIC
            styles += '.parking-type-option{ display: inline-block; }';
            styles += '.payment-checkbox { display: inline-block; min-width: ' + ['', '48%', '31%'][compress] + '; }';
            styles += '.service-checkbox { display: inline-block; min-width: 49%; font-size: ' + ['', '12px', '11px'][compress] + '; }';
            styles += '.lot-checkbox { display: inline-block; min-width: 49%; }';

            //MAP COMMENTS
            styles += '#sidebar .map-comment-name-editor { padding: ' + ['', '10px', '5px'][compress] + '; }';
            styles += '#sidebar .map-comment-name-editor .edit-button { margin-top: 0px; font-size: ' + ['', '13px', '12px'][compress] + '; padding-top: ' + ['', '3px', '1px'][compress] + '; }';
            styles += '#sidebar .conversation-view .no-comments { padding: ' + ['', '10px 15px', '5px 15px'][compress] + '; }';
            styles += '#sidebar .map-comment-feature-editor .conversation-view .comment-list { padding-top: ' + ['', '8px', '1px'][compress] + '; padding-bottom: ' + ['', '8px', '1px'][compress] + '; }';
            styles += '#sidebar .map-comment-feature-editor .conversation-view .comment-list .comment .comment-content { padding: ' + ['', '6px 0px', '2px 0px'][compress] + '; }';
            styles += '#sidebar .conversation-view .comment .text { padding: ' + ['', '6px 9px', '3px 4px'][compress] + '; font-size: ' + ['', '13px', '12px'][compress] + '; }';
            styles += '#sidebar .conversation-view .new-comment-form { padding-top: ' + ['', '10px', '5px'][compress] + '; }';
            styles += '#sidebar .map-comment-feature-editor .clear-btn { height: ' + ['', '26px', '19px'][compress] + '; line-height: ' + ['', '26px', '19px'][compress] + '; }';
            //Compression for WME Speedhelper
            styles += '.clearfix.controls.speed-limit { margin-top: ' + ['', '-4px', '-8px'][compress] + '; }';
            //Compression for WME Clicksaver
            styles += '.rth-btn-container { margin-bottom: ' + ['', '2px', '-1px'][compress] + '; }';
            styles += '#csRoutingTypeContainer { height: ' + ['', '23px', '16px'][compress] + ' !important; margin-top: ' + ['', '-2px', '-4px'][compress] + '; }';
            styles += '#csElevationButtonsContainer { margin-bottom: ' + ['', '2px', '-1px'][compress] + ' !important; }';
            //tweak for WME Clicksaver tab controls
            styles += '#sidepanel-clicksaver .controls-container { width: 100%; }';
            //tweak for JAI tab controls
            styles += '#sidepanel-ja .controls-container { width: 100%; }';
            //tweaks for UR-MP Tracker
            styles += '#sidepanel-urt { margin-left: ' + ['', '-5px', '0px'][compress] + ' !important; }';
            styles += '#urt-main-title { margin-top: ' + ['', '-5px', '0px'][compress] + ' !important; }';
            //tweaks for my own panel
            styles += '#fuContent { line-height: ' + ['', '10px', '9px'][compress] + ' !important; }';

            // scripts panel
            styles += '#user-tabs { padding: 0px !important; }';
         }

         if (contrast > 0)
         {
            //contrast enhancements

            //general
            styles += '#sidebar .form-group { border-top: 1px solid ' + ['', 'lightgrey', 'grey'][contrast] + '; }';
            styles += '#sidebar .text { color: ' + ['', 'darkslategrey', 'black'][contrast] + '; }';
            styles += '#sidebar {background-color: #d6ebff; }';
            styles += ':root {--background_variant: #d0ffd0; }';

            //text colour
            styles += '#sidebar { color: black; }';
            //advanced tools section
            styles += '#sidebar waze-staff-tools { background-color: #c7c7c7; }';
            //Tabs
            styles += '#sidebar .nav-tabs { ' + GetBorderContrast(contrast, false) + '}';
            styles += '#sidebar .nav-tabs li a { ' + GetBorderContrast(contrast, true) + '}';
            //Fix the un-noticeable feed refresh button
            styles += 'span.fa.fa-repeat.feed-refresh.nav-tab-icon { width: 19px; color: orangered; }';
            styles += 'span.fa.fa-repeat.feed-refresh.nav-tab-icon:hover { color: red; font-weight: bold; font-size: 15px; }';
            //Feed
            styles += '.feed-item { ' + GetBorderContrast(contrast, false) + '}';
            styles += '.feed-issue .content .title .type { color: ' + ['', 'black', 'black'][contrast] + '; font-weight: bold; }';
            styles += '.feed-issue .content .timestamp { color: ' + ['', 'darkslategrey', 'black'][contrast] + '; }';
            styles += '.feed-issue .content .subtext { color: ' + ['', 'darkslategrey', 'black'][contrast] + '; }';
            styles += '.feed-item .motivation { font-weight: bold; }';
            //Drives & Areas
            styles += '#sidebar .result-list .result { ' + GetBorderContrast(contrast, false) + '}';
            //Segment edit panel
            styles += '#edit-panel .selection { font-size: 13px; }';
            styles += '#edit-panel .segment .direction-message { color: orangered; }';
            styles += '#edit-panel .address-edit-input { color: black; ' + GetBorderContrast(contrast, false) + '}';
            styles += '#sidebar .form-control { ' + GetBorderContrast(contrast, false) + '}';
            //radio buttons when disabled
            styles += '.waze-radio-container input[type="radio"]:disabled:checked + label { color: black; opacity: 0.7; font-weight:600; }';
            //override border for lock levels
            styles += '#sidebar .waze-radio-container { border: 0 none !important; }';
            styles += '#edit-panel .waze-btn { color: black; ' + GetBorderContrast(contrast, false) + '}';
            styles += '.waze-radio-container label  { ' + GetBorderContrast(contrast, false) + '}';
            //history items
            styles += '.toggleHistory { color: black; text-align: center; }';
            styles += '.element-history-item .tx-header { color: black; }';
            styles += '.element-history-item .tx-header a { color: ' + ['', 'royalblue', 'black'][contrast] + '!important; }';
            styles += '.element-history-item.closed .tx-header { border-radius: 8px; ' + GetBorderContrast(contrast, false) + '}';
            styles += '.loadMoreHistory { ' + GetBorderContrast(contrast, false) + '}';
            //closures list
            styles += '.closures-list .closure-item .details { border-radius: 8px; ' + GetBorderContrast(contrast, false) + '}';
            styles += '.closures-list .closure-item .dates { color: black; }';
            styles += '.closures-list .closure-item .dates .date-label { opacity: 1; }';
            //Place details
            //alert
            styles += '#edit-panel .alert-danger { color: red; }';
            //address input
            styles += '#edit-panel .full-address { color: black; ' + GetBorderContrast(contrast, false) + '}';
            styles += '#edit-panel a.waze-link { font-weight: bold; }';
            //the almost invisible alternate name link
            styles += '#edit-panel .add.waze-link { color: ' + ['', 'royalblue', 'black'][contrast] + '!important; }';
            //categories
            styles += '#edit-panel .categories .select2-search-choice .category { text-transform: inherit; font-weight: bold; background: gray; }';
            //entry/exit points
            styles += '#edit-panel .navigation-point-view .navigation-point-list-item .preview { ' + GetBorderContrast(contrast, false) + '}';
            styles += '#edit-panel .navigation-point-view .add-button { ' + GetBorderContrast(contrast, false) + ' margin-top: 2px; padding: 0 5px; color: ' + ['', 'royalblue', 'black'][contrast] + '!important; }';
            //type buttons
            styles += '#sidebar .point-btn { color: black; ' + GetBorderContrast(contrast, true) + '}';
            //external providers
            styles += '.select2-container { color: teal; ' + GetBorderContrast(contrast, true) + '}';
            styles += '.select2-container .select2-choice { color: black; }';
            //residential toggle
            styles += '#edit-panel .toggle-residential { font-weight: bold; }';
            //COMMENTS
            styles += '.map-comment-name-editor { border-color: ' + ['', 'darkgrey', 'grey'][contrast] + '; }';
         }
         //fix for buttons of WME Image Overlay script
         styles += '#sidepanel-imageoverlays > div.result-list button { height: 24px; }';
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
         removeStyle(prefix + 'hideHeadlights');
      }

      RestyleDropDownEntries();
   }
   function RestyleDropDownEntries()
   {
      let compress = getById('_inpUICompression').value;
      let enabled = getChecked('_cbCompressSidebar');
      if ((enabled === true) && (compress > 0))
      {
         compressDropDownEntries(true);
      }
      else
      {
         compressDropDownEntries(false);
      }
   }
   function compressDropDownEntries(doCompression)
   {
      let n = document.querySelectorAll('wz-option').length;
      while (n)
      {
         let obj = document.querySelectorAll('wz-option')[n - 1];
         if (obj != undefined)
         {
            let mi = obj.shadowRoot.querySelector('.wz-menu-item');
            if ((mi != null) && (mi.touchedByFUME !== true))
            {
               if(doCompression === true)
               {
                  mi.style.lineHeight = "130%";
                  mi.style.height = "100%";
                  mi.style.minHeight = "0px";
               }
               else
               {
                  mi.style.lineHeight = "var(--wz-menu-option-height, var(--wz-option-height, 40px));";
                  mi.style.height = "var(--wz-menu-option-height, var(--wz-option-height, 40px))";   
               }
               mi.touchedByFUME = true;
            }
         }
         --n;
      }

      n = document.querySelectorAll('wz-menu-chip').length;
      while (n)
      {
         let obj = document.querySelectorAll('wz-menu-chip')[n - 1].shadowRoot;
         if (obj != undefined)
         {
            let m = obj.querySelectorAll('wz-menu-item').length;
            while(m)
            {
               let mi = obj.querySelectorAll('wz-menu-item')[m-1];
               if (mi != null)
               {
                  let sr = mi.shadowRoot.querySelector('.wz-menu-item');
                  if((sr !== null) && (sr.touchedByFUME !== true))
                  {
                     if(doCompression === true)
                     {
                        sr.style.lineHeight = "130%";
                        sr.style.height = "100%";
                        sr.style.minHeight = "0px";
                     }
                     else
                     {
                        sr.style.lineHeight = "";
                        sr.style.height = "";
                     }
                     sr.touchedByFUME = true;
                  }
               }
               --m;
            }
         }
         --n;
      }
   }
   function hideUnuseableStuff()
   {
      if (W?.model?.getTopCountry === undefined)
      {
         // getTopCountry takes a short while to become available, so keep checking at regular
         // intervals until it's there to be used...
         setTimeout(hideUnuseableStuff, 100);
      }
      else
      {
         let fname = 'hideUnuseableStuff';
         let styles = "";

         // Hide the headlights reminder checkbox for segments in countries that don't use it
         if (W?.model?.getTopCountry()?.attributes.allowHeadlightsReminderRank === null)
         {
            styles += '.headlights-reminder { display: none !important; }';
         }

         // Hide the restricted areas toolbar button for anyone who can't make use of it
         /*
         //// update as RA option is now in sidepanel "new thing" menu...
         if(document.querySelector('wz-button.restricted-driving-area').disabled === true)
         {
            styles += 'wz-button.restricted-driving-area { display: none !important; }';
         }
         */

         if (styles !== "")
         {
            addStyle(prefix + fname, styles);
         }
      }
   }
   function compressLayersMenu()
   {
      let fname = 'compressLayersMenu';
      removeStyle(prefix + fname);
      let styles = "";
      let enabled = getChecked('_cbCompressLayersMenu');
      if (enabled === true)
      {
         getById('layersColControls').style.opacity = '1';
         let contrast = getById('_inpUIContrast').value;
         let compress = getById('_inpUICompression').value;
         if (compress > 0)
         {
            //VERTICAL CHANGES
            //change menu to autoheight - not working
            // styles += '.layer-switcher .menu { height: auto; width: auto; max-height: calc(100% - 26px); overflow-y: scroll }';
            //change menu to auto-width
            styles += '.layer-switcher .menu { width: auto }';
            styles += '.layer-switcher .menu.hide-layer-switcher { left: 100% }';
            //menu title
            styles += '.layer-switcher .menu > .title { font-size: ' + ['', '14px', '12px'][compress] + '; padding-bottom: ' + ['', '7px', '2px'][compress] + '; padding-top: ' + ['', '7px', '2px'][compress] + ' }';
            styles += '.layer-switcher .menu > .title .w-icon-x { font-size: ' + ['', '21px', '18px'][compress] + ' }';
            styles += '.layer-switcher .scrollable { height: calc(100% - ' + ['', '39px', '29px'][compress] + ') }';
            //menu group headers
            styles += '.layer-switcher .layer-switcher-toggler-tree-category { padding: ' + ['', '5px', '2px'][compress] + ' 0; height: ' + ['', '30px', '20px'][compress] + ' }';
            //menu items
            styles += '.layer-switcher li { line-height: ' + ['', '20px', '16px'][compress] + '}';
            styles += '.layer-switcher .togglers ul li .wz-checkbox { margin-bottom: ' + ['', '3px', '0px'][compress] + ' }';
            styles += '.wz-checkbox { min-height: ' + ['', '20px', '16px'][compress] + ' }';
            styles += '.wz-checkbox input[type="checkbox"] + label { line-height: ' + ['', '20px', '16px'][compress] + '; font-size: ' + ['', '12px', '11px'][compress] + ' }';
            styles += '.wz-checkbox input[type="checkbox"] + label:before { font-size: ' + ['', '13px', '10px'][compress] + '; height: ' + ['', '16px', '14px'][compress] + '; width: ' + ['', '16px', '14px'][compress] + '; line-height: ' + ['', '12px', '11px'][compress] + ' }';
            //HORIZONTAL CHANGES
            styles += '.layer-switcher .togglers ul { padding-left: ' + ['', '19px', '12px'][compress] + '; }';
            styles += '.layer-switcher .togglers .group { padding: ' + ['', '0 8px 0 4px', '0 4px 0 2px'][compress] + ' }';
            if (getChecked('_cbLayersColumns') === true)
            {
               //2 column stuff
               styles += '.layer-switcher .scrollable { columns: 2; }';
               styles += 'li.group { break-inside: avoid; page-break-inside: avoid; }';
               //prevent city names showing up when it should be hidden
               styles += ' .layer-switcher ul[class^="collapsible"].collapse-layer-switcher-group { visibility: collapse }';
               styles += '.layer-switcher .menu { overflow-x: hidden; overflow-y: scroll; height: auto; max-height: calc(100% - ' + ['', '39px', '29px'][compress] + ') }';
               styles += '.layer-switcher .scrollable { overflow-x: hidden; overflow-y: hidden; height: unset }';
            }
            // fix from ABelter for layers menu
            styles += ' .layer-switcher ul[class^="collapsible"] { max-height: none; }';
         }
         else
         {
            //2-columns not available without compression
            getById('layersColControls').style.opacity = '0.5';
         }
         if (contrast > 0)
         {
            styles += '.controls-container.main.toggler { color: white; background: dimgray }';
            styles += '.layer-switcher .toggler.main .label-text { text-transform: inherit }';
            //labels
            styles += '.layer-switcher .layer-switcher-toggler-tree-category > .label-text { color: black }';
            styles += '.wz-checkbox input[type="checkbox"] + label { WME: FU; color: black }';
            //group separator
            styles += '.layer-switcher .togglers .group { border-bottom: 1px solid ' + ['', 'lightgrey', 'grey'][contrast] + ' }';
            //column rule
            styles += '.layer-switcher .scrollable { column-rule: 1px solid ' + ['', 'lightgrey', 'grey'][contrast] + ' }';
         }
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         getById('layersColControls').style.opacity = '0.5';
         removeStyle(prefix + fname);
      }
   }
   function changePassVisibility(e)
   {
      let panelContainer = document.querySelector('#panel-container');
      let passes = panelContainer.querySelectorAll('.activeHovSubscriptions');
      let pDisp = 'none';
      hidePasses = panelContainer.querySelector('#_cbCollapsePasses').checked;
      if (hidePasses === false)
      {
         pDisp = '';
      }
      for (let i = 0; i < passes.length; ++i)
      {
         passes[i].style.display = pDisp;
      }
      let btnMore = document.querySelector('.preferences-container wz-button');
      if(btnMore !== null)
      {
         btnMore.style.display = pDisp;
      }

      if(e !== undefined)
      {
         // when called via a click event on the hide passed checkbox, we need to stop the
         // click propagating down the DOM and into the native part of the UI where we've
         // stuffed the checkbox, otherwise it'll cause the passes panel to collapse/expand...
         e.stopPropagation();
      }
   }
   function GetCurrentURID()
   {
      let thisURID = document.getElementsByClassName('permalink')[0].href.split('&mapUpdateRequest=');
      if (thisURID.length > 1)
      {
         thisURID = parseInt(thisURID[1].split('&')[0]);
      }
      else
      {
         thisURID = null;
      }
      return thisURID;
   }
   function AddCollapsiblePasses()
   {
      let thisURID = GetCurrentURID();
      if (thisURID !== null)
      {
         let panelContainer = document.querySelector('#panel-container');
         if (panelContainer.getBoundingClientRect().width > 0)
         {
            let nPasses = sdk.DataModel.MapUpdateRequests.getById({mapUpdateRequestId: thisURID}).userPreferences.activeHovSubscriptions.length;
            if (nPasses > 0)
            {
               if (panelContainer.querySelector('#_cbCollapsePasses') == null)
               {
                  let upHeader = panelContainer.querySelector('.reporter-preferences').querySelector('.title');
                  let iHTML = upHeader.innerHTML;
                  iHTML += ' | Hide passes (' + nPasses + ') <input type="checkbox" id="_cbCollapsePasses" ';
                  if(hidePasses === true)
                  {
                     iHTML += 'checked';
                  }
                  iHTML += '/>';
                  upHeader.innerHTML = iHTML;
                  document.getElementById('_cbCollapsePasses').addEventListener('click', changePassVisibility, true);
                  changePassVisibility();
               }
            }
         }
      }
   }
   function restyleReports()
   {
      let fname = 'restyleReports';
      let styles = "";
      let enabled = getChecked('_cbRestyleReports');
      if (enabled === true)
      {
         let contrast = getById('_inpUIContrast').value;
         let compress = getById('_inpUICompression').value;

         if (compress > 0)
         {
            //report header
            // Remove title text - we know what the panel contains, because we've asked WME to open it...
            styles += '#panel-container .main-title { display: none!important; }';

            styles += '#panel-container .issue-panel-header { padding: ' + ['', '9px 36px', '1px 36px'][compress] + '; line-height: ' + ['', '19px', '17px'][compress] + '; }';
            styles += '#panel-container .issue-panel-header .dot { top: ' + ['', '15px', '7px'][compress] + '; }';

            //special treatment for More Information checkboxes (with legends)

            styles += '#panel-container .problem-edit .more-info .legend { left: 20px; top: 3px; }';
            styles += '#panel-container .more-info input[type="checkbox"] + label { padding-left: 33px !important; }';

            // User preferences section
            styles += '#panel-container .preferences-container { gap: 0px !important; }';
            //report body
            styles += '#panel-container .body { line-height: ' + ['', '15px', '13px'][compress] + '; font-size: ' + ['', '13px', '12px'][compress] + '; }';
            //problem description
            styles += '#panel-container .collapsible { padding: ' + ['', '9px', '3px'][compress] + '; }';

            //comments
            styles += '#panel-container .comment .text { padding: ' + ['', '7px 9px', '4px 4px'][compress] + '; }';
            // Remove padding around comment boxes
            styles += '#panel-container wz-list { padding: 0px!important; }';
            //new comment entry
            styles += '#panel-container .conversation-view .new-comment-form { padding: ' + ['', '8px 9px 6px 9px', '1px 3px 2px 3px'][compress] + '; }';
            //send button
            styles += '#panel-container .conversation-view .send-button { padding: ' + ['', '4px 16px', '2px 12px'][compress] + '; box-shadow: ' + ['', '3px 3px 4px 0 #def7ff', '3px 2px 4px 0 #def7ff'][compress] + '; }';
            //lower buttons
            styles += '#panel-container > div > div > div.actions > div > div { padding-top: ' + ['', '6px', '3px'][compress] + '; }';
            styles += '#panel-container .close-details.section { font-size: ' + ['', '13px', '12px'][compress] + '; line-height: ' + ['', '13px', '9px'][compress] + '; }';
            styles += '#panel-container .problem-edit .actions .controls-container label { height: ' + ['', '28px', '21px'][compress] + '; line-height: ' + ['', '28px', '21px'][compress] + '; margin-bottom: ' + ['', '5px', '2px'][compress] + '; }';
            styles += '.panel .navigation { margin-top: ' + ['', '6px', '2px'][compress] + '; }';
            //WMEFP All PM button
            styles += '#WMEFP-UR-ALLPM { top: ' + ['', '5px', '0px'][compress] + ' !important; }';
         }
         if (contrast > 0)
         {
            styles += '#panel-container .section { border-bottom: 1px solid ' + ['', 'lightgrey', 'grey'][contrast] + '; }';
            styles += '#panel-container .close-panel { border-color: ' + ['', 'lightgrey', 'grey'][contrast] + '; }';
            styles += '#panel-container .main-title { font-weight: 900; }';
            styles += '#panel-container .reported { color: ' + ['', 'darkslategrey', 'black'][contrast] + '; }';
            styles += '#panel-container .date { color: ' + ['', '#6d6d6d', '#3d3d3d'][contrast] + '; }';
            styles += '#panel-container .comment .text { ' + GetBorderContrast(contrast, false) + '}';
            styles += '#panel-container .comment-content.reporter .username { color: ' + ['', '#159dc6', '#107998'][contrast] + '; }';
            styles += '#panel-container .conversation-view .new-comment-form textarea { ' + GetBorderContrast(contrast, false) + '}';
            styles += '#panel-container .top-section { border-bottom: 1px solid ' + ['', 'lightgrey', 'grey'][contrast] + '; }';
            styles += '#panel-container .waze-plain-btn { font-weight: 800; color: ' + ['', '#159dc6', '#107998'][contrast] + '; }';
         }
         addStyle(prefix + fname, styles);

         draggablePanel();

         AddCollapsiblePasses();
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
         if (jQuery.ui)
         {
            if ($("#panel-container").hasClass('ui-draggable'))
            {
               $("#panel-container").draggable("destroy");
            }
            getById("panel-container").style = "";
         }
      }
      window.dispatchEvent(new Event('resize'));
   }
   function draggablePanel()
   {
      if ((wmeFUinitialising === true) || (jQuery.ui === undefined))
      {
         window.setTimeout(draggablePanel, 500);
      }
      else
      {
         if (jQuery.ui)
         {
            if ($("#panel-container").draggable)
            {
               $("#panel-container").draggable({ handle: '[class*="header"]' });
            }
         }
      }
   }
   function narrowSidePanel()
   {
      let fname = 'narrowSidePanel';
      let styles = "";
      let enabled = getChecked('_cbNarrowSidePanel');
      if (enabled === true)
      {
         //sidebar width
         styles += '.row-fluid #sidebar { width: 250px; }';
         //map width
         styles += '.show-sidebar .row-fluid .fluid-fixed { margin-left: 250px; }';
         //user info tweaks
         styles += '#sidebar #user-info #user-box { padding: 0 0 5px 0; }';
         styles += '#sidebar #user-details { width: 250px; }';
         styles += '#sidebar #user-details .user-profile .level-icon { margin: 0; }';
         styles += '#sidebar #user-details .user-profile .user-about { max-width: 161px; }';
         //gradient bars
         styles += '#sidebar .tab-scroll-gradient { width: 220px; }';
         styles += '#sidebar #links:before { width: 236px; }';
         //feed
         styles += '.feed-item .content { max-width: 189px; }';
         //segment edit panel
         styles += '#edit-panel .more-actions .waze-btn.waze-btn-white { width: 122px; }';
         //tweak for WME Bookmarks
         styles += '#divBookmarksContent .divName { max-width: 164px; }';
         //tweak for WME PH buttons
         styles += '#WMEPH_runButton .btn { font-size: 11px; padding: 2px !important; }';
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
      }
      compressSidebar();
      window.dispatchEvent(new Event('resize'));
   }
   function shiftAerials()
   {
      let siLayerNames =
         [
            "satellite_imagery",
            "merged_collection_by_latest_no_candid",
            "merged_collection_by_quality_no_candid",
            "satellite_pleiades_ortho_rgb",
            "satellite_worldview2_ortho_rgb",
            "satellite_worldview3_ortho_rgb",
            "satellite_geoeye1_ortho_rgb",
            "satellite_skysat_ortho_rgb",
            "satellite_pneo_ortho_rgb"
         ];

      // calculate meters/pixel for current map view, taking into account how the
      // map projection stretches things out the further from the equator you get
      let metersPerPixel = sdk.Map.getMapResolution();
      let mapCentre = sdk.Map.getMapCenter();
      let latAdj = Math.cos(mapCentre.lat * Math.PI / 180);
      metersPerPixel *= latAdj;

      if (metersPerPixel == 0)
      {
         metersPerPixel = 0.001;
      }

      let sLeft = Math.round(getById("_inpASX").value / metersPerPixel) + 'px';
      let sTop = Math.round(- getById("_inpASY").value / metersPerPixel) + 'px';

      if (getById('_inpASO').value < 10) getById('_inpASO').value = 10;
      let sOpa = getById("_inpASO").value / 100;

      let sLeftO = Math.round(getById("_inpASXO").value / metersPerPixel) + 'px';
      let sTopO = Math.round(- getById("_inpASYO").value / metersPerPixel) + 'px';

      if (getById('_inpASOO').value < 10) getById('_inpASOO').value = 10;
      let sOpaO = getById("_inpASOO").value / 100;


      if ((getById("_inpASX").value != 0) || (getById("_inpASY").value != 0) || (getById("_inpASXO").value != 0) || (getById("_inpASYO").value != 0))
      {
         getById("WMEFU_AS").style.display = "block";
      }
      else
      {
         getById("WMEFU_AS").style.display = "none";
      }

      // Apply the shift and opacity to all available imagery layers
      for (let i = 0; i < siLayerNames.length; ++i)
      {
         let siLayer = W.map.getLayersByName(siLayerNames[i]);
         if (siLayer.length == 1)
         {
            let siDiv = siLayer[0].div;
            if (i === 0)
            {
               // Standard layer
               siDiv.style.left = sLeft;
               siDiv.style.top = sTop;
               siDiv.style.opacity = sOpa;
            }
            else
            {
               // Additional layers
               siDiv.style.left = sLeftO;
               siDiv.style.top = sTopO;
               siDiv.style.opacity = sOpaO;
            }
         }
      }
   }
   function ApplyArrowFix(aObj)
   {
      if (aObj.touchedByFUME === undefined)
      {
         let rStr = aObj.style.transform;
         let rFloat = 0;
         if (rStr.indexOf('deg') != -1)
         {
            rFloat = parseFloat(rStr.split('(')[1].split('deg')[0]);
         }
         rFloat += 180.0;
         aObj.style.transform = "rotate(" + rFloat + "deg) scaleX(-1)";
         aObj.touchedByFUME = true;
      }
   }
   function RTCArrowsFix()
   {
      if (W.model.isLeftHand === true)
      {
         let rtcDiv = W.map.getLayerByName("closures").div;
         let fLen = rtcDiv.querySelectorAll('.forward').length;
         while (fLen)
         {
            ApplyArrowFix(rtcDiv.querySelectorAll('.forward')[fLen - 1]);
            --fLen;
         }
         let rLen = rtcDiv.querySelectorAll('.backward').length;
         while (rLen)
         {
            ApplyArrowFix(rtcDiv.querySelectorAll('.backward')[rLen - 1]);
            --rLen;
         }
      }
   }
   function warnCommentsOff()
   {
      let fname = 'warnCommentsOff';
      if (W.map.getLayerByUniqueName('mapComments').visibility === false)
      {
         removeStyle(prefix + fname);
         addStyle(prefix + fname, '#app-head { --background_default: #FFC107 ; }');
      }
      else
      {
         removeStyle(prefix + fname);
      }
      // extra bit because killNodeLayer will be inactive
      getById("_btnKillNode").style.backgroundColor = "";
   }
   function adjustGSV()
   {
      let fname = 'adjustGSV';
      let styles = "";
      let C = getById('_inpGSVContrast');
      let B = getById('_inpGSVBrightness');
      let I = getChecked('_cbGSVInvert');
      if (I !== null)
      {
         if (C.value < 10) C.value = 10;
         if (B.value < 10) B.value = 10;
         styles += '.gm-style { filter: contrast(' + C.value + '%) ';
         styles += 'brightness(' + B.value + '%) ';
         if (I === true)
         {
            styles += 'invert(1); }';
         }
         else
         {
            styles += 'invert(0); }';
         }
         removeStyle(prefix + fname);
         if ((C.value != 100) || (B.value != 100) || I) addStyle(prefix + fname, styles);
      }
   }
   function GSVWidth()
   {
      let fname = 'GSVWidth';
      removeStyle(prefix + fname);
      let w = getById('_inpGSVWidth').value;
      if (w != 50)
      {
         let styles = "";
         styles += '#editor-container #map.street-view-mode #waze-map-container { width: ' + (100 - w) + '%; }';
         styles += '#editor-container #street-view-container { width: ' + w + '%; }';
         styles += '#editor-container #map #street-view-drag-handle { left: ' + (100 - w) + '%; }';
         addStyle(prefix + fname, styles);
      }
      window.dispatchEvent(new Event('resize'));
   }
   function GSVWidthReset()
   {
      getById('waze-map-container').style = null;
      getById('street-view-container').style = null;
      getById('street-view-drag-handle').style = null;
      // Check for WME Street View Availability
      // This can be removed soon - WME SVA no longer remembers GSV width
      if (localStorage.WMEStreetViewWidth)
      {
         localStorage.WMEStreetViewWidth = '';
      }
      window.dispatchEvent(new Event('resize'));
   }
   function moveChatIcon()
   {
      let fname = 'moveChatIcon';
      let styles = "";
      let enabled = getChecked('_cbMoveChatIcon');
      if (enabled === true)
      {
         styles += '#chat-overlay { left: inherit !important; right: 60px !important;}';
         styles += '#chat-overlay #chat-toggle { right: 0px !important; }';
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
      }
   }
   function highlightInvisible()
   {
      let fname = 'highlightInvisible';
      let styles = "";
      let enabled = getChecked('_cbHighlightInvisible');
      if (enabled === true)
      {
         styles += '#chat-overlay.visible-false #chat-toggle button { filter: none; background-color: #ff0000c0; }';
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
      }
   }
   function darkenSaveLayer()
   {
      let fname = 'darkenSaveLayer';
      let styles = "";
      let enabled = getChecked('_cbDarkenSaveLayer');
      if (enabled === true)
      {
         styles += '#map-viewport-overlay { background-color: dimgrey !important; }';
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
      }
   }
   function swapRoadsGPS()
   {
      let fname = 'swapRoadsGPS';
      let styles = "";
      let enabled = getChecked('_cbSwapRoadsGPS');
      if (enabled === true)
      {
         var rlName = "roads";
         var glName = "gps_points";
         var roadLayerId = W.map.getLayerByUniqueName(rlName).id;
         var GPSLayerId = W.map.getLayerByUniqueName(glName).id;
         var roadLayerZ = W.map.getLayerByUniqueName(rlName).getZIndex();
         var GPSLayerZ = W.map.getLayerByUniqueName(glName).getZIndex();
         logit("Layers identified\n\tRoads: " + roadLayerId + "," + roadLayerZ + "\n\tGPS: " + GPSLayerId + "," + GPSLayerZ, "info");
         styles += '#' + roadLayerId.replace(/\./g, "\\2e") + ' { z-index: ' + GPSLayerZ + ' !important; }';
         styles += '#' + GPSLayerId.replace(/\./g, "\\2e") + ' { z-index: ' + roadLayerZ + ' !important; }';
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
      }
   }
   function killNode()
   {
      getById(W.map.getLayerByUniqueName("nodes").id + "_root").style.display = "none";
      getById("_btnKillNode").style.backgroundColor = "yellow";
   }
   function showMapBlockers()
   {
      let fname = 'showMapBlockers';
      let styles = "";
      let enabled = getChecked('_cbShowMapBlockers');
      if (enabled === true)
      {
         styles += '.street-view-layer { background-color: rgba(255,0,0,0.3); }';
         styles += '.overlay-buttons-container.top { background-color: rgba(255,0,0,0.3); }';
         styles += '.overlay-buttons-container.bottom { background-color: rgba(255,0,0,0.3); }';
         styles += '#street-view-drag-handle { background-color: rgba(255,0,0,0.3); }';
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
      }
   }
   function disableBridgeButton()
   {
      let fname = 'disableBridgeButton';
      let styles = "";
      let enabled = getChecked('_cbDisableBridgeButton');
      if (enabled === true)
      {
         styles += '.add-bridge { pointer-events: none; opacity: 0.4; }';
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
      }
   }
   function disablePathButton()
   {
      let fname = 'disablePathButton';
      let styles = "";
      let enabled = getChecked('_cbDisablePathButton');
      if (enabled === true)
      {
         styles += '.path-icon { pointer-events: none; opacity: 0.4; }';
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
      }
   }
   function disableHazardMarkers()
   {
      let fname = 'disableHazardMarkers';
      let styles = "";
      let enabled = getChecked('_cbDisableHazardMarkers');
      if (enabled === true)
      {
         styles += '.permanent-hazard-marker { pointer-events: none; opacity: 0.2; }';
         styles += '.permanentHazardMarker--Paqzi { pointer-events: none; opacity: 0.2; }';
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
      }
   }
   function disableKinetic()
   {
      let enabled = isBeta || getChecked('_cbDisableKinetic');
      if (enabled === true)
      {
         W.map.controls.find(control => control.dragPan).dragPan.kinetic = null;
      }
      else if (enabled === false)
      {
         W.map.controls.find(control => control.dragPan).dragPan.kinetic = kineticDragParams;
      }
   }
   function disableAnimatedZoom()
   {
      let enabled = getChecked('_cbDisableZoomAnimation');
      if (enabled === true)
      {
         W.map.segmentLayer.map.zoomDuration = 0;
      }
      else if (enabled === false)
      {
         W.map.segmentLayer.map.zoomDuration = 20;
      }
   }
   function disableScrollZoom()
   {
      var controller = null;
      if (W.map.navigationControl)
      {
         controller = W.map.navigationControl;
      }
      else if (W.map.controls.find(control => control.CLASS_NAME == 'OpenLayers.Control.Navigation'))
      {
         controller = W.map.controls.find(control => control.CLASS_NAME == 'OpenLayers.Control.Navigation');
      }
      else
      {
         logit('Cannot find zoom wheel controls - please alert script maintainers', 'error');
      }
      if (controller !== null)
      {
         let enabled = getChecked('_cbDisableScrollZoom');
         if (enabled === true)
         {
            controller.disableZoomWheel();
         }
         else if (enabled === false)
         {
            controller.enableZoomWheel();
         }
      }
   }
   function PCclicked()
   {
      let itemType = checkSelectableItemInURL();
      if (itemType !== null)
      {
         reselectItems(itemType);
      }
   }
   function reselectItems(itemType)
   {
      let match = searchSelectableItemsInURL(itemType[0]);
      if (match)
      {
         let IDArray = decodeURIComponent(match[1]).split(',');
         let objectArray = [];
         for (let i = 0; i < IDArray.length; i++)
         {
            let object = W.model[itemType[0]].objects[IDArray[i]];
            if (typeof object != 'undefined') objectArray.push(object);
         }
         if (itemType[1])
         {
            W.selectionManager.setSelectedModels(objectArray);
         }
         else
         {
            W.selectionManager.setSelectedModels(objectArray[0]);
         }
      }
   }
   function DSIclicked(e)
   {
      let tga = e.target.getAttribute("orig");
      if(tga !== null)
      {
         // tga is only non-null if the user has clicked on one of the
         // dontShowAgain checkboxes within the FUME_DSA container element
         let DSA = JSON.parse(localStorage.dontShowAgain);
         DSA[tga] = e.target.checked;
         localStorage.dontShowAgain = JSON.stringify(DSA);
      }
   }

   // These two event handlers act in concert with the change log restyling carried
   // out in disableSaveBlocker(), to allow the change log to continue being shown
   // and hidden as expected when the user mouses-over or out of the save button,
   // but not for it to then be displayed as soon as an edit is made whilst the
   // disable save blocker option is enabled and ctrl+s has been used to save an
   // earlier edit.  No, I still have NO idea why this combination of FUME setting
   // and WME keyboard shortcut causes the log to appear, hence this slightly
   // contrived workaround to essentially replicate the visibility changes WME
   // ought to be doing itself...
   let inSaveDetails = false;
   let inSaveButton = false;
   function saveMouseOver()
   {
      let styles = '.changes-log { display: block !important; }';
      addStyle(prefix, styles);

      inSaveButton = true;
      window.setTimeout(addSaveDetailsEventListeners, 100);
   }
   function saveMouseOut()
   {
      inSaveButton = false;
      window.setTimeout(saveMouseOutDeferred, 1000);
   }
   function addSaveDetailsEventListeners()
   {
      // Since adding the above fix, it's come to my attention that it has the potential to break
      // the ability of the save details popup to remain visible when moused-over.  To unbreak
      // this without rebreaking the ctrl+s fix, we add similar mouseover/out handlers to the popup,
      // noting that as it's dynamically generated whenever the save button is moused-over when
      // saves are pending, we have to reapply the handlers each time...  The following function is
      // therefore called from the buttom mouseover handler above, with a short delay to give WME a
      // chance to generate the element before we try dealing with it.
      if (document.querySelector('.changes-log') !== null)
      {
         document.querySelector('.changes-log').addEventListener('mouseover', saveDetailsMouseOver, true);
         document.querySelector('.changes-log').addEventListener('mouseout', saveDetailsMouseOut, true);
      }
   }
   function saveDetailsMouseOver()
   {
      // The mouseover handler simply sets a flag to let the rest of the script know that we're 
      // in the popup
      inSaveDetails = true;
   }
   function saveDetailsMouseOut()
   {
      // Whilst the mouseout handler both clears the flag and also calls the mouseout handler for
      // the save button (to hide the popup) unless the corresponding flag for the button itself
      // hasn't been set by its mouseover handler - i.e. we only want to hide the popup if the
      // mouse is over neither the save button or the details popup...
      inSaveDetails = false;
      if (inSaveButton == false)
      {
         saveMouseOut();
      }
   }
   function saveMouseOutDeferred()
   {
      // To account for the order in which the save button mouseout and details popup mouseover
      // handlers fire (i.e. in the wrong order to make this fix easy...), the buttom mouseout
      // handler is modified to perform most of its processing after a short delay - this gives
      // the popup mouseover handler time to fire and set its flag, so that when we get here
      // we know that the mouseout event was triggered by movement of the pointer between the
      // button and popup, rather than out of the button in some other direction, and therefore
      // we should avoid hiding the popup...
      if ((inSaveDetails == false) && (inSaveButton == false))
      {
         let styles = '.changes-log { display: none !important; }';
         addStyle(prefix, styles);
      }
   }
   function disableSaveBlocker()
   {
      let fname = 'disableSaveBlocker';
      let styles = "";
      let enabled = getChecked('_cbDisableSaveBlocker');
      if (enabled === true)
      {
         styles += '#map-viewport-overlay { z-index: 0 !important; }';
         styles += '.changes-log { display: none !important; }';
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
      }
   }
   function DisableUITransitions()
   {
      let fname = 'DisableUITransitions';
      let styles = "";
      let sliderTrans = "";

      // Side panel and main menu fixes we can apply directly via CSS mods...
      let enabled = getChecked('_cbDisableUITransitions');
      if (enabled === true)
      {
         styles += '.collapsible-container { transition: none!important; }';
         styles += '#filter-panel-region { transition: none!important; }';
         styles += '.menu { transition: none!important; }';
         addStyle(prefix + fname, styles);

         sliderTrans = ".wz-slider::before {transition:all 0s linear 0s!important;}";
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);

         sliderTrans = ".wz-slider::before {transition:all 400ms ease 0s!important;}";
      }

      // And now the stuff hidden in shadowroots...

      // WME adds transition styles both to the slider itself and also to its ::before
      // pseudo-element, so we can't simply apply our own style override to the slider
      // directly as this doesn't affect the ::before style.  To get around this, we
      // instead apply the override to the parent element as a new CSS entry to be
      // applied to its slider children - this then takes precedence over anything
      // defined on the slider itself...
      let nTS = document.querySelectorAll('wz-toggle-switch').length;
      while (nTS > 0)
      {
         let tsObj = document.querySelectorAll('wz-toggle-switch')[nTS - 1];
         let sr = tsObj.shadowRoot.querySelector('.wz-switch');

         if (sr !== null)
         {
            // If we haven't already set up our CSS entry on this parent element, do
            // so now...
            if (sr.querySelector('#fume') == null)
            {
               let sliderStyle = document.createElement('style');
               sliderStyle.id = "fume";
               sr.insertBefore(sliderStyle, sr.firstChild);
            }

            // Now we know the parent has our CSS entry, update its contents according to
            // whether we're enabling or disabling transition effects
            sr.querySelector('#fume').innerHTML = sliderTrans;
         }
         --nTS;
      }
   }
   function colourBlindTurns()
   {
      let fname = 'colourBlindTurns';
      let styles = "";
      let enabled = getChecked('_cbColourBlindTurns');
      if (enabled === true)
      {
         styles += '.turn-arrow-state-open { filter: hue-rotate(90deg); }';
         addStyle(prefix + fname, styles);
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
      }
   }
   function unfloatButtons()
   {
      //// unfloat
      return;
      /*
      let fname = 'unfloatButtons';
      layersButton = getByClass('layer-switcher-button')[0];
      refreshButton = getByClass('reload-button')[0];
      shareButton = getByClass('share-location-button')[0];
      let enabled = getChecked('_cbUnfloatButtons');
      if (enabled === true)
      {
         unfloat();

         //hacks for other scripts
         if (getById('Info_div'))
         {
            getByClass('bottom overlay-buttons-container')[0].appendChild(getById('Info_div'));
            getById('Info_div').style.marginTop = '8px';
         }
         if (getById('BeenHere')) getById('BeenHere').style.top = '310px';
         //temporary hack for new button arrangements Map Nav Historic
         if (getById('prevIcon')) insertNodeBeforeNode(getById('prevIcon').parentNode, getById('nextIcon').parentNode);

         if (wmeFUinitialising) setTimeout(unfloat, 5000);
      }
      else if (enabled === false)
      {
         if (!wmeFUinitialising)
         {
            float();
            layersButton.onmouseover = null;
            document.body.onmouseleave = null;
            getById('layer-switcher-region').onmouseleave = null;
            removeStyle(prefix + fname);

            if (getById('Info_div'))
            {
               getByClass('overlay-buttons-container top')[0].appendChild(getById('Info_div'));
               getById('Info_div').style.marginTop = '';
            }
            if (getById('BeenHere')) getById('BeenHere').style.top = '280px';
         }
      }
      */
   }
   /*
   function unfloat_ReloadClickHandler()
   {
      // Clicking on the refresh button essentially just calls the following native function,
      // however once we do this then the bloody refresh button loses its onclick hander AGAIN,
      // so we need to reinstate it before we go...
      W.controller.reloadData();
      refreshButton.addEventListener("click", unfloat_ReloadClickHandler);
   }
   function SLBRelocate()
   {
      // Once the mutation observer code has decided that the share location popup needs relocation,
      // we first wait for it to become visible (usually this is true the first time we get in here,
      // but sometimes WME will surprise us by getting here a tad too quickly for the popup).
      //
      // Once the popup exists, we first hide it (to avoid it briefly appearing in its native position
      // before being relocated) and then we wait ever so slightly longer before trying to move it,
      // otherwise WME seems to occasionally overwrite our position with the native one again...
      let tippy = document.querySelector('.tippy-box');
      if (tippy === null)
      {
         window.setTimeout(SLBRelocate, 100);
      }
      else
      {
         tippy.parentElement.style.visibility = "hidden";
         window.setTimeout(SLBApplyTransform, 100);
      }
   }
   function SLBApplyTransform()
   {
      // Finally we get to actually restyle the popup...  This is simply a case of replacing the native
      // transform (which nudges it a little to tne left and down relative to the top-right corner of the
      // map viewport) with our own (which nudges it a little less to the left, but a lot further down,
      // based on how far away the share location button is).  And then remembering to make it visible
      // again, so the user sees it appearing in the desired position as if it was always meant to be :-)
      let tippy = document.querySelector('.tippy-box').parentElement;
      let tipBCR = tippy.getBoundingClientRect();
      let slbBCR = document.querySelector('.share-location-button').getBoundingClientRect();
      let tY = (slbBCR.top - tipBCR.bottom) + "px";
      tippy.style.transform = "translate(-20px, " + tY + ")";
      tippy.style.visibility = "";
   }
   */
   var OBObserver = new MutationObserver(function ()
   {
      // To check when the share location button popup displays, you'd think we could just use an onclick handler
      // on the share location button itself, but no, that would be FAR too easy...  Whilst setting an onclick
      // does work the first time, the way WME re-renders the button to change it between its selected and
      // unselected states causes the handler to be lost, and I couldn't figure out how to get it reapplied
      // reliably/efficiently.  
      //
      // So here we are with plan B - a mutation observer attached to the DOM element that contains the button,
      // within which we can then check firstly to see if the button has been moved into the bottom bar (if
      // it's in its native location then we don't need to relocate the popup), and then if the button is
      // active.  If it is, then we know the popup is visible and in need of relocation... 

      /*
      //// unfloat
      if (getChecked('_cbUnfloatButtons') === true)
      {
         if(document.querySelector('.share-location-button.overlay-button.overlay-button-active') !== null)
         {
            SLBRelocate();
         }
      }
      */
   });
   function unfloat()
   {
      //// unfloat
      return;
      /*
      if (getChecked('_cbUnfloatButtons') === true)
      {
         let slb = getByClass('share-location-button')[0];
         let wcp = getByClass('WazeControlPermalink')[0];
         if ((slb !== undefined) && (wcp !== undefined))
         {
            // as we may end up calling this function multiple times, we first refloat so that any changes
            // made here will always be applied to the default styles rather than any we've already changed
            float();

            let mui = getChecked('_cbMoveUserInfo');
            if (mui === false)
            {
               insertNodeAfterNode(layersButton, document.querySelector('wz-user-box'));
            }
            else if (mui === true)
            {
               insertNodeAfterNode(layersButton, getById('save-button').parentElement.parentElement);
            }
            layersButton.classList.add('toolbar-button');
            layersButton.firstChild.classList.add('item-container');
            layersButton.firstChild.classList.add('item-icon', 'w-icon', 'w-icon-layers');

            insertNodeBeforeNode(refreshButton, document.querySelector('.secondary-toolbar'));
            refreshButton.classList.add('toolbar-button');
            refreshButton.firstChild.classList.add('item-container');
            refreshButton.firstChild.classList.add('item-icon', 'w-icon', 'w-icon-refresh');
            // Something's changed in the latest iteration of WME which means that moving the refresh button
            // stops it accepting mouse clicks, so we need to set up a new onclick handler to replicate the
            // desired behaviour...
            refreshButton.addEventListener("click", unfloat_ReloadClickHandler, { once: true });

            var lmBCR = wcp.getBoundingClientRect();
            var sbBCR = slb.getBoundingClientRect();
            var sbTop = lmBCR.top - sbBCR.top - 3;

            var styles = '';
            styles += '.share-location-button { position: absolute; top: ' + sbTop + 'px; height: 18px; }';
            styles += '#edit-buttons .overlay-button-disabled { opacity: 0.5; cursor: not-allowed; }';
            styles += '.share-location-button-region { display: inline-block; }';
            styles += '.w-icon-layers { top: 0px!important; }';
            styles += 'div.WazeControlPermalink { padding-right: 64px; }';
            styles += 'div.share-location-button-region > div > div > i { line-height: 18px; }';
            styles += 'a.w-icon.w-icon-link { line-height:17px; font-size: 20px; }';
            // correct button sizing when moved into bottom bar
            styles += '.share-location-button { height:24px; width:30px; }';
            addStyle(prefix + 'unfloatButtons2', styles);
         }
      }
      */
   }
   function float()
   {
      //// temporary
      return;
      /*
      let elm = getByClass('overlay-buttons-container top')[0];
      if (elm !== undefined)
      {
         elm.appendChild(layersButton);
         layersButton.classList.remove('toolbar-button');
         layersButton.firstChild.classList.remove('item-container');
         layersButton.firstChild.classList.remove('item-icon', 'w-icon', 'w-icon-layers');
         layersButton.firstChild.classList.add('overlay-button');
         layersButton.firstChild.classList.add('w-icon', 'w-icon-layers');

         elm.appendChild(refreshButton);
         refreshButton.classList.remove('toolbar-button');
         refreshButton.firstChild.classList.remove('item-container');
         refreshButton.firstChild.classList.remove('item-icon', 'w-icon', 'w-icon-refresh');
         refreshButton.firstChild.classList.add('overlay-button');
         refreshButton.firstChild.classList.add('w-icon', 'w-icon-refresh');

         elm.appendChild(shareButton);

         removeStyle(prefix + 'unfloatButtons2');
      }
      */
   }
   function hackGSVHandle()
   {
      let fname = 'hackGSVHandle';
      let styles = "";
      let enabled = getChecked('_cbHackGSVHandle');
      if (enabled === true)
      {
         styles += '#editor-container #map.street-view-mode #street-view-drag-handle { height: 29px; background: lightgrey; font-size: 24px; border-radius: 8px; text-align: center; padding-top: 2px; border: 1px black solid; }';
         addStyle(prefix + fname, styles);
         getById('street-view-drag-handle').classList.add('w-icon', 'w-icon-round-trip');
         getById('street-view-drag-handle').title = 'Double-click to reset\ndefault width.';
      }
      else if (enabled === false)
      {
         removeStyle(prefix + fname);
         getById('street-view-drag-handle').removeAttribute('class');
         getById('street-view-drag-handle').removeAttribute('title');
      }
   }
   let enGeoLayerNames =
   [
      "sketch",
      "venues",
      "mapComments",
      "permanent_hazard_school_zones",
      "restricted_driving_areas_polygon"
   ];
   function enlargeGeoNodes(forceOff)
   {
      let fname = 'enlargeGeoNodes';
      removeStyle(prefix + fname);
      let styles = "";
      if (getById('_inpEnlargeGeoNodes').value < 6) getById('_inpEnlargeGeoNodes').value = 6;
      if ((getChecked('_cbEnlargeGeoNodes') === true) && (forceOff === false))
      {
         let newStyle = '{ transform-box: fill-box; transform-origin: center; vector-effect: non-scaling-stroke; transform:scale(' + (getById('_inpEnlargeGeoNodes').value / 6) + '); }';
         for(let i = 0; i < enGeoLayerNames.length; ++i)
         {
            styles += '#' + W.map.getLayerByUniqueName(enGeoLayerNames[i]).id + '_vroot [id^="OpenLayers_Geometry_Point_"][fill-opacity="1"][r="6"] ' + newStyle;
         }
         addStyle(prefix + fname, styles);
      }
   }
   function enlargeGeoHandles(forceOff)
   {
      let fname = 'enlargeGeoHandles';
      removeStyle(prefix + fname);
      let styles = "";
      if (getById('_inpEnlargeGeoHandles').value < 4) getById('_inpEnlargeGeoHandles').value = 4;
      if ((getChecked('_cbEnlargeGeoHandlesFU') === true) && (forceOff === false))
      {
         let newStyle = '{ transform-box: fill-box; transform-origin: center; vector-effect: non-scaling-stroke; transform:scale(' + (getById('_inpEnlargeGeoHandles').value / 4) + '); }';
         for(let i = 0; i < enGeoLayerNames.length; ++i)
         {
            styles += '#' + W.map.getLayerByUniqueName(enGeoLayerNames[i]).id + '_vroot [id^="OpenLayers_Geometry_Point_"][fill-opacity="0.6"][r="4"] ' + newStyle;
         }
         addStyle(prefix + fname, styles);
      }
   }
   function enlargePointMCs()
   {
      let fname = 'enlargePointMCs';
      removeStyle(prefix + fname);
      let styles = "";
      if (getById('_inpEnlargePointMCs').value < 1) getById('_inpEnlargePointMCs').value = 1;
      if (getChecked('_cbEnlargePointMCs') === true)
      {
         let newStyle = '{ fill: #ffff00; fill-opacity: 0.75; transform-box: fill-box; transform-origin: center; vector-effect: non-scaling-stroke; transform:scale(' + getById('_inpEnlargePointMCs').value + '); }';
         let newStyleHover = '{ transform-box: fill-box; transform-origin: center; vector-effect: non-scaling-stroke; transform:scale(' + (0.25 + (getById('_inpEnlargePointMCs').value / 2)) + '); }';
         styles += '#' + W.map.commentLayer.id + '_vroot [id^="OpenLayers_Geometry_Point_"][stroke="#ffffff"][r="6"]' + newStyle;
         styles += '#' + W.map.commentLayer.id + '_vroot [id^="OpenLayers_Geometry_Point_"][stroke="#ffffff"][r="12"]' + newStyleHover;
         addStyle(prefix + fname, styles);
      }
   }
   function enlargeTurnClosures()
   {
      let fname = 'enlargeTurnClosures';
      removeStyle(prefix + fname);
      if (getById('_inpEnlargeTurnClosures').value < 1) getById('_inpEnlargeTurnClosures').value = 1;
      if (getChecked('_cbEnlargeTurnClosures') === true)
      {
         let newStyle = '.turn-closure-badge { scale: ' + getById('_inpEnlargeTurnClosures').value + '; }';

         //// hacky PoC for hovered turn arrow visibility improvements...
         ////newStyle += '.hover { scale: ' + getById('_inpEnlargeTurnClosures').value + '; }';  
         newStyle += '.hover { scale: 1.1; filter: hue-rotate(300deg) contrast(400%) saturate(100%) }';
         addStyle(prefix + fname, newStyle);
      }
   }
   function enlargeNodeClosures()
   {
      let fname = 'enlargeNodeClosures';
      removeStyle(prefix + fname);
      if (getById('_inpEnlargeNodeClosures').value < 1) getById('_inpEnlargeNodeClosures').value = 1;
      if (getChecked('_cbEnlargeNodeClosures') === true)
      {
         let newStyle = '.closure-node { scale: ' + getById('_inpEnlargeNodeClosures').value + '; }';
         newStyle += '.turnClosureMarker--Ol3jg { scale: ' + getById('_inpEnlargeNodeClosures').value + '; }';
         addStyle(prefix + fname, newStyle);
      }
   }
   function addGlobalStyle(css)
   {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head)
      {
         return;
      }
      style = document.createElement('style');
      style.innerHTML = modifyHTML(css);
      head.appendChild(style);
   }
   function addStyle(ID, css)
   {
      var head, style;
      head = document.getElementsByTagName('head')[0];
      if (!head)
      {
         return;
      }
      removeStyle(ID); // in case it is already there
      style = document.createElement('style');
      style.innerHTML = modifyHTML(css);
      style.id = ID;
      head.appendChild(style);
   }
   function removeStyle(ID)
   {
      var style = document.getElementById(ID);
      if (style)
      {
         style.parentNode.removeChild(style);
      }
   }
   function getByClass(classname, node)
   {
      if (!node)
      {
         node = document;
      }
      let retval = node.querySelector('.' + classname);
      return retval;
   }
   function getById(node)
   {
      return document.querySelector('#' + node);
   }
   function insertNodeBeforeNode(insertNode, beforeNode)
   {
      if ((insertNode == null) || (beforeNode == null))
      {
         logit("null node during insert", "error");
      }
      else
      {
         beforeNode.parentNode.insertBefore(insertNode, beforeNode);
      }
   }
   function insertNodeAfterNode(insertNode, afterNode)
   {
      insertNodeBeforeNode(insertNode, afterNode);
      insertNodeBeforeNode(afterNode, insertNode);
   }
   function logit(msg, typ)
   {
      if (!typ)
      {
         console.log(prefix + ": " + msg);
      }
      else
      {
         switch (typ)
         {
            case "error":
               console.error(prefix + ": " + msg);
               break;
            case "warning":
               console.warn(prefix + ": " + msg);
               break;
            case "info":
               console.info(prefix + ": " + msg);
               break;
            case "debug":
               if (debug)
               {
                  console.warn(prefix + ": " + msg);
               }
               break;
            default:
               console.log(prefix + " unknown message type: " + msg);
               break;
         }
      }
   }

   init1();
})();
