// ==UserScript==
// @name			Boton Descarga MP3 con Inicio y Final para videos de Youtube
// @author			ELDiDi
// @version			1.3
// @description			Al cargar un video de Youtube se agrega un Boton para descargar el MP3 de manera directa haciendo uso del servicio (http://youtubeinmp3.com/api/). Ademas puedes indicar el Inicio y Final del audio para evitar partes del video no deseadas como dialogos o intros.
// @match			https://www.youtube.com/*
// @require			http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @grant GM_xmlhttpRequest
// @grant GM_getValue
// @grant GM_setValue
// @run-at document-end
// @icon data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAYAAACqaXHeAAAACXBIWXMAABcSAAAXEgFnn9JSAABD82lUWHRYTUw6Y29tLmFkb2JlLnhtcAAAAAAAPD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4KPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iQWRvYmUgWE1QIENvcmUgNS42LWMwNjcgNzkuMTU3NzQ3LCAyMDE1LzAzLzMwLTIzOjQwOjQyICAgICAgICAiPgogICA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPgogICAgICA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIgogICAgICAgICAgICB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iCiAgICAgICAgICAgIHhtbG5zOmRjPSJodHRwOi8vcHVybC5vcmcvZGMvZWxlbWVudHMvMS4xLyIKICAgICAgICAgICAgeG1sbnM6cGhvdG9zaG9wPSJodHRwOi8vbnMuYWRvYmUuY29tL3Bob3Rvc2hvcC8xLjAvIgogICAgICAgICAgICB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIKICAgICAgICAgICAgeG1sbnM6c3RFdnQ9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZUV2ZW50IyIKICAgICAgICAgICAgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiCiAgICAgICAgICAgIHhtbG5zOnRpZmY9Imh0dHA6Ly9ucy5hZG9iZS5jb20vdGlmZi8xLjAvIgogICAgICAgICAgICB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyI+CiAgICAgICAgIDx4bXA6Q3JlYXRvclRvb2w+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC94bXA6Q3JlYXRvclRvb2w+CiAgICAgICAgIDx4bXA6Q3JlYXRlRGF0ZT4yMDE2LTEwLTE1VDAzOjEzOjM1LTAzOjAwPC94bXA6Q3JlYXRlRGF0ZT4KICAgICAgICAgPHhtcDpNb2RpZnlEYXRlPjIwMTYtMTAtMTVUMDM6MTc6NDEtMDM6MDA8L3htcDpNb2RpZnlEYXRlPgogICAgICAgICA8eG1wOk1ldGFkYXRhRGF0ZT4yMDE2LTEwLTE1VDAzOjE3OjQxLTAzOjAwPC94bXA6TWV0YWRhdGFEYXRlPgogICAgICAgICA8ZGM6Zm9ybWF0PmltYWdlL3BuZzwvZGM6Zm9ybWF0PgogICAgICAgICA8cGhvdG9zaG9wOkNvbG9yTW9kZT4zPC9waG90b3Nob3A6Q29sb3JNb2RlPgogICAgICAgICA8cGhvdG9zaG9wOlRleHRMYXllcnM+CiAgICAgICAgICAgIDxyZGY6QmFnPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHBob3Rvc2hvcDpMYXllck5hbWU+WzwvcGhvdG9zaG9wOkxheWVyTmFtZT4KICAgICAgICAgICAgICAgICAgPHBob3Rvc2hvcDpMYXllclRleHQ+WzwvcGhvdG9zaG9wOkxheWVyVGV4dD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8cGhvdG9zaG9wOkxheWVyTmFtZT5bPC9waG90b3Nob3A6TGF5ZXJOYW1lPgogICAgICAgICAgICAgICAgICA8cGhvdG9zaG9wOkxheWVyVGV4dD5bPC9waG90b3Nob3A6TGF5ZXJUZXh0PgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6QmFnPgogICAgICAgICA8L3Bob3Rvc2hvcDpUZXh0TGF5ZXJzPgogICAgICAgICA8eG1wTU06SW5zdGFuY2VJRD54bXAuaWlkOjg2YzM3ZjkyLTI3NjktZjY0Ny1iZWJlLWE0MDYwZjZmMWJlZjwveG1wTU06SW5zdGFuY2VJRD4KICAgICAgICAgPHhtcE1NOkRvY3VtZW50SUQ+YWRvYmU6ZG9jaWQ6cGhvdG9zaG9wOjBmOWI2NmRjLTkyOWYtMTFlNi1hZjhmLWIzMTJjYzk3YjllZTwveG1wTU06RG9jdW1lbnRJRD4KICAgICAgICAgPHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOjg1NmMyNDAzLTljYTgtYzM0YS1hYzEwLTc0OGJkNTZkZjFjMTwveG1wTU06T3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8eG1wTU06SGlzdG9yeT4KICAgICAgICAgICAgPHJkZjpTZXE+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNyZWF0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo4NTZjMjQwMy05Y2E4LWMzNGEtYWMxMC03NDhiZDU2ZGYxYzE8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTYtMTAtMTVUMDM6MTM6MzUtMDM6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmNvbnZlcnRlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6cGFyYW1ldGVycz5mcm9tIGltYWdlL3BuZyB0byBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wPC9zdEV2dDpwYXJhbWV0ZXJzPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgICAgPHJkZjpsaSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDphY3Rpb24+c2F2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0Omluc3RhbmNlSUQ+eG1wLmlpZDo5MzQxNmMxNC04YzdmLWE0NDUtOGNhNC1kMDYyNTVlMzk0NTU8L3N0RXZ0Omluc3RhbmNlSUQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDp3aGVuPjIwMTYtMTAtMTVUMDM6MTc6MzItMDM6MDA8L3N0RXZ0OndoZW4+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpzb2Z0d2FyZUFnZW50PkFkb2JlIFBob3Rvc2hvcCBDQyAyMDE1IChXaW5kb3dzKTwvc3RFdnQ6c29mdHdhcmVBZ2VudD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmNoYW5nZWQ+Lzwvc3RFdnQ6Y2hhbmdlZD4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPnNhdmVkPC9zdEV2dDphY3Rpb24+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDppbnN0YW5jZUlEPnhtcC5paWQ6NzMxMWI3N2MtODk0ZS03MjRjLWIxYzgtOTA1YjkxMjQzODk5PC9zdEV2dDppbnN0YW5jZUlEPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6d2hlbj4yMDE2LTEwLTE1VDAzOjE3OjQxLTAzOjAwPC9zdEV2dDp3aGVuPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6c29mdHdhcmVBZ2VudD5BZG9iZSBQaG90b3Nob3AgQ0MgMjAxNSAoV2luZG93cyk8L3N0RXZ0OnNvZnR3YXJlQWdlbnQ+CiAgICAgICAgICAgICAgICAgIDxzdEV2dDpjaGFuZ2VkPi88L3N0RXZ0OmNoYW5nZWQ+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5jb252ZXJ0ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+ZnJvbSBhcHBsaWNhdGlvbi92bmQuYWRvYmUucGhvdG9zaG9wIHRvIGltYWdlL3BuZzwvc3RFdnQ6cGFyYW1ldGVycz4KICAgICAgICAgICAgICAgPC9yZGY6bGk+CiAgICAgICAgICAgICAgIDxyZGY6bGkgcmRmOnBhcnNlVHlwZT0iUmVzb3VyY2UiPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6YWN0aW9uPmRlcml2ZWQ8L3N0RXZ0OmFjdGlvbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnBhcmFtZXRlcnM+Y29udmVydGVkIGZyb20gYXBwbGljYXRpb24vdm5kLmFkb2JlLnBob3Rvc2hvcCB0byBpbWFnZS9wbmc8L3N0RXZ0OnBhcmFtZXRlcnM+CiAgICAgICAgICAgICAgIDwvcmRmOmxpPgogICAgICAgICAgICAgICA8cmRmOmxpIHJkZjpwYXJzZVR5cGU9IlJlc291cmNlIj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OmFjdGlvbj5zYXZlZDwvc3RFdnQ6YWN0aW9uPgogICAgICAgICAgICAgICAgICA8c3RFdnQ6aW5zdGFuY2VJRD54bXAuaWlkOjg2YzM3ZjkyLTI3NjktZjY0Ny1iZWJlLWE0MDYwZjZmMWJlZjwvc3RFdnQ6aW5zdGFuY2VJRD4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OndoZW4+MjAxNi0xMC0xNVQwMzoxNzo0MS0wMzowMDwvc3RFdnQ6d2hlbj4KICAgICAgICAgICAgICAgICAgPHN0RXZ0OnNvZnR3YXJlQWdlbnQ+QWRvYmUgUGhvdG9zaG9wIENDIDIwMTUgKFdpbmRvd3MpPC9zdEV2dDpzb2Z0d2FyZUFnZW50PgogICAgICAgICAgICAgICAgICA8c3RFdnQ6Y2hhbmdlZD4vPC9zdEV2dDpjaGFuZ2VkPgogICAgICAgICAgICAgICA8L3JkZjpsaT4KICAgICAgICAgICAgPC9yZGY6U2VxPgogICAgICAgICA8L3htcE1NOkhpc3Rvcnk+CiAgICAgICAgIDx4bXBNTTpEZXJpdmVkRnJvbSByZGY6cGFyc2VUeXBlPSJSZXNvdXJjZSI+CiAgICAgICAgICAgIDxzdFJlZjppbnN0YW5jZUlEPnhtcC5paWQ6NzMxMWI3N2MtODk0ZS03MjRjLWIxYzgtOTA1YjkxMjQzODk5PC9zdFJlZjppbnN0YW5jZUlEPgogICAgICAgICAgICA8c3RSZWY6ZG9jdW1lbnRJRD54bXAuZGlkOjg1NmMyNDAzLTljYTgtYzM0YS1hYzEwLTc0OGJkNTZkZjFjMTwvc3RSZWY6ZG9jdW1lbnRJRD4KICAgICAgICAgICAgPHN0UmVmOm9yaWdpbmFsRG9jdW1lbnRJRD54bXAuZGlkOjg1NmMyNDAzLTljYTgtYzM0YS1hYzEwLTc0OGJkNTZkZjFjMTwvc3RSZWY6b3JpZ2luYWxEb2N1bWVudElEPgogICAgICAgICA8L3htcE1NOkRlcml2ZWRGcm9tPgogICAgICAgICA8dGlmZjpPcmllbnRhdGlvbj4xPC90aWZmOk9yaWVudGF0aW9uPgogICAgICAgICA8dGlmZjpYUmVzb2x1dGlvbj4xNTAwMDAwLzEwMDAwPC90aWZmOlhSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpZUmVzb2x1dGlvbj4xNTAwMDAwLzEwMDAwPC90aWZmOllSZXNvbHV0aW9uPgogICAgICAgICA8dGlmZjpSZXNvbHV0aW9uVW5pdD4yPC90aWZmOlJlc29sdXRpb25Vbml0PgogICAgICAgICA8ZXhpZjpDb2xvclNwYWNlPjY1NTM1PC9leGlmOkNvbG9yU3BhY2U+CiAgICAgICAgIDxleGlmOlBpeGVsWERpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFhEaW1lbnNpb24+CiAgICAgICAgIDxleGlmOlBpeGVsWURpbWVuc2lvbj42NDwvZXhpZjpQaXhlbFlEaW1lbnNpb24+CiAgICAgIDwvcmRmOkRlc2NyaXB0aW9uPgogICA8L3JkZjpSREY+CjwveDp4bXBtZXRhPgogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIAogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgCiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAKICAgICAgICAgICAgICAgICAgICAgICAgICAgIAo8P3hwYWNrZXQgZW5kPSJ3Ij8+q/StgQAAACBjSFJNAAB6JQAAgIMAAPn/AACA6AAAUggAARVYAAA6lwAAF2/XWh+QAAAEbUlEQVR42uybb0yVVRzHP+fcP8AFBoGIQYItekEzAjemNlmyhgmzF4Wr0RzMtDfC+jOxZtpYrjWKtHTNF22yslljZW0aqC1doMSL1iCTYDXNRASR/+j9w73P8/SCB7kGKm8uPNzn+W7P7p678+yc7+ee8/ude55zhMaUfgeuAtH6vQrYIEGD5wTkAyuAxUCEXiT48fmU0D/9wA2gTYNGAd8J6PXrXux6g21BDRf3APAAsFfAZhawJHw7Dq9pcM02AwB5l+deETC40M3rXXSjHbrtsEPVjYugS85A7FMBnxEm0qaMfijhKwEEgi77zSAKfvjYBuUAx2JjZ11JciDASo9nzs1diIjgktM5q7IxisLTbncJ4B+FMr/u296jj4k+KB+F1yMNFNlC1BtKXXBRwB4ByHagE5b5YF9EGJvnzsz2bjRkxwDSP0FlpwQnJtBkvrwFu0cBeyIssUOpirkkoViBTLuEDRpEzuahHK+XpX6/YUws9/lY7vNN+77L4aA18v6WbPCsFJCHebVWAk+YGECGBB40MYBECUSZGIBDYnJZACwAFgALgAXAAmABsACERBogXK5eZ2rqzyIu7paC8RZcQgpAAIrb7R7v7s5PWL16RXRmZq1wucYVMw0BCVIF18DJk395Ozq2LC0vfzImJ+d7xeFANUsMCK6kq6bmN09r6/OL16/f4ExP/yUA8wpi3oLgwPHj9YmrVj2Vtm3bZkdKyt+BeYoP85oFrtfVBa4dPPj5Q6WluUlFRZW2pKSrcx0oDZEG/62uHhlqaNibXFiYG5ud/RExMaOKmQBMqufw4V53W9uO9IqKlfF5eV+qTqeqmAnApK5UV3eOnT1bmrppU350ZuYJ1en0amYCcLtH1NY2eTs6ihatW/eeKQGkbN2aG5WV9c3g6dNviRDVYTei8WVVVelDzc1vdh85skX1eCJsTL3SCmsAS8rK4m+2t796ef/+isDwcJKdiTfXoZQhAGTU1EQNt7SU9Z06td3f25sh57Bh8w4gbs2ajV2HDr3j7uzMEnPwixsGwKLi4rUj58+/PdjSUoCi3N7BRTgCUIPSTdquXY8Nnjmzs6++/iW8XmkLWjsgHAGooEpwJxYWpnl6erZfOXDg5cDYWIxRom/I2yGjokRCUVHlUGNj5Xh/f7LNYKkn5G0RPt/D/UeP1giDTjpC3iZNVQ093bRWhS0AFgALgAXAAmByAF4T+w9I4LqJAQxKAX+YGMA/dhXOCSiZTenWyMgZNyEvhBMj0/6jAD5okgo0AGbbLY8AHPCDFHBZ0w8TmUUaMA4nJLRKPxCAD4SJzNsAF7wvADkA9MKFG7BbJXTr7wab+OyzwzkXII7pAcABxMMXASjVwnjcK1DvgQ0B/f6Oo7ODwK9QFwEvhGNPsMFPQ1AwytRK0LSpsAovAlVh6P8TDQome8Jdj87qgWKPgEeAH8PAeDPwuAZv/N/8/dYpLwHPaBMgSvTj849OhAqkAecOUg/yI8BFDZokfA38ea+Y9t8AwrNcA9OsjQYAAAAASUVORK5CYII=
// @namespace https://greasyfork.org/users/73478
// @downloadURL https://update.greasyfork.org/scripts/24009/Boton%20Descarga%20MP3%20con%20Inicio%20y%20Final%20para%20videos%20de%20Youtube.user.js
// @updateURL https://update.greasyfork.org/scripts/24009/Boton%20Descarga%20MP3%20con%20Inicio%20y%20Final%20para%20videos%20de%20Youtube.meta.js
// ==/UserScript==


/*
--- waitForKeyElements():  A utility function, for Greasemonkey scripts, that detects and handles AJAXed content.

    Usage example:

        waitForKeyElements ("div.comments", commentCallbackFunction);

        //--- Page-specific function to do what we want when the node is found.
		function commentCallbackFunction (jNode) {
            jNode.text ("This comment changed by waitForKeyElements().");
        }

    IMPORTANT: This function requires your script to have loaded jQuery.
*/

function waitForKeyElements (
    selectorTxt,    /* Required: The jQuery selector string that
                        specifies the desired element(s).
                    */
    actionFunction, /* Required: The code to run when elements are
                        found. It is passed a jNode to the matched
                        element.
                    */
    bWaitOnce,      /* Optional: If false, will continue to scan for
                        new elements even after the first match is
                        found.
                    */
    iframeSelector  /* Optional: If set, identifies the iframe to
                        search.
                    */
) {
    var targetNodes, btargetsFound;

    if (typeof iframeSelector == "undefined")
        targetNodes     = $(selectorTxt);
    else
        targetNodes     = $(iframeSelector).contents ()
                                           .find (selectorTxt);

    if (targetNodes  &&  targetNodes.length > 0) {
        btargetsFound   = true;
        /*--- Found target node(s).  Go through each and act if they
            are new.
        */
        targetNodes.each ( function () {
            var jThis        = $(this);
            var alreadyFound = jThis.data ('alreadyFound')  ||  false;

            if (!alreadyFound) {
                //--- Call the payload function.
                var cancelFound     = actionFunction (jThis);
                if (cancelFound)
                    btargetsFound   = false;
                else
                    jThis.data ('alreadyFound', true);
            }
        } );
    }
    else {
        btargetsFound   = false;
    }

    //--- Get the timer-control variable for this selector.
    var controlObj      = waitForKeyElements.controlObj  ||  {};
    var controlKey      = selectorTxt.replace (/[^\w]/g, "_");
    var timeControl     = controlObj [controlKey];

    //--- Now set or clear the timer as appropriate.
    if (btargetsFound  &&  bWaitOnce  &&  timeControl) {
        //--- The only condition where we need to clear the timer.
        clearInterval (timeControl);
        delete controlObj [controlKey]
    }
    else {
        //--- Set a timer, if needed.
        if ( ! timeControl) {
            timeControl = setInterval ( function () {
                    waitForKeyElements (    selectorTxt,
                                            actionFunction,
                                            bWaitOnce,
                                            iframeSelector
                                        );
                },
                300
            );
            controlObj [controlKey] = timeControl;
        }
    }
    waitForKeyElements.controlObj   = controlObj;
}

// Fuerza la ejecucion del script para resolver el problema de tener que refrescar pagina para hacerlo funcionar
waitForKeyElements("#watch7-views-info", ObtenerInfoDelVideo);


// Comprueba el link por primera vez, obtiene la duracion del video, titulo enlace de descarga.
function ObtenerInfoDelVideo () {
	// Obtiene URL del video
	var VideoURL = document.URL.split("&")[0];

	// AJAX Load link
	var url = '//youtubeinmp3.com/fetch/?format=json&video='+VideoURL+"&hq=1";
	var method = 'GET';
	var xmlhttp = new XMLHttpRequest();
	if (!("withCredentials" in xmlhttp) && typeof XDomainRequest != "undefined") {
	// XDomainRequest for IE.
	xmlhttp = new XDomainRequest();
	xmlhttp.open(method, url);
	} else {
	// xmlhttp for Chrome/Firefox/Opera/Safari.
	xmlhttp.open(method, url, true);
	}

	// Old style
	if (!xmlhttp) {
	xmlhttp = new XMLHttpRequest();
	xmlhttp.open(method, url, true);
	}
	//Respuesta de la solicitud por AJAX
	xmlhttp.onload = function () {
		if (xmlhttp.readyState==4 && xmlhttp.status==200) {
			var response = xmlhttp.responseText;
			// Si la respuesta contiene la palabra titulo signigica que el servicio puede convertir el video, caso contrario muestra mensaje.
			if(response.indexOf("title") == -1){
			InsertDiv('Lamentablemente este video no puede ser convertido a MP3');
			}else{

			var JSONObj = JSON.parse(response);
			var VideoTitle = JSONObj.title;
			var VideoLength = JSONObj.length-1;
			var VideoDownloadLink = JSONObj.link;

			//Se declaran variables Globales
			window.VideoURL = VideoURL; //Global
			window.VideoTitle = VideoTitle;
			window.VideoLength = VideoLength;
			window.VideoDownloadLink = VideoDownloadLink;

			InsertDiv();

			}
		}
	};

	xmlhttp.onerror = function () {
	InsertDiv('Ocurrio un error al obtener datos del video. Por favor reintente la operacion.');
	};

	xmlhttp.send();
} // END FUNCTION ObtenerLink



function InsertDiv(Error){
	// Si se recibe Error, muestra el mensaje, caso contrario muestra Campos Inicio-Final y boton Descargar
	var DivNode = document.createElement('div'); //crea el elemento DIV 
	DivNode.id = 'id_div';

	if (Error){
	DivNode.style = 'padding:10px;';
	DivNode.innerHTML = '<strong>'+Error+'</strong>';
	DivNode.innerHTML += '<br>Puedes intentar hacerlo manualmente desde <a href="http://www.youtubeinmp3.com/download/?video='+ VideoURL +'" target="_blank">aqui</a>'; // y le mete el contenido
	}else{
		//Se agrega STYLE a la cabezera de la pagina
		var head, style;
		head = document.getElementsByTagName('head')[0];
		if (head){
		style = document.createElement('style');
		style.type = 'text/css';
		style.innerHTML = '#InicioTexto:hover, #FinalTexto:hover{text-decoration: underline;}';
		style.innerHTML += '#InicioTexto,#FinalTexto{cursor:pointer;}';
		style.innerHTML += '#startInput, #endInput{padding:3px;border-width:1px;border-color:#cccccc;border-style:solid;font-size:12px;text-align:center;}';
		style.innerHTML += '#DivForWarnings {padding:5px;border-width:0px;font-size:12px;color:red;text-align:center;}';
		head.appendChild(style);
		}
	
	DivNode.style = 'overflow: hidden;';
	DivNode.style = 'display:inline-block';
	DivNode.style = 'height:auto';
	//var htmlDuracion = 'Duracion: '+VideoLength+' seg. ';
	var htmlDuracion = '';
	var htmlInput1 = '<span id="InicioTexto" title="Haga click aqui para obtener la posicion actual del video.">Inicio:</span> <input id="startInput" onClick="this.select();" type="text" size="4"> ';
	var htmlInput2 = '<span id="FinalTexto" title="Haga click aqui para obtener la posicion actual del video.">Final:</span> <input id="endInput" onClick="this.select();" type="text" size="4">';

	var iframeSource = '//www.youtubeinmp3.com/es/widget/button/?video='+VideoURL+'';
	var iframe = '<iframe id="IframeBotonDescargar" style="width:150px;height:30px;border:0;padding-top: 5px; margin-left: 10px; margin-bottom: -7px;;" scrolling="no" src="'+iframeSource+'"></iframe>';
	var DivForWarnings = '<br><div id="DivForWarnings" style="display:none1">&nbsp;</div>';
	
	DivNode.innerHTML = htmlDuracion + htmlInput1 + htmlInput2 + iframe + DivForWarnings;
	}

	// Add to page
	var parentElement=document.getElementById('watch7-views-info');
	if (parentElement) {
		var DivDOM = document.getElementById('id_div');

		if (DivDOM) {
		console.log('El DOM ya estaba en la pagina.');
		DivDOM.parentElement.removeChild(DivDOM);
		console.log('El DOM fue removido.');
		}

		parentElement.appendChild(DivNode);
		console.log('El DOM ha sido incrustado.');

		//Se establecen funciones para los elementos Inicio-Final
		document.getElementById('InicioTexto').addEventListener('click', ObtenerPocisionInicio, false);
		document.getElementById('FinalTexto').addEventListener('click', ObtenerPocisionFinal, false);

		var InicioInput = document.getElementById('startInput');
		var FinalInput = document.getElementById('endInput');

		InicioInput.addEventListener("focus", DisableDownloadBtn, false);
		InicioInput.addEventListener('focusout', OnChangeInput, false);
		InicioInput.addEventListener("keyup", FormatearTiempo, false);		

		FinalInput.addEventListener("focus", DisableDownloadBtn, false);
		FinalInput.addEventListener('focusout', OnChangeInput, false);
		FinalInput.addEventListener("keyup", FormatearTiempo, false);

		InicioInput.value = ConvertirSegundosSinPuntosAMiuntosConDosPuntos(0);
		FinalInput.value = ConvertirSegundosSinPuntosAMiuntosConDosPuntos(VideoLength);

	}else{
	alert('ERROR: No se encuentra el lugar adecuado para agregar el boton de descarga. Youtube debe haber cambiado algo en el sitio.');
	return;
	}
} //end function InsertDiv


function ObtenerPocisionInicio() {
	var Reproductor = document.getElementById("movie_player");
	var TiempoObtenido = Reproductor.getCurrentTime();

	var TiempoObtenido_ConvertidoConPuntos = ConvertirSegundosSinPuntosAMiuntosConDosPuntos( Math.floor(TiempoObtenido) );

	InicioInput = document.getElementById("startInput");
	InicioInput.value = TiempoObtenido_ConvertidoConPuntos;

	OnChangeInput();
}
function ObtenerPocisionFinal(){
	var Reproductor = document.getElementById("movie_player");
	var TiempoObtenido = Reproductor.getCurrentTime();

	var TiempoObtenido_ConvertidoConPuntos = ConvertirSegundosSinPuntosAMiuntosConDosPuntos( Math.floor(TiempoObtenido) );

	FinalInput = document.getElementById("endInput");
	FinalInput.value = TiempoObtenido_ConvertidoConPuntos;

	OnChangeInput();
}


function OnChangeInput(){
	var InicioInput = document.getElementById('startInput');
	var FinalInput = document.getElementById('endInput');
	
	

	var TiempoInicio = ConvertirASegundosSinPuntos(InicioInput.value);
	var TiempoFinal = ConvertirASegundosSinPuntos(FinalInput.value);
	
	if (isNaN(TiempoInicio)){
	InicioInput.value = ConvertirSegundosSinPuntosAMiuntosConDosPuntos(0);
	}else if (isNaN(TiempoFinal)){
	FinalInput.value = ConvertirSegundosSinPuntosAMiuntosConDosPuntos(VideoLength);
	}else if (TiempoInicio == TiempoFinal){
	//alert("El valor de Inicio no puede ser igual al de el Final.");
	MostrarWarning('El valor de Inicio no puede ser igual al del Final.');
	InicioInput.value = ConvertirSegundosSinPuntosAMiuntosConDosPuntos(0);
	FinalInput.value = ConvertirSegundosSinPuntosAMiuntosConDosPuntos(VideoLength);
	}else if (TiempoInicio < 0 || TiempoInicio > VideoLength){
	//alert("El valor de Inicio es incorrecto.");
	MostrarWarning('El valor de Inicio es incorrecto.');
	InicioInput.value = ConvertirSegundosSinPuntosAMiuntosConDosPuntos(0);
	}else{
		if (TiempoFinal < TiempoInicio || TiempoFinal > VideoLength){
		//alert("El tiempo Final no puede ser menor al tiempo Inicial.");
		MostrarWarning('El tiempo Final no puede ser menor al tiempo Inicial.');
		//FinalInput.value = ConvertirSegundosSinPuntosAMiuntosConDosPuntos(VideoLength);	
		}else{
		GenerarBotonDescargar(VideoURL, TiempoInicio, TiempoFinal);
		}
	}
	//alert("OnChangeInput\nVideoUrl: "+VideoURL+"\nInicioValue: "+ InicioValue +"\nFinalValue: "+FinalValue +"\nInicio: "+Inicio+"\nFinal: "+Final);
}

function MostrarWarning(Mensaje){
var DivForWarningsDOM = document.getElementById('DivForWarnings');

DivForWarningsDOM.innerHTML = '&nbsp;';

DivForWarningsDOM.innerHTML = Mensaje;
InicioInput.value = ConvertirSegundosSinPuntosAMiuntosConDosPuntos(0);
FinalInput.value = ConvertirSegundosSinPuntosAMiuntosConDosPuntos(VideoLength);
setTimeout(function(){DivForWarningsDOM.innerHTML='&nbsp;';}, 3000);
}


function GenerarBotonDescargar(VideoURLParameter, InicioParameter, FinalParameter){
//alert("Se va a generar el boton con los siguientes parametros:\nVideoURLParameter: "+VideoURLParameter+"\nInicioParameter: "+InicioParameter+"\nFinalParameter: "+FinalParameter);
if (VideoURLParameter == null){ var VideoURLParameter = VideoURL;}
if (InicioParameter == null){ var InicioParameter = ConvertirASegundosSinPuntos(document.getElementById('startInput').value);}
if (FinalParameter == null){ var FinalParameter = ConvertirASegundosSinPuntos(document.getElementById('endInput').value);}

//var iframeSource = '//www.youtubeinmp3.com/widget/button/?video='+VideoURLParameter+'&start='+InicioParameter+'&end='+FinalParameter+'&title='+VideoTitle+'_'+InicioParameter+'_'+FinalParameter;
var iframeSource = '//www.youtubeinmp3.com/widget/button/?video='+VideoURLParameter+'&start='+InicioParameter+'&end='+FinalParameter+'';
var BotonGenerado = '<iframe id="IframeBotonDescargar" style="width:150px;height:30px;border:0;overflow:hidden;" scrolling="no" src="'+iframeSource+'">';
var iframeDOM = document.getElementById('IframeBotonDescargar');
iframeDOM.src = iframeSource;
}


function DisableDownloadBtn(){
	var Iframe = document.getElementById('IframeBotonDescargar');
	//Iframe.src = 'about:blank';	
	var html_code= '<!DOCTYPE html><html><body style="background-color:#D8D8D8;"></body></html>';
	Iframe.src = "data:text/html;charset=utf-8," + escape(html_code);
}


function FormatearTiempo(e) {
	//alert(VideoLength);
	if (VideoLength>=3600){ // Si los segundos son igual o mayor que 3600 (60 minutos o mas) FORMATO SERA 1:00:00
    var r = /([0-9]{1})([0-9]{2})([0-9]{2})/i, str = e.target.value.replace(/[^0-9]/ig, "");
    while (r.test(str)) {
        str = str.replace(r, '$1' + ':' + '$2' + ':' + '$3');
    }
    e.target.value = str.slice(0, 7);

	}else if (VideoLength>=600){ // Si los segundos son igual o mayor o que 600 (10 minutos o mas) FORMATO SERA 10:00
    var r = /([0-9]{2})([0-9]{2})/i, str = e.target.value.replace(/[^0-9]/ig, "");
    while (r.test(str)) {
        str = str.replace(r, '$1' + ':' + '$2');
    }
    e.target.value = str.slice(0, 5);

	}else{ // Si los segundos son menores que 600 (9:59 minutos o menos) FORMATO 0:00
    var r = /([0-9]{1})([0-9]{2})/i,
        str = e.target.value.replace(/[^0-9]/ig, "");
    while (r.test(str)) {
		str = str.replace(r, '$1' + ':' + '$2');
    }
    e.target.value = str.slice(0, 4);
	}
};


function ConvertirASegundosSinPuntos(MinutosConDosPuntosParameter){ // ejemplo: 3:47 transformado en 227
	var str = MinutosConDosPuntosParameter;
	var p = str.split(':'),
        s = 0, m = 1, h = 2;

    while (p.length > 0) {
        s += m * parseInt(p.pop(), 10);
        m *= 60;
    }
//alert(MinutosConDosPuntosParameter + " equivalen a "+ s +" segundos.");
return s;
}


function ConvertirSegundosSinPuntosAMiuntosConDosPuntos(SegundosSinPuntosParameter){ // ejemplo: 227 transformado en 3:47
var Horas = Math.floor(SegundosSinPuntosParameter / 3600);

var Minutos = Math.floor(( SegundosSinPuntosParameter - Horas * 3600) / 60);

var Segundos = (SegundosSinPuntosParameter) - (Horas * 3600) - (Minutos * 60);

	if(VideoLength >= 3600){ 			// 3600 segundos o mas -  60 minutos o mas - Formato 1:00:00
		(Minutos.toString().length < 2) ? Minutos = "0" + Minutos : Minutos = Minutos;
		(Segundos.toString().length < 2) ? Segundos = "0" + Segundos : Segundos = Segundos;
	DuracionConDosPuntos = Horas +":"+ Minutos +":"+ Segundos;

	}else if (VideoLength >= 600){ 	// 600 segundos o mas - 10 minutos o mas - Formato 10:00
		(Minutos.toString().length < 2) ? Minutos = "0" + Minutos : Minutos = Minutos;
		(Segundos.toString().length < 2) ? Segundos = "0" + Segundos : Segundos = Segundos;
	DuracionConDosPuntos = Minutos +":"+ Segundos;
	
	}else{ 											// 599 o menos segundos - menos de 10 minutos - Formato 0:00
		(Minutos.toString().length < 2) ? Minutos = Minutos : Minutos = Minutos;
		(Segundos.toString().length < 2) ? Segundos = "0"+Segundos : Segundos = Segundos ;
	 DuracionConDosPuntos = Minutos +":"+ Segundos;
	}
return DuracionConDosPuntos;
}
