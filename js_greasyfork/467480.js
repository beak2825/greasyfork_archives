// ==UserScript== 
// @name        Tobacco TGP/MGP
// @description Browse xxx TGP and MGP without popup ads or distractions and with a little tweak (fortune cookie style). For any matter not related to design or technicality please refer to Schimon Jehudah, Adv. (L.N 63708 IL)
// @namespace   xxx-clear-cinema-tgp
// @homepageURL https://sleazyfork.org/en/scripts/467480-tobacco-tgp-mgp
// @supportURL  https://sleazyfork.org/en/scripts/467480-tobacco-tgp-mgp/feedback
// @noframes
// @version     9.1.1
// @codename    Dahlia.Sky.31.2021 // signed 2022-04-20 // released 2023-02-29
// @license     BSD-2
// @run-at      document-start
// @exclude     *#utm
// @match        *://*/*
// @icon        data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiIHN0YW5kYWxvbmU9Im5vIj8+CjwhLS0gQ3JlYXRlZCB3aXRoIElua3NjYXBlIChodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy8pIC0tPgoKPHN2ZwogICB3aWR0aD0iNDgiCiAgIGhlaWdodD0iNDgiCiAgIHZpZXdCb3g9IjAgMCAxMi42OTk5OTkgMTIuNyIKICAgdmVyc2lvbj0iMS4xIgogICBpZD0ic3ZnNSIKICAgc29kaXBvZGk6ZG9jbmFtZT0idHBfd2hpdGUuc3ZnIgogICBpbmtzY2FwZTp2ZXJzaW9uPSIxLjIuMiAoYjBhODQ4NjU0MSwgMjAyMi0xMi0wMSkiCiAgIHhtbG5zOmlua3NjYXBlPSJodHRwOi8vd3d3Lmlua3NjYXBlLm9yZy9uYW1lc3BhY2VzL2lua3NjYXBlIgogICB4bWxuczpzb2RpcG9kaT0iaHR0cDovL3NvZGlwb2RpLnNvdXJjZWZvcmdlLm5ldC9EVEQvc29kaXBvZGktMC5kdGQiCiAgIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIgogICB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciCiAgIHhtbG5zOnN2Zz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciPgogIDxzb2RpcG9kaTpuYW1lZHZpZXcKICAgICBpZD0ibmFtZWR2aWV3MjMiCiAgICAgcGFnZWNvbG9yPSIjZmZmZmZmIgogICAgIGJvcmRlcmNvbG9yPSIjNjY2NjY2IgogICAgIGJvcmRlcm9wYWNpdHk9IjEuMCIKICAgICBpbmtzY2FwZTpwYWdlc2hhZG93PSIyIgogICAgIGlua3NjYXBlOnBhZ2VvcGFjaXR5PSIwLjAiCiAgICAgaW5rc2NhcGU6cGFnZWNoZWNrZXJib2FyZD0iMCIKICAgICBzaG93Z3JpZD0iZmFsc2UiCiAgICAgaW5rc2NhcGU6em9vbT0iMTMuOTM3NSIKICAgICBpbmtzY2FwZTpjeD0iMjMuMTAzMTM5IgogICAgIGlua3NjYXBlOmN5PSIyMy42NzcxMyIKICAgICBpbmtzY2FwZTp3aW5kb3ctd2lkdGg9IjE0MjgiCiAgICAgaW5rc2NhcGU6d2luZG93LWhlaWdodD0iMTAzMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteD0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3cteT0iMCIKICAgICBpbmtzY2FwZTp3aW5kb3ctbWF4aW1pemVkPSIxIgogICAgIGlua3NjYXBlOmN1cnJlbnQtbGF5ZXI9InN2ZzUiCiAgICAgaW5rc2NhcGU6c2hvd3BhZ2VzaGFkb3c9IjIiCiAgICAgaW5rc2NhcGU6ZGVza2NvbG9yPSIjZDFkMWQxIiAvPgogIDxkZWZzCiAgICAgaWQ9ImRlZnMyIj4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzQ3NzUiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eTowOyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM0NzczIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzQ1NzgiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eTowOyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM0NTc2IiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxsaW5lYXJHcmFkaWVudAogICAgICAgaWQ9ImxpbmVhckdyYWRpZW50MzQwMTIiPgogICAgICA8c3RvcAogICAgICAgICBzdHlsZT0ic3RvcC1jb2xvcjojMDAwMDAwO3N0b3Atb3BhY2l0eToxOyIKICAgICAgICAgb2Zmc2V0PSIwIgogICAgICAgICBpZD0ic3RvcDM0MDEwIiAvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICAgIDxyZWN0CiAgICAgICB4PSIyNDMuMDYyOTQiCiAgICAgICB5PSIyMzAuNjE2NDYiCiAgICAgICB3aWR0aD0iMzAuMDYzMDciCiAgICAgICBoZWlnaHQ9IjkwLjk0MTA2MyIKICAgICAgIGlkPSJyZWN0Mjg1MDQiIC8+CiAgICA8cmVjdAogICAgICAgeD0iMTYzLjM1Mzc4IgogICAgICAgeT0iMTQ0LjY3NTM4IgogICAgICAgd2lkdGg9IjE0Ni45MzYyMyIKICAgICAgIGhlaWdodD0iMTMxLjg0MTgiCiAgICAgICBpZD0icmVjdDIwNzkwIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzNDAxMiIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM0MDE0IgogICAgICAgeDE9IjI2LjUzOTc3MiIKICAgICAgIHkxPSI2LjE0MjI0ODYiCiAgICAgICB4Mj0iMzUuNzAyNTc5IgogICAgICAgeTI9IjYuMTQyMjQ4NiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgxLjQ0MjI3NDgsMCwwLDEuMjMyMTg1MywtMzguNTI0NjYzLC0xLjI3NjA1MDYpIiAvPgogICAgPGxpbmVhckdyYWRpZW50CiAgICAgICB4bGluazpocmVmPSIjbGluZWFyR3JhZGllbnQzNDc3NSIKICAgICAgIGlkPSJsaW5lYXJHcmFkaWVudDM0Nzc3IgogICAgICAgeDE9IjIuMjU3Nzg3OSIKICAgICAgIHkxPSIyNy43MzgzNTYiCiAgICAgICB4Mj0iNTAuNzY2MzMxIgogICAgICAgeTI9IjI3LjczODM1NiIKICAgICAgIGdyYWRpZW50VW5pdHM9InVzZXJTcGFjZU9uVXNlIgogICAgICAgZ3JhZGllbnRUcmFuc2Zvcm09Im1hdHJpeCgwLjI3MjAzODQ1LDAsMCwwLjI1ODM1NzA0LC0wLjg1MTY3MzcyLC0wLjg3NDA2MTQzKSIgLz4KICA8L2RlZnM+CiAgPGcKICAgICBpZD0ibGF5ZXIxIgogICAgIHN0eWxlPSJkaXNwbGF5OmlubGluZSI+CiAgICA8cmVjdAogICAgICAgc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6I2U2ZTZlNjtmaWxsLW9wYWNpdHk6MTtzdHJva2Utd2lkdGg6MC4wNTI1MDMiCiAgICAgICBpZD0icmVjdDEyMCIKICAgICAgIHdpZHRoPSIxMi43IgogICAgICAgaGVpZ2h0PSIxMi43IgogICAgICAgeD0iMCIKICAgICAgIHk9IjAiIC8+CiAgICA8dGV4dAogICAgICAgeG1sOnNwYWNlPSJwcmVzZXJ2ZSIKICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZTozMnB4O2xpbmUtaGVpZ2h0OjEuMzU7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZjstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOnNhbnMtc2VyaWY7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LXBvc2l0aW9uOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1hbHRlcm5hdGVzOm5vcm1hbDtmb250LXZhcmlhbnQtZWFzdC1hc2lhbjpub3JtYWw7Zm9udC1mZWF0dXJlLXNldHRpbmdzOm5vcm1hbDt0ZXh0LWluZGVudDowO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1kZWNvcmF0aW9uOm5vbmU7dGV4dC1kZWNvcmF0aW9uLWxpbmU6bm9uZTt0ZXh0LWRlY29yYXRpb24tc3R5bGU6c29saWQ7dGV4dC1kZWNvcmF0aW9uLWNvbG9yOiMwMDAwMDA7bGV0dGVyLXNwYWNpbmc6bm9ybWFsO3dvcmQtc3BhY2luZzpub3JtYWw7dGV4dC10cmFuc2Zvcm06bm9uZTt3cml0aW5nLW1vZGU6bHItdGI7ZGlyZWN0aW9uOmx0cjt0ZXh0LW9yaWVudGF0aW9uOm1peGVkO2RvbWluYW50LWJhc2VsaW5lOmF1dG87YmFzZWxpbmUtc2hpZnQ6YmFzZWxpbmU7dGV4dC1hbmNob3I6c3RhcnQ7d2hpdGUtc3BhY2U6bm9ybWFsO3NoYXBlLXBhZGRpbmc6MDtzaGFwZS1tYXJnaW46MDtpbmxpbmUtc2l6ZTowO2Rpc3BsYXk6aW5saW5lO29wYWNpdHk6MTt2ZWN0b3ItZWZmZWN0Om5vbmU7ZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxLjI3OTgyO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMwMDAwMDA7c3RvcC1vcGFjaXR5OjEiCiAgICAgICB4PSIxODMuNDMxODUiCiAgICAgICB5PSIxNjIuMTAxNzUiCiAgICAgICBpZD0idGV4dDE3MDgiCiAgICAgICB0cmFuc2Zvcm09InNjYWxlKDAuMjY0NTgzMzMpIj48dHNwYW4KICAgICAgICAgaWQ9InRzcGFuMTcwNiIKICAgICAgICAgeD0iMTgzLjQzMTg1IgogICAgICAgICB5PSIxNjIuMTAxNzUiIC8+PC90ZXh0PgogICAgPHRleHQKICAgICAgIHhtbDpzcGFjZT0icHJlc2VydmUiCiAgICAgICB0cmFuc2Zvcm09InNjYWxlKDAuMjY0NTgzMzMpIgogICAgICAgaWQ9InRleHQyMDc4OCIKICAgICAgIHN0eWxlPSJmb250LXN0eWxlOm5vcm1hbDtmb250LXZhcmlhbnQ6bm9ybWFsO2ZvbnQtd2VpZ2h0Om5vcm1hbDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZTozMnB4O2xpbmUtaGVpZ2h0OjEuMzU7Zm9udC1mYW1pbHk6c2Fucy1zZXJpZjstaW5rc2NhcGUtZm9udC1zcGVjaWZpY2F0aW9uOnNhbnMtc2VyaWY7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LXBvc2l0aW9uOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1hbHRlcm5hdGVzOm5vcm1hbDtmb250LXZhcmlhbnQtZWFzdC1hc2lhbjpub3JtYWw7Zm9udC1mZWF0dXJlLXNldHRpbmdzOm5vcm1hbDt0ZXh0LWluZGVudDowO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1kZWNvcmF0aW9uOm5vbmU7dGV4dC1kZWNvcmF0aW9uLWxpbmU6bm9uZTt0ZXh0LWRlY29yYXRpb24tc3R5bGU6c29saWQ7dGV4dC1kZWNvcmF0aW9uLWNvbG9yOiMwMDAwMDA7bGV0dGVyLXNwYWNpbmc6bm9ybWFsO3dvcmQtc3BhY2luZzpub3JtYWw7dGV4dC10cmFuc2Zvcm06bm9uZTt3cml0aW5nLW1vZGU6bHItdGI7ZGlyZWN0aW9uOmx0cjt0ZXh0LW9yaWVudGF0aW9uOm1peGVkO2RvbWluYW50LWJhc2VsaW5lOmF1dG87YmFzZWxpbmUtc2hpZnQ6YmFzZWxpbmU7d2hpdGUtc3BhY2U6cHJlO3NoYXBlLWluc2lkZTp1cmwoI3JlY3QyMDc5MCk7c2hhcGUtcGFkZGluZzowO3NoYXBlLW1hcmdpbjowO2lubGluZS1zaXplOjA7ZGlzcGxheTppbmxpbmU7b3BhY2l0eToxO3ZlY3Rvci1lZmZlY3Q6bm9uZTtmaWxsOiMwMDAwMDA7ZmlsbC1vcGFjaXR5OjE7c3Ryb2tlOm5vbmU7c3Ryb2tlLXdpZHRoOjEuMjc5ODI7c3Ryb2tlLWxpbmVjYXA6YnV0dDtzdHJva2UtbGluZWpvaW46bWl0ZXI7c3Ryb2tlLW1pdGVybGltaXQ6NDtzdHJva2UtZGFzaGFycmF5Om5vbmU7c3Ryb2tlLWRhc2hvZmZzZXQ6MDtzdHJva2Utb3BhY2l0eToxO3N0b3AtY29sb3I6IzAwMDAwMDtzdG9wLW9wYWNpdHk6MSIgLz4KICAgIDx0ZXh0CiAgICAgICB4bWw6c3BhY2U9InByZXNlcnZlIgogICAgICAgc3R5bGU9ImZvbnQtc3R5bGU6bm9ybWFsO2ZvbnQtdmFyaWFudDpub3JtYWw7Zm9udC13ZWlnaHQ6Ym9sZDtmb250LXN0cmV0Y2g6bm9ybWFsO2ZvbnQtc2l6ZToxMTEuMTEzcHg7bGluZS1oZWlnaHQ6MS4zNTtmb250LWZhbWlseTpzYW5zLXNlcmlmOy1pbmtzY2FwZS1mb250LXNwZWNpZmljYXRpb246J3NhbnMtc2VyaWYgQm9sZCc7Zm9udC12YXJpYW50LWxpZ2F0dXJlczpub3JtYWw7Zm9udC12YXJpYW50LXBvc2l0aW9uOm5vcm1hbDtmb250LXZhcmlhbnQtY2Fwczpub3JtYWw7Zm9udC12YXJpYW50LW51bWVyaWM6bm9ybWFsO2ZvbnQtdmFyaWFudC1hbHRlcm5hdGVzOm5vcm1hbDtmb250LXZhcmlhbnQtZWFzdC1hc2lhbjpub3JtYWw7Zm9udC1mZWF0dXJlLXNldHRpbmdzOm5vcm1hbDt0ZXh0LWluZGVudDowO3RleHQtYWxpZ246c3RhcnQ7dGV4dC1kZWNvcmF0aW9uOm5vbmU7dGV4dC1kZWNvcmF0aW9uLWxpbmU6bm9uZTt0ZXh0LWRlY29yYXRpb24tc3R5bGU6c29saWQ7dGV4dC1kZWNvcmF0aW9uLWNvbG9yOiMwMDAwMDA7bGV0dGVyLXNwYWNpbmc6bm9ybWFsO3dvcmQtc3BhY2luZzpub3JtYWw7dGV4dC10cmFuc2Zvcm06bm9uZTt3cml0aW5nLW1vZGU6bHItdGI7ZGlyZWN0aW9uOmx0cjt0ZXh0LW9yaWVudGF0aW9uOm1peGVkO2RvbWluYW50LWJhc2VsaW5lOmF1dG87YmFzZWxpbmUtc2hpZnQ6YmFzZWxpbmU7dGV4dC1hbmNob3I6c3RhcnQ7d2hpdGUtc3BhY2U6bm9ybWFsO3NoYXBlLXBhZGRpbmc6MDtzaGFwZS1tYXJnaW46MDtpbmxpbmUtc2l6ZTowO2Rpc3BsYXk6aW5saW5lO29wYWNpdHk6MTt2ZWN0b3ItZWZmZWN0Om5vbmU7ZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxLjI3OTgyO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMwMDAwMDA7c3RvcC1vcGFjaXR5OjEiCiAgICAgICB4PSIxOTQuMTAzNyIKICAgICAgIHk9IjE4Ni40MTA5OCIKICAgICAgIGlkPSJ0ZXh0MjE2MTAiCiAgICAgICB0cmFuc2Zvcm09Im1hdHJpeCgwLjA3NjU2MTc3LDAsMCwwLjA3NTgzNzYxLC0xMy41Mzg1NjcsLTQuNTM2MTQ1MikiPjx0c3BhbgogICAgICAgICBpZD0idHNwYW4yMTYwOCIKICAgICAgICAgeD0iMTk0LjEwMzciCiAgICAgICAgIHk9IjE4Ni40MTA5OCI+VFA8L3RzcGFuPjwvdGV4dD4KICAgIDx0ZXh0CiAgICAgICB4bWw6c3BhY2U9InByZXNlcnZlIgogICAgICAgdHJhbnNmb3JtPSJzY2FsZSgwLjI2NDU4MzMzKSIKICAgICAgIGlkPSJ0ZXh0Mjg1MDIiCiAgICAgICBzdHlsZT0iZm9udC1zdHlsZTpub3JtYWw7Zm9udC12YXJpYW50Om5vcm1hbDtmb250LXdlaWdodDpub3JtYWw7Zm9udC1zdHJldGNoOm5vcm1hbDtmb250LXNpemU6MzJweDtsaW5lLWhlaWdodDoxLjM1O2ZvbnQtZmFtaWx5OnNhbnMtc2VyaWY7LWlua3NjYXBlLWZvbnQtc3BlY2lmaWNhdGlvbjpzYW5zLXNlcmlmO2ZvbnQtdmFyaWFudC1saWdhdHVyZXM6bm9ybWFsO2ZvbnQtdmFyaWFudC1wb3NpdGlvbjpub3JtYWw7Zm9udC12YXJpYW50LWNhcHM6bm9ybWFsO2ZvbnQtdmFyaWFudC1udW1lcmljOm5vcm1hbDtmb250LXZhcmlhbnQtYWx0ZXJuYXRlczpub3JtYWw7Zm9udC12YXJpYW50LWVhc3QtYXNpYW46bm9ybWFsO2ZvbnQtZmVhdHVyZS1zZXR0aW5nczpub3JtYWw7dGV4dC1pbmRlbnQ6MDt0ZXh0LWFsaWduOnN0YXJ0O3RleHQtZGVjb3JhdGlvbjpub25lO3RleHQtZGVjb3JhdGlvbi1saW5lOm5vbmU7dGV4dC1kZWNvcmF0aW9uLXN0eWxlOnNvbGlkO3RleHQtZGVjb3JhdGlvbi1jb2xvcjojMDAwMDAwO2xldHRlci1zcGFjaW5nOm5vcm1hbDt3b3JkLXNwYWNpbmc6bm9ybWFsO3RleHQtdHJhbnNmb3JtOm5vbmU7d3JpdGluZy1tb2RlOmxyLXRiO2RpcmVjdGlvbjpsdHI7dGV4dC1vcmllbnRhdGlvbjptaXhlZDtkb21pbmFudC1iYXNlbGluZTphdXRvO2Jhc2VsaW5lLXNoaWZ0OmJhc2VsaW5lO3doaXRlLXNwYWNlOnByZTtzaGFwZS1pbnNpZGU6dXJsKCNyZWN0Mjg1MDQpO3NoYXBlLXBhZGRpbmc6MDtzaGFwZS1tYXJnaW46MDtpbmxpbmUtc2l6ZTowO2Rpc3BsYXk6aW5saW5lO29wYWNpdHk6MTt2ZWN0b3ItZWZmZWN0Om5vbmU7ZmlsbDojMDAwMDAwO2ZpbGwtb3BhY2l0eToxO3N0cm9rZTpub25lO3N0cm9rZS13aWR0aDoxLjI3OTgyO3N0cm9rZS1saW5lY2FwOmJ1dHQ7c3Ryb2tlLWxpbmVqb2luOm1pdGVyO3N0cm9rZS1taXRlcmxpbWl0OjQ7c3Ryb2tlLWRhc2hhcnJheTpub25lO3N0cm9rZS1kYXNob2Zmc2V0OjA7c3Ryb2tlLW9wYWNpdHk6MTtzdG9wLWNvbG9yOiMwMDAwMDA7c3RvcC1vcGFjaXR5OjEiIC8+CiAgICA8cmVjdAogICAgICAgc3R5bGU9ImRpc3BsYXk6aW5saW5lO2ZpbGw6dXJsKCNsaW5lYXJHcmFkaWVudDM0Nzc3KTtmaWxsLW9wYWNpdHk6MTtzdHJva2U6dXJsKCNsaW5lYXJHcmFkaWVudDM0MDE0KTtzdHJva2Utd2lkdGg6MC45MzU3OTtzdHJva2UtbWl0ZXJsaW1pdDo0O3N0cm9rZS1kYXNoYXJyYXk6bm9uZSIKICAgICAgIGlkPSJyZWN0MzEyMzEiCiAgICAgICB3aWR0aD0iMTEuNzY0MjExIgogICAgICAgaGVpZ2h0PSIxMS43NjQyMTEiCiAgICAgICB4PSIwLjQ2Nzg5NDkxIgogICAgICAgeT0iMC40Njc4OTQ5MSIKICAgICAgIHJ4PSI3LjQyMDk2NDhlLTE4IiAvPgogIDwvZz4KPC9zdmc+Cg==
// @downloadURL https://update.greasyfork.org/scripts/467480/Tobacco%20TGPMGP.user.js
// @updateURL https://update.greasyfork.org/scripts/467480/Tobacco%20TGPMGP.meta.js
// ==/UserScript==

// ==OpenUserJS==
// @author Christina D. Savitsky (WAP member, 1991), Chuvashia (RUSSIA)
// @collaborator Aika Kamijo, JAPAN
// @collaborator Alex James Anderson (American Dissident Voices member, 1995), Massachusetts (USA)
// @collaborator David J. Millard, Massachusetts (USA)
// @collaborator Georgio Puerta Díaz Fierro, MEXICO
// @collaborator Gumako Tiyawa Jackson, LIBERIA (TWP for life)
// @collaborator Hajra Khan, PAKISTAN
// @collaborator Jerard Alvefur, Massachusetts (USA)
// @collaborator Jessica M. Haller (WAP member, 1989), Colorado (USA)
// @collaborator José Cobos Camil de Camacho, MEXICO
// @collaborator Laura Stapelberg (Pink Cross Foundation member, 2014), BELARUS
// @collaborator Mai Thongmee, TAIWAN
// @collaborator Nimrit Neha Pillai, INDIA
// @collaborator Ranee Jirayungyurn, THAILAND
// @consultant   Schimon Z. Jehudah, IRAQ
// ==/OpenUserJS==

/*

TODO

1) Display participant profiles without distractions // WONTFIX Do it with an additional userscript

2) Main/Niche page // WONTFIX Do it with an additional userscript
> Redirect to random /watch/ link
> Reduce links

*/

var
  name, photo, age, nation,
  title, calendar, image, warning,
  motd, motdMsg, motdHrf;

const
  links = [], texts = [], images = [],
  pages = [];

const deceased = { "people" : [
  { 'pref' : 'Ms.',
    'name' : 'Melissa Kay Sims',
    'exec' : 'Dahlia Sky',
    'year' : '31',
    'date' : 'June 30, 2021',
    //'died' : 'Self-inflicted gunshot wound (suicide)',
    //'luck' : 'to my greatest luck',
    //'kids' : 'a single child', // to my luck, I have gave birth to ...
    //'copy' : 'Brand uses intellectual property',
  },
  { 'pref' : 'Ms.',
    'name' : 'Melissa Kay Sims',
    'exec' : 'Bailey Blue',
    'year' : '31',
    'date' : 'June 30, 2021',
  },
  { 'pref' : 'Ms.',
    'name' : 'Melissa Kay Sims',
    'exec' : 'Buxom',
    'year' : '31',
    'date' : 'June 30, 2021',
  },
  { 'pref' : 'Ms.',
    'name' : 'Melissa Kay Sims',
    'exec' : 'Comely',
    'year' : '31',
    'date' : 'June 30, 2021',
  },
  { 'pref' : 'Ms.',
    'name' : 'Kristina Lisina',
    'exec' : 'Kris the Foxx',
    'year' : '29',
    'date' : 'June 29, 2021',
  },
  { 'pref' : 'Ms.',
    'name' : 'Kristina Lisina',
    'exec' : 'Kristi Fox',
    'year' : '29',
    'date' : 'June 29, 2021',
  },
  { 'pref' : 'Ms.',
    'name' : 'Kristina Lisina',
    'exec' : 'Kristina the Foxx',
    'year' : '29',
    'date' : 'June 29, 2021',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Lauren Kaye Scott',
    'exec' : 'Dakota Doll',
    'year' : '27',
    'date' : 'June 9, 2021',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Lauren Kaye Scott',
    'exec' : 'Dakota Green',
    'year' : '27',
    'date' : 'June 9, 2021',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Lauren Kaye Scott',
    'exec' : 'Koda Skye',
    'year' : '27',
    'date' : 'June 9, 2021',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Lauren Kaye Scott',
    'exec' : 'Kota Skye',
    'year' : '27',
    'date' : 'June 9, 2021',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Lauren Kaye Scott',
    'exec' : 'Dakota Skye',
    'year' : '27',
    'date' : 'June 9, 2021',
  },
  { 'pref' : 'Mr.',
    'name' : 'Jordan Avery Blust',
    'exec' : 'Jordan Ash',
    'year' : '42',
    'date' : 'October 19, 2020',
  },
  { 'pref' : 'Ms.',
    'name' : 'Anastasia Knight',
    'exec' : 'Anastasia Knight',
    'year' : '20',
    'date' : 'August 12, 2020',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Campbell',
    'exec' : 'Zoe Parker',
    'year' : '24',
    'date' : 'September 12, 2020',
  },
  { 'pref' : 'Ms.',
    'name' : 'Jessica Redding',
    'exec' : 'Jessica Jaymes',
    'year' : '40',
    'date' : 'September 17, 2019',
  },
  { 'pref' : 'Ms.',
    'name' : 'Jazmine Nicole Dominguez',
    'exec' : 'Violet Rain',
    'year' : '19',
    'date' : 'March 13, 2019',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Deven Augustina Schuette',
    'exec' : 'Casper',
    'year' : '39',
    'date' : 'August 17, 2018',
  },
  //{ 'pref' : 'Mrs.',
  //  'name' : 'Deven Augustina Schuette',
  //  'exec' : 'Dev',
  //  'year' : '39',
  //  'date' : 'August 17, 2018',
  //},
  { 'pref' : 'Mrs.',
    'name' : 'Deven Augustina Schuette',
    'exec' : 'Devvy',
    'year' : '39',
    'date' : 'August 17, 2018',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Deven Augustina Schuette',
    'exec' : 'Deven Davis',
    'year' : '39',
    'date' : 'August 17, 2018',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Deven Augustina Schuette',
    'exec' : 'Kirstin Thompson',
    'year' : '39',
    'date' : 'August 17, 2018',
  },
  { 'pref' : 'Ms.',
    'name' : 'Lexi Rose Forte',
    'exec' : 'Alexis Forte',
    'year' : '20',
    'date' : 'January 7, 2018',
  },
  { 'pref' : 'Ms.',
    'name' : 'Lexi Rose Forte',
    'exec' : 'Olivia Nova',
    'year' : '20',
    'date' : 'January 7, 2018',
  },
  { 'pref' : 'Ms.',
    'name' : 'Yurizan Beltrán Lebanue',
    'exec' : 'Yurizan Beltran',
    'year' : '31',
    'date' : 'December 13, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Yurizan Beltrán Lebanue',
    'exec' : 'Sweet Yurizan',
    'year' : '31',
    'date' : 'December 13, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Yurizan Beltrán Lebanue',
    'exec' : 'Yuri Love',
    'year' : '31',
    'date' : 'December 13, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Yurizan Beltrán Lebanue',
    'exec' : 'Yurizan',
    'year' : '31',
    'date' : 'December 13, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Mercedes Grabowski',
    'exec' : 'August Ames',
    'year' : '23',
    'date' : 'December 5, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Amanda Friedland',
    'exec' : 'Amanda Auclair',
    'year' : '35',
    'date' : 'November 9, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Amanda Friedland',
    'exec' : 'Shyla Styles',
    'year' : '35',
    'date' : 'November 9, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Amanda Friedland',
    'exec' : 'Shyla Stylez',
    'year' : '35',
    'date' : 'November 9, 2017',
  },
  { 'pref' : 'Ms.',
    'name' : 'Amanda Friedland',
    'exec' : 'Shyla Stylex',
    'year' : '35',
    'date' : 'November 9, 2017',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Malinda Gayle McCready',
    'exec' : 'Mindy McCready',
    'year' : '37',
    'date' : 'February 17, 2013',
  },
  { 'pref' : 'Ms.',
    'name' : 'Kathryn Sue Johnston',
    'exec' : 'Hunter Bryce',
    'year' : '30',
    'date' : 'April 13, 2011',
  },
  { 'pref' : 'Ms.',
    'name' : 'Elena R. Martushev',
    'exec' : 'Anastasia Blue',
    'year' : '28',
    'date' : 'July 19, 2008',
  },
  { 'pref' : 'Ms.',
    'name' : 'Elena R. Martushev',
    'exec' : 'Anesthesia',
    'year' : '28',
    'date' : 'July 19, 2008',
  },
  { 'pref' : 'Ms.',
    'name' : 'Elena R. Martushev',
    'exec' : 'Elena Behm',
    'year' : '28',
    'date' : 'July 19, 2008',
  },
  { 'pref' : 'Ms.',
    'name' : 'Emily Irene Sander',
    'exec' : 'Zoey Zane',
    'year' : '18',
    'date' : 'November 24, 2007',
  },
  { 'pref' : 'Mr.',
    'name' : 'Ben Grey',
    'exec' : 'Kent North',
    'year' : '35',
    'date' : 'July 4, 2007',
  },
  // http://www.mydeathspace.com/article/2006/10/19/Angela_Devi_(30)_committed_suicide_by_Asphyxiation_using_a_plaid_flannel_belt
  // 
  { 'pref' : 'Ms.',
    'name' : 'Angela Shunali Dhingra',
    'exec' : 'Angela Devi',
    'year' : '30',
    'date' : 'March 31, 2006',
  },
  { 'pref' : 'Ms.',
    'name' : 'Angela Shunali Dhingra',
    'exec' : 'Angela Tracy',
    'year' : '30',
    'date' : 'March 31, 2006',
  },
  { 'pref' : 'Mr.',
    'name' : 'Alessandro Caetano Kothenborger',
    'exec' : 'Camilla DeCastro',
    'year' : '26',
    'date' : 'July 26, 2005',
  },
  { 'pref' : 'Mr.',
    'name' : 'Bradford Thomas Wagner',
    'exec' : 'Tim Barnett',
    'year' : '37',
    'date' : 'July 13, 2005',
  },
  { 'pref' : 'Mr.',
    'name' : 'Rex Hickok',
    'exec' : 'Lance Heywood',
    'year' : '40',
    'date' : 'April 28, 2005',
  },
  { 'pref' : 'Mr.',
    'name' : 'Barry Rogers',
    'exec' : 'J.T.',
    'year' : '39',
    'date' : 'November 7, 2004',
  },
  { 'pref' : 'Mr.',
    'name' : 'Barry Rogers',
    'exec' : 'Johnny Rahm',
    'year' : '39',
    'date' : 'November 7, 2004',
  },
  { 'pref' : 'Ms.',
    'name' : 'Natel King',
    'exec' : 'Taylor Sumers',
    'year' : '23',
    'date' : 'February, 2004',
  },
  { 'pref' : 'Ms.',
    'name' : 'Natel King',
    'exec' : 'Taylor Summers',
    'year' : '23',
    'date' : 'February, 2004',
  },
  { 'pref' : 'Ms.',
    'name' : 'Megan Joy Serbian',
    'exec' : 'Naughtia',
    'year' : '22',
    'date' : 'January 7, 2002',
  },
  { 'pref' : 'Ms.',
    'name' : 'Megan Joy Serbian',
    'exec' : 'Naughtia Childs',
    'year' : '22',
    'date' : 'January 7, 2002',
  },
  { 'pref' : 'Ms.',
    'name' : 'Megan Joy Serbian',
    'exec' : 'Naughtie',
    'year' : '22',
    'date' : 'January 7, 2002',
  },
  { 'pref' : 'Ms.',
    'name' : 'Megan Joy Serbian',
    'exec' : 'Naughtie Childs',
    'year' : '22',
    'date' : 'January 7, 2002',
  },
  { 'pref' : 'Mr.',
    'name' : 'Jeffrey James Vickers',
    'exec' : 'Jon Vincent',
    'year' : '39',
    'date' : 'May 3, 2000',
  },
  { 'pref' : 'Mr.',
    'name' : 'William Paul Lawrence',
    'exec' : 'Brad Chase',
    'year' : '29',
    'date' : 'April 19, 2000',
  },
  { 'pref' : 'Mr.',
    'name' : 'William Paul Lawrence',
    'exec' : 'William Hobbs',
    'year' : '29',
    'date' : 'April 19, 2000',
  },
  { 'pref' : 'Mr.',
    'name' : 'Russell Charles McCoy',
    'exec' : 'Kyle McKenna',
    'year' : '31',
    'date' : 'March 14, 2000',
  },
  { 'pref' : 'Mr.',
    'name' : 'Russell Charles McCoy',
    'exec' : 'Russ McCoy',
    'year' : '31',
    'date' : 'March 14, 2000',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Wendy Orleans Williams',
    'exec' : 'Wendy O. Williams',
    'year' : '48',
    'date' : 'April 6, 1998',
  },
  { 'pref' : 'Mr.',
    'name' : 'Rommel Eugene Hunt',
    'exec' : 'Steve Fox',
    'year' : '31',
    'date' : 'October 23, 1997',
  },
  { 'pref' : 'Mr.',
    'name' : 'Christopher John McLaughlin',
    'exec' : 'Christian Fox',
    'year' : '22',
    'date' : 'September 20, 1996',
  },
  { 'pref' : 'Mr.',
    'name' : 'Christopher John McLaughlin',
    'exec' : 'Christopher Cox',
    'year' : '22',
    'date' : 'September 20, 1996',
  },
  { 'pref' : 'Ms.',
    'name' : 'Karen Elizabeth Mereness',
    'exec' : 'Alex Jordan',
    'year' : '31',
    'date' : 'July 2, 1995',
  },
  { 'pref' : 'Mr.',
    'name' : 'Cal Jammer',
    'exec' : 'Randy Layne Potes',
    'year' : '34',
    'date' : 'January 25, 1995',
  },
  // FIXME Accidentally works for any Savannah
  { 'pref' : 'Ms.',
    'name' : 'Shannon Michelle Wilsey',
    'exec' : 'Savannah',
    'year' : '23',
    'date' : 'July 11, 1994',
  },
  { 'pref' : 'Ms.',
    'name' : 'Shannon Michelle Wilsey',
    'exec' : 'Savvy',
    'year' : '23',
    'date' : 'July 11, 1994',
  },
  { 'pref' : 'Mr.',
    'name' : 'Gregory Leslie Patton',
    'exec' : 'Rod Phillips',
    'year' : '32',
    'date' : 'May 24, 1993',
  },
  { 'pref' : 'Mr.',
    'name' : 'Allan Dean Wiebe',
    'exec' : 'Alan Lambert',
    'year' : '25',
    'date' : 'December 20, 1992',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Kelly Jean Van Dyke',
    'exec' : 'Kelly Van Dyke',
    'year' : '33',
    'date' : 'November 17, 1991',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Kelly Jean Van Dyke',
    'exec' : 'Nance Kellee',
    'year' : '33',
    'date' : 'November 17, 1991',
  },
  { 'pref' : 'Mrs.',
    'name' : 'Kelly Jean Van Dyke',
    'exec' : 'Nancee Kellee',
    'year' : '33',
    'date' : 'November 17, 1991',
  },
  { 'pref' : 'Ms.',
    'name' : 'Michelle Marie Schei',
    'exec' : 'Megan Leigh',
    'year' : '26',
    'date' : 'June 16, 1990',
  },
  { 'pref' : 'Mr.',
    'name' : 'John Curtis Holmes',
    'exec' : 'John Holmes',
    'year' : '43',
    'date' : 'March 13, 1988',
  },
  { 'pref' : 'Mr.',
    'name' : 'John Curtis Holmes',
    'exec' : 'Johnny Wadd',
    'year' : '43',
    'date' : 'March 13, 1988',
  },
  { 'pref' : 'Ms.',
    'name' : 'Linda Carol Seki',
    'exec' : 'Linda Ching',
    'year' : '36',
    'date' : 'December 17, 1987',
  },
  { 'pref' : 'Ms.',
    'name' : 'Linda Carol Seki',
    'exec' : 'Linda Wong',
    'year' : '36',
    'date' : 'December 17, 1987',
  },
  { 'pref' : 'Ms.',
    'name' : 'Linda Carol Seki',
    'exec' : 'Sandy Strain',
    'year' : '36',
    'date' : 'December 17, 1987',
  },
  { 'pref' : 'Ms.',
    'name' : 'Colleen Marie Applegate',
    'exec' : 'Jillian Ladd',
    'year' : '20',
    'date' : 'March 21, 1984',
  },
  { 'pref' : 'Ms.',
    'name' : 'Colleen Marie Applegate',
    'exec' : 'Shauna Grant',
    'year' : '20',
    'date' : 'March 21, 1984',
  },
]};
  /*
  { 'name' : '',
    'exec' : '',
    'year' : '',
    'date' : '',
  },
  */

// TODO when finding keyword or title of 18 or 19, select #18 or #19
// TODO when finding ... coach, select sports messages
// TODO when interracial, refer to Muhamad Ali and White men
// TODO instead of "started in the industry" as if it is
// a career or legitimate, find a sentense that manifests
// being a victim led to hell (e.g. subject to atrocities)
const commercial = [
  '👁 [AD] “It took a lot of courage to admit to one of my best friends that I had this problem and thankfully he was very understanding and willing to help.” ~ Covenant Eyes Member|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Porn Is a Human Problem, We Provide a Human Solution. Get CovenantEyes™|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Protect Your Family; Guard Your Heart. Get CovenantEyes™|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] CovenantEyes® Keeping families safe on the Web.|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Protect Your Family; Guard Your Heart. get CovenantEyes®|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Get Free. Stay Free. Get CovenantEyes™|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Protect your family on the Internet with CovenantEyes™|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Is your family safe on the Internet? Get CovenantEyes™|https://www.covenanteyes.com/?promocode=PinkCross',
  '👁 [AD] Remove Online Temptation ...with Covenant Eyes|https://www.covenanteyes.com/?promocode=PinkCross',
  '🗽 Defeat Porn. Together. <covenanteyes.com>|https://www.covenanteyes.com/?promocode=PinkCross',
  '💪️ Start the Covenant Eyes challenge to quit porn <covenanteyes.com>|https://www.covenanteyes.com/?promocode=PinkCross',
  '💪️ Take the quit porn challenge <covenanteyes.com>|https://www.covenanteyes.com/?promocode=PinkCross',
  '🗽 Porn consumes you, eh? Take the challenge to quit porn <covenanteyes.com>|https://www.covenanteyes.com/?promocode=PinkCross',
  '🗽 Porn consumes you, eh? Take the challenge to quit porn <strive21.com>|https://www.strive21.com/?promocode=PinkCross',
  '💪️ Start the STRIVE challenge to quit porn. <strive21.com>|https://www.strive21.com/?promocode=PinkCross',
]

const homo = [
  '🤔️ If "gender" is a social construct, why do you need medical procedures to "confirm" it?|https://farside.link/nitter/JosephSciambra/status/1626066353923981317',
  '👬 Gays Against Groomers is a coalition of gay people who oppose the recent trend of indoctrinating and sexualizing children under the guise of “LGBTQIA+” <GaysAgainstGroomers.com>|https://www.gaysagainstgroomers.com/?ref=tc',
  '👬 Gays Against Groomers <GaysAgainstGroomers.com>|https://farside.link/nitter/againstgrmrs',
  '🤵 [READ] I Was the Other Man: An Insider’s Look at Why Gay Marriage Will Never Work|https://www.churchmilitant.com/news/article/i-was-the-other-man-an-insiders-look-at-why-gay-marriage-will-never-work',
  '🧑‍⚕️ FACT: The only reason the medical industry encourages children to transition is because it creates pharmaceutical customers for life|https://farside.link/nitter/againstgrmrs/status/1626091866058895361',
  '🩺 FACT: The only reason the medical industry encourages children to transition is because it creates pharmaceutical customers for life|https://farside.link/nitter/againstgrmrs/status/1626091866058895361',
  '👪 FACT: The only reason the medical industry encourages children to transition is because it creates pharmaceutical customers for life|https://farside.link/nitter/againstgrmrs/status/1626091866058895361',
  '🤻 Gays Against Groomers <GaysAgainstGroomers.com>|https://www.gaysagainstgroomers.com/?ref=tc',
  '👬 Gays Against Groomers <GaysAgainstGroomers.com>|https://www.gaysagainstgroomers.com/?ref=tc',
  '👬 [READ] Jesus Loves You|https://josephsciambra.com/jesus-loves-gay-men/',
  '👬 Jesus Loves You - Joseph Sciambra|https://josephsciambra.com/jesus-loves-gay-men/',
  '🏳️‍🌈⃠ YOU ARE NOT A HOMOSEXUAL! You are a son of a king, so snap out of it already!',
  '☦ Sons of St. Joseph <SonsofSaintJoseph.com>|http://www.sonsofsaintjoseph.com/?ref=tc',
  '☦ Sons of St. Joseph <JosephSciambra.com>|https://josephsciambra.com/?ref=tc',
]

const promotion = [
  '➕ 10 Pornstars Who Gave Their Life to Christ After Years Of Living In Sin|https://listwand.com/10-pornstars-who-gave-their-life-to-christ-after-years-of-living-in-sin/',
  '🫵 Addicted? Seek help here.|https://read.easypeasymethod.org/',
  '🫵 [READ] EasyPeasy|https://read.easypeasymethod.org/',
  '🫵 Use XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '🫵 I want you to get XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '🫵 Get Jabber <xmpp.org>|https://xmpp.org/software/clients/',
  '💡 Get Jabber <xmpp.org>|https://xmpp.org/software/clients/',
  '🫵 Get XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '🦋 Get XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '🪽 Get XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '🗣️ Start using XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '🫵 Start using XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '💡 Let’s get it on with Jabber <xmpp.org>|https://xmpp.org/software/clients/',
  '😉 Let’s get it on with XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '☎️ Are you looking for a private instant messaging system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🧐️ Are you looking for a discreet telecom system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🧐️ Are you looking for a discreet VoIP system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🧐️ Are you looking for a discreet voip system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🧐️ Are you looking for a discreet instant messaging system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🧐️ Are you looking for a private instant messaging system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🙊 The private instant messaging system they don’t want you to know about <xmpp.org>|https://xmpp.org/software/clients/',
  '🏛️ The private instant messaging system the government doesn’t want you to know about <xmpp.org>|https://xmpp.org/software/clients/',
  '🧑🏽‍⚖️ The private instant messaging system the judges don’t want you to know about <xmpp.org>|https://xmpp.org/software/clients/',
  '👮 The private instant messaging system the police doesn’t want you to know about <xmpp.org>|https://xmpp.org/software/clients/',
  '🏴‍☠️ The Pirate Bay <thepiratebay.org>|https://thepiratebay.org/',
  '🏴‍☠️ Long Live The Pirate Bay! <thepiratebay.org>|https://thepiratebay.org/',
  '🏴‍☠️ Long Live The Pirate Bay! <tpb.party>|https://tpb.party/',
  '🙊 Looking for a private instant messaging system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🤔️ Looking for a private instant messaging system? <xmpp.org>|https://xmpp.org/software/clients/',
  '🫵 Connect to XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '💬 Get Jabber/XMPP <xmpp.org>|https://xmpp.org/software/clients/',
  '💬 The most secure instant messaging system <xmpp.org>|https://xmpp.org/software/clients/',
  '🏫 IFERS <ifers.123.st>|https://ifers.forumotion.com/',
  '🏫 IFERS - Exposing the ’Global’ Conspiracy From Atlantis to Zion|https://ifers.forumotion.com/',
  '🏫 IFERS - The International Flat Earth Research Society|https://ifers.forumotion.com/',
  '☮ [LISTEN] Bott Radio Network|https://bottradionetwork.com/audio-player/?ref=tc',
  '✝ [LISTEN] Bott Radio Network|https://bottradionetwork.com/audio-player/?ref=tc',
  '♱ [LISTEN] Bott Radio Network - Getting the Word of God into the People of God|https://bottradionetwork.com/audio-player/?ref=tc',
  '🎙 [LISTEN] Bott Radio Network|https://bottradionetwork.com/audio-player/?ref=tc',
  '📚 [READ] What do you mean the earth is shaped like a pizza?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] Did you say earth is not spining?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] Did you say earth is not a spining fireball?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] Did you say earth is not a ball?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] Did you say earth is horizontal?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] Did you say earth is shaped like a disc?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] Did you know earth is horizontal? (i.e. earth is flat)|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] WTF earth is shaped like a pizza?!!|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] 108 books on “Is earth a pizza?”|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] 108 Earthly Books|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '📚 [READ] 108 Horizontal Earth Books|magnet:?xt=urn:btih:d357a0b06a4e20004f21ade4291aa281f22b9a84&dn=108+Flat+Earth+Books&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  'ᛋᛋ [WATCH] Think Different|magnet:?xt=urn:btih:bc0b911654e2795536370f8cae59d123db4b95b4&dn=The%20Greatest%20Story%20Never%20Told',
  '卐 [WATCH] Think Different|magnet:?xt=urn:btih:bc0b911654e2795536370f8cae59d123db4b95b4&dn=The%20Greatest%20Story%20Never%20Told',
  '🪖 [WATCH] The Greatest Story NEVER Told!|https://webtor.io/#/show?file=TGSNTtvPart01.mp4&pwd=%2FThe%20Greatest%20Story%20Never%20Told&magnet=magnet%3A%3Fxt%3Durn%3Abtih%3Abc0b911654e2795536370f8cae59d123db4b95b4%26dn%3DThe%2BGreatest%2BStory%2BNever%2BTold%26tr%3Dudp%253A%252F%252Ftracker.coppersurfer.tk%253A6969%252Fannounce%26tr%3Dudp%253A%252F%252Ftracker.openbittorrent.com%253A6969%252Fannounce%26tr%3Dudp%253A%252F%252F9.rarbg.to%253A2710%252Fannounce%26tr%3Dudp%253A%252F%252F9.rarbg.me%253A2780%252Fannounce%26tr%3Dudp%253A%252F%252F9.rarbg.to%253A2730%252Fannounce%26tr%3Dudp%253A%252F%252Ftracker.opentrackr.org%253A1337%26tr%3Dhttp%253A%252F%252Fp4p.arenabg.com%253A1337%252Fannounce%26tr%3Dudp%253A%252F%252Ftracker.torrent.eu.org%253A451%252Fannounce%26tr%3Dudp%253A%252F%252Ftracker.tiny-vps.com%253A6969%252Fannounce%26tr%3Dudp%253A%252F%252Fopen.stealth.si%253A80%252Fannounce',
  '✊ [WATCH] The Greatest Story Never Told|magnet:?xt=urn:btih:bc0b911654e2795536370f8cae59d123db4b95b4&dn=The%20Greatest%20Story%20Never%20Told',
  '🗺️ [WATCH] Happy Earth Day|magnet:?xt=urn:btih:edaa17296268eb6f6b209faa7ff55346e17351a0&dn=Happy%20Flat%20Earth%20Day%20Documentary%20Pack',
  '🚫️💰️ Abolish usury',
  '🚫️🏦 Abolish usury',
  '📉 Abolish usury',
  '📚 Anna’s Archive <annas-archive.org>|https://annas-archive.org/',
  '📚 When was the last time you’ve read a good book? <annas-archive.org>|https://annas-archive.org/',
  '🏦 END THE FED!',
  '🚫️🏦 END THE FED!',
  '🏦 END THE FED',
  '🧠 The word ”Government” actually means “Mind Control”. “guvernare“ means “to control” and “mentis“ means “mind”.',
  '🏫 Fuck School!',
  '🏫 Fuck School',
  '🏫 Fuck Indoctrination!',
  '🚫️🏫 Fuck School!',
  '🏫 If you already know reading, writing and arithmetic, then it’s time for you to leave school. #fuckschool',
  '🏫 If you already know reading, writing and arithmetic, then it’s time for you to leave school. #ignoreschool',
  '🏫 If you know reading, writing and arithmetic, then it’s time for you to leave school. #fuckschool',
  '🏫 If you know reading, writing and arithmetic, then it’s time for you to leave school. #ignoreschool',
  '🏫 If you know how to read and math, then it’s time for you to leave school. #fuckschool',
  '🏫 If you know how to read and math, then it’s time for you to leave school. #ignoreschool',
  '🏫 If your children know reading, writing and arithmetic, then it’s time for them to leave school. #ignoreschool',
  '🏫 If your children know reading, writing and arithmetic, then it’s time for you to get them out of school. #ignoreschool',
  '👨‍🏫️ Alliance Defending Freedom #join #adf|https://adflegal.org/',
  '👨‍🏫️ We Are Hiring! #adf|https://adflegal.org/about-us/careers',
  '👨‍🏫️ ADF Is Hiring! #adf|https://adflegal.org/about-us/careers',
  '☯ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '◭ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '▢ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '◐ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '◓ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '▣ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '□ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '△ “It’s not about the shape, it’s about the lie; and it’s about the paradigm shift of exposing the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '▲ “It’s not about the shape, it’s about the lie; and it’s about the paradigm shift of exposing the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '➠ “It’s not about the shape, it’s about the lie; and it’s about the paradigm shift of exposing the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🔁 “It’s not about the shape, it’s about the lie; and it’s about the paradigm shift of exposing the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '♻️ “It’s not about the shape, it’s about the lie; and it’s about the paradigm shift of exposing the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '♲ “It’s not about the shape, it’s about the lie; and it’s about the paradigm shift of exposing the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🌐 “It’s not about the shape of the earth, it’s about the lie. It’s about realizing that you’ve been lied to about something so fundamental for so long.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🌐 “It’s not about the shape of the earth, it’s about the lie. It’s about realizing that you’ve been lied to about something so fundamental for so long.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👶👦👧 “SCREW CHILDREN! That’s the mantra of the world. Instead of burying them with a national debt, shoving them in shitty schools, drugging them if they don’t comply, hitting them, yelling at them, indoctrinating them with religion and statism and patriotism and military worship, what if we just did what was right for them? The whole world is built on “screw children”, and if we changed that, this would be an alien world to us.” -- Stefan Molyneux #ignoreschool',
  //'👶👦👧 “SCREW CHILDREN! That’s the mantra of the world. Instead of burying them with a national debt, shoving them in shitty schools, drugging them if they don’t comply, hitting them, yelling at them, indoctrinating them with religion and statism and patriotism and military worship, what if we just did what was right for them? The whole world is built on “screw children”, and if we changed that, this would be an alien plane(t) to us.” -- Stefan Molyneux #ignoreschool',
  '💔 “Deep pockets and empty hearts rule the world. We unleash them at our peril.” -- Stefan Molyneux #ignoreschool',
  '☀️ “There is nothing that is going to make people hate you more, and love you more, than telling the truth.” -- Stefan Molyneux',
  '☀️ “Mental anguish always results from the avoidance of legitimate suffering.” -- Stefan Molyneux',
  '☀️ “Those who make conversations impossible, make escalation inevitable.” -- Stefan Molyneux',
  '☀️ “As the old saying went in the Soviet Union, “They pretend to pay us, and we pretend to work.” -- Stefan Molyneux',
  '☀️ “Remember: If a hypothesis cannot possibly be disproved, it can be irrefutably dismissed.” -- Stefan Molyneux',
  '☀️ “The only part of you that hurts when you are given the truth is the part that lives on lies.” -- Stefan Molyneux',
  '🎙️ [LISTEN] Freedomain with Stefan Molyneux|https://fdrpodcasts.com/?ref=tc',
  '🎙️ [LISTEN] Freedomain Podcast|https://fdrpodcasts.com/?ref=tc',
  '📻 [LISTEN] Freedomain Radio|https://fdrpodcasts.com/?ref=tc',
  '👨‍🏫️ [LISTEN] Freedomain|https://freedomain.com/?ref=tc',
  '👨‍🏫️ Freedomain: Essential Philosophy|https://freedomain.com/?ref=tc',
  '💰️ Act against to central banking!',
  '💰️ Say no to central banking!',
  '☀️ Godsend',
  '☀️ Black Suɲ',
  '☀️ God Bless',
  '☀️ May God bless You and Your loved ones',
  '⚡ Leaked Pornhub Emails Show Shocking Policies!|https://endsexualexploitation.org/articles/leaked-pornhub-emails-show-shocking-policies/',
  '🎃 The Halloween Documents|http://catb.org/~esr/halloween/',
  '🎃 [READ] The Halloween Documents|http://catb.org/~esr/halloween/',
  '🎃 The Halloween Documents. What Silicon Valley doesn’t want you to know...|http://catb.org/~esr/halloween/',
  '🎃 [READ] The cables that Silicon Valley doesn’t want you to see...|http://catb.org/~esr/halloween/',
  '🎃 [READ] The memorandums that Silicon Valley doesn’t want you to read...|http://catb.org/~esr/halloween/',
  '🎃 [READ] The memos that Silicon Valley doesn’t want you to see...|http://catb.org/~esr/halloween/',
  '🎃 [READ] The protocols that Silicon Valley doesn’t want you to read...|http://catb.org/~esr/halloween/',
  '🎃 [READ] The documents that Silicon Valley doesn’t want you to read...|http://catb.org/~esr/halloween/',
  '🎃 [READ] What Silicon Valley doesn’t want you to know...|http://catb.org/~esr/halloween/',
  '🏢 Leaked Silicon Valley memo outlines anti-Software strategy|http://www.theregister.co.uk/981103-000001.html',
  '🏢 Leaked Silicon Valley memo outlines anti-Open Source strategy|http://www.theregister.co.uk/981103-000001.html',
  '🏢 Leaked Silicon Valley memo outlines anti-Linux strategy|http://www.theregister.co.uk/981103-000001.html',
  '🛩️ STOP SPRAYING US! <ActualActivists.com>|https://actualactivists.com/?ref=tc',
  '✈️ STOP SPRAYING US! <StopSprayingUs.com>|http://www.stopsprayingus.com/?ref=tc',
  '🛩️ Stop Spraying Us! <StopSprayingUs.com>|http://www.stopsprayingus.com/?ref=tc',
  '✈️ STOP SPRAYING US! <ClimateChangeAgenda.com>|http://climatechangeagenda.com/?ref=tc',
  '⛅ Our Weather Is Controlled <ClimateChangeAgenda.com>|http://climatechangeagenda.com/?ref=tc',
  '🌫 Our Weather Is Controlled <ClimateChangeAgenda.com>|http://climatechangeagenda.com/?ref=tc',
  //'🌫 STOP SPRAYING US! <ByeByeBlueSky.com.com>|http://byebyebluesky.com/?ref=tc',
  '🧟‍♂️ [WATCH] FrankenSkies (2017)|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '🧟‍♀ [WATCH] FrankenSkies (2017)|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '🧟 [WATCH] FrankenSkies (2017)|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '☠️ [WATCH] FrankenSkies - Chemtrails & Geoengineering Documentary|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '🔩 [WATCH] FrankenSkies - Geoengineering Documentary|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '⚡️ [WATCH] FrankenSkies (2017)|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '🧬 [WATCH] FrankenSkies (2017)|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '🎞️ [WATCH] FrankenSkies - Chemtrails Documentary|magnet:?xt=urn:btih:418546e67fcde04a5ad914d63bdcea09cadd0012&dn=FrankenSkies%20-%20Chemtrails-Geoengineering%20Documentary%20720p%20%282017%29%20-%20roflcopter2110',
  '☦ Sons of St. Joseph <SonsofSaintJoseph.com>|http://www.sonsofsaintjoseph.com/?ref=tc',
  '☦ Sons of St. Joseph <JosephSciambra.com>|https://josephsciambra.com/?ref=tc',
  '🗽 [WATCH] YOUR GUIDE TO 5TH-GENERATION WARFARE|https://www.corbettreport.com/5thgen/',
  '✚ Pink Cross Foundation|https://farside.link/nitter/pinkcrossfound',
  '✚ Pink Cross Foundation|https://pinkcross.org.au/?ref=tc',
  '✚ Pink Cross Foundation <pinkcross.org.au>|https://pinkcross.org.au/?ref=tc',
  '🎤 Voice of Change <voicesofchange.net>|http://www.voicesofchange.net/?ref=tc',
  '🏥 Real Change in Sexual Feelings Through Therapy that Works! <voicesofchange.net>|http://www.voicesofchange.net/?ref=tc',
  //'📶 STOP 5G | Stay connected but protected|https://signstop5g.eu/', // globe propaganda
  '📶 Stop 5G (CZ)|https://stop5g.cz/us/',
  '📶 Stop 5G Global|https://stop5gglobal.org/', // globe propaganda?
  '📶 Stop 5G Together Illinois|https://stop5gtogetherillinois.com/',
  '📶 Stránka nenalezena - Stop 5G|https://stop5g.cz/',
  '📶 STOP 5G NOW|https://stop5gnow.com/',
  '📶 STOP 5G (UK)|https://stop5g.co.uk/',
  '⚖️ A Judicial Review to STOP a 5G MAST in Bluebell|https://www.gofundme.com/f/a-judicial-review-to-stop-a-5g-mast-in-bluebell',
  '🧑‍⚖️ A Judicial Review to STOP a 5G MAST in Bluebell|https://www.gofundme.com/f/a-judicial-review-to-stop-a-5g-mast-in-bluebell',
  '📱 STOP 5G - An Emergency Appeal to the World’s Governments by Scientists, Doctors, Environmental Organizations and Others|https://www.5gspaceappeal.org/',
  '📝 Petition: Stop 5G in Sarasota County|https://www.change.org/p/dept-of-health-sarasota-environmental-health-services-stop-5g-in-sarasota-county',
  '✒️ Petition: Stop 5G in Sarasota County|https://www.change.org/p/dept-of-health-sarasota-environmental-health-services-stop-5g-in-sarasota-county',
  '☣️ Electromagnetic Radiation Safety|https://www.saferemr.com/',
  '📡 How to oppose 5G “small cell” towers|http://emfsafetynetwork.org/how-to-oppose-small-cell-5g-towers/',
  '📡 How to Protect Yourself from 5G Radiation|https://www.irda.org/5g-radiation',
  '📡 How to Stop 5G: Worldwide Opposition to 5G Technology|https://www.shieldyourbody.com/stop-5g/',
  '📡 10 ACTIONS TO HELP STOP 5G|http://www.electrosmogprevention.org/stop-5g-action-plan/10-actions-to-help-stop-5g/',
  '🇺🇳 STOP!! SDGs|https://stopsdgs.076.moe/',
  '🪖 Don’t join the military!',
  '🚫️🎖️ Fuck the army!',
  '🚫️🏵️ Fuck the military!',
  '🚫️🏶 Fuck the military!',
  '🚫️🇺🇳 Abolish the UN!',
  '🚫️🇺🇳 Boycott the UN!',
  '🤵‍♀️ Mami’s Shit',
  '🤵 Mami’s Shit',
  '💩 Mami’s Shit',
  '🤔 Mami’s Shit',
  '🏆 Mami’s Shit',
  '➠ Oracle Broadcasting Network',
  '➠ Oracle Broadcasting Network. The home of cutting edge talk radio',
  '➠ Oracle Broadcasting Radio Network. The home of cutting edge talk radio',
  '➠ Oracle Broadcasting Radio Network. The Home Of Cutting Edge Talk Radio',
  '🚪 Knock! Knock! Mr. Logers... Lee Rogers, we think you gave up too soon, yet we sense it is not over yet. OBN... Long live the revolution! (everything is broken... ta na na na...)',
  '🚪 Knock! Knock! Mr. Cohen... Doug Owen, we think you gave up too soon, yet we sense it is not over yet. OBN... Long live the revolution! (everything is broken... ta na na na...)',
  '📰 Black Listed News|https://www.blacklistednews.com/',
  //'📻 Black Listed Radio|https://www.blacklistedradio.com/',
  '🚫️🇺🇳 Abolish the United Nations!',
  '🥕 Produce food, not war <foodnotbombs.net>|http://foodnotbombs.net/',
  '🥕 Food Not Bombs <foodnotbombs.net>|http://foodnotbombs.net/',
  '✊ Food Not Bombs <foodnotbombs.net>|http://foodnotbombs.net/',
  '👨‍🌾 [VISIT] Open Source Ecology|https://opensourceecology.org/',
  '👩‍🌾 [VISIT] Open Source Ecology|https://opensourceecology.org/',
  '🚜 [VISIT] Open Source Ecology|https://opensourceecology.org/',
  '🛞 [VISIT] Open Source Ecology|https://opensourceecology.org/',
  '⚙️ [VISIT] Open Source Ecology|https://opensourceecology.org/',
  '👪 [AD] Helping to Preserve Family Values <familysafe.com>|https://www.familysafe.com/?ref=tc',
  '👪 [AD] Family Safe: Helping to Preserve Family Values <familysafe.com>|https://www.familysafe.com/?ref=tc',
  '🐺️ [APP] Get LibreWolf|https://librewolf.net',
  '🦦 [APP] Otter Browser. Controlled by the user, not vice versa|https://otter-browser.org/?ref=tc',
  '🦁 [APP] 4 Reasons To Ditch Your Browser and Use Brave (and yes, one of them is Bitcoin)|https://thetinhat.com/blog/thoughts/brave-browser.html?ref=tc',
  '🦁 [APP] Reclaim Your Web. Get Brave|https://brave.com/?ref=tc',
  '🦁 [APP] Take Back Your Privacy. Get Brave|https://brave.com/?ref=tc',
  '🦁 [APP] Restore Privacy. Get Brave|https://brave.com/?ref=tc',
  '🦁 [APP] Take Back Your Web. Get Brave|https://brave.com/?ref=tc',
  '🦁 [APP] Get Brave|https://brave.com/?ref=tc',
  '🐧️ MX Linux <mxlinux.org>|https://mxlinux.org/?ref=tc',
  '🦁 [APP] Get Brave Browser|https://brave.com/?ref=tc',
  '🕴️ [APP] Get Tribler P2P|https://tribler.org/?ref=tc',
  '🈸 [APP] Get Tribler P2P|https://tribler.org/?ref=tc',
  '🧡️ [APP] Get Tribler P2P|https://tribler.org/?ref=tc',
  '🕊️ [APP] Get Tribler P2P|https://tribler.org/?ref=tc',
  '🕴️ [APP] Get Tribler BitTorrent|https://tribler.org/?ref=tc',
  '🈸 [APP] Get Tribler BitTorrent|https://tribler.org/?ref=tc',
  '🧡️ [APP] Get Tribler BitTorrent|https://tribler.org/?ref=tc',
  '🕊️ [APP] Get Tribler BitTorrent|https://tribler.org/?ref=tc',
  '🕴️ [APP] Get Tribler BitTorrent P2P|https://tribler.org/?ref=tc',
  '🈸 [APP] Get Tribler BitTorrent P2P|https://tribler.org/?ref=tc',
  '🧡️ [APP] Get Tribler BitTorrent P2P|https://tribler.org/?ref=tc',
  '🕊️ [APP] Get Tribler BitTorrent P2P|https://tribler.org/?ref=tc',
  '🕴️ [APP] Get Tribler P2P BitTorrent|https://tribler.org/?ref=tc',
  '🈸 [APP] Get Tribler P2P BitTorrent|https://tribler.org/?ref=tc',
  '🧡️ [APP] Get Tribler P2P BitTorrent|https://tribler.org/?ref=tc',
  '🕊️ [APP] Get Tribler P2P BitTorrent|https://tribler.org/?ref=tc',
  '🐧️ [APP] Get MX Linux|https://mxlinux.org/?ref=tc',
  '🐧️ Get MX Linux (even for old PCs) <mxlinux.org>|https://mxlinux.org/?ref=tc',
  '🐧️ Get MX Linux OS for free (old and new PCs) <mxlinux.org>|https://mxlinux.org/?ref=tc',
  '🐧️ Say “hello” to a better operating system for your PC <mxlinux.org>|https://mxlinux.org/?ref=tc',
  '🐧️ Get MX Linux for free. Say “hello” to a better operating system for your PC <mxlinux.org>|https://mxlinux.org/?ref=tc',
  '🔁 [APP] Your Data, Yours Only.|https://www.etesync.com/?ref=tc',
  '🌀️ [APP] Get Ungoogled-Chromium|https://github.com/ungoogled-software/ungoogled-chromium',
  '🦊️ (fire)Fox in Pythagorean Numerology is 666. Set yourself free. Get LibreWolf.|https://librewolf.net',
  '🦊️ (fire)Fox in Pythagorean Numerology is 666. Drop Firebeast. Get LibreWolf.|https://librewolf.net',
  '🐺 Firefox? Are you kidding? Get LibreWolf.|https://librewolf.net',
  '🦁 Firefox? Are you kidding? Get Brave.|https://brave.com/?ref=tc',
  '🦁 Firefox has no privacy, just pseudo-privacy. Get Brave, for true privacy.|https://brave.com/?ref=tc',
  '🦁 Firefox has no privacy, it has pseudo-privacy. Get Brave, for true privacy.|https://brave.com/?ref=tc',
  '🐺 Firefox has no privacy, just pseudo-privacy. Get LibreWolf, for true privacy.|https://librewolf.net',
  '🐺 Firefox has no privacy, it has pseudo-privacy. Get LibreWolf, for true privacy.|https://librewolf.net',
  '🧑‍⚕️ Free or cheap Energy & Transport conspiracy|http://whale.to/b/free_energy_h.html',
  '🚰 Say NO to Fluoridation <fluoridealert.org>|https://fluoridealert.org/?ref=tc',
  '💧 Act AGAINST water Fluoridation <fluoridealert.org>|https://fluoridealert.org/?ref=tc',
  '💧 Resist water Fluoridation <fluoridealert.org>|https://fluoridealert.org/?ref=tc',
  '🚰 Fluoride Action Network - Broadening Public Awareness on Fluoride. <fluoridealert.org>|https://fluoridealert.org/?ref=tc',
  '⛲ Fluoride Action Network <fluoridealert.org>|https://fluoridealert.org/?ref=tc',
  '🇺🇦 Support Ukraine',
  '🇷🇺 Support Russia',
  '🫵 Support You',
  '⛅ Heaven and Earth 🌙|https://annas-archive.org/md5/f766821578c71af2105bdb6f2cd9803a',
  '⛅ [BOOK] Heaven and Earth 🌙|https://annas-archive.org/md5/f766821578c71af2105bdb6f2cd9803a',
  '⛅ [BOOK] Heaven and Earth by Gabrielle Henriet 🌙|https://annas-archive.org/md5/f766821578c71af2105bdb6f2cd9803a',
  '⛅ [BOOK] Heaven and Earth by Gabrielle Henriet 🌙|ipfs://bafykbzacedcvoo4hpstmfkvancm5ylqtbn3vse6kdsyh3h4ioc5ubk2kl5od6',
  '👨‍🔬 You’ve got me Eric -- Albert Einstein <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '👨‍🔬 You’ve got me Eric -- Albert Einstein <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
  '🧑‍🔬 You’ve got me Eric -- Albert Einstein on Eric Dubay <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
  '🌄 Eric Dubay <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
  '🌅 Eric Dubay <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
  '🧑‍🔬 Eric Dubay <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
  '🧑‍🔬 True science with Eric <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '🗽 Eric Dubay <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '🧘 Eric Dubay <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '🌞 Eric Dubay <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
  '🧘 DGHF <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '🧘 Do Good. Have Fun. <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '😎 DGHF. Eric Dubay. <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '😎 Do Good. Have Fun. Eric Dubay. <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '😎 EricDubay.com – Do Good, Have Fun. <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '😎 Eric Dubay. Do Good. Have Fun. <ericdubay.com>|https://ericdubay.com/?ref=tc',
  '🏝️ Eric Dubay <atlanteanconspiracy.com>|http://www.atlanteanconspiracy.com/?ref=tc',
]

const widsom = [
  '🏌️ “A slave is one who waits for someone to come and free him.” --Ezra Pound',
  '🏌️ “Free Men Are Not Equal” and “Equal Men Are Not Free.” --William Luther Pierce',
  '🏌️ “We like to watch what’s happening around us, but we don’t like to participate, we don’t like to get involved; that’s why I hate spectators’ force, and have great contempt for sports fans.” --William Luther Pierce',
  '👴🏻 “We like to watch what’s happening around us, but we don’t like to participate, we don’t like to get involved; that’s why I hate spectators’ force, and have great contempt for sports fans.” --William Luther Pierce',
  '🧑🏻‍🏫 “We like to watch what’s happening around us, but we don’t like to participate, we don’t like to get involved; sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🧑🏻‍🏫 “Sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🛋️ “Sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🛋️‍⃠ “Sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🚫️👮 Fuck teh Police!',
  '🚫️🚔 Fuck teh Police!',
  '🚫️🚨 Fuck teh Police!',
  '🚫️👮 Fuck the Police!',
  '🚫️🚔 Fuck the Police!',
  '🚫️🚨 Fuck the Police!',
  '🗣️ Call him Mister Vain...',
  '🗣️ Call him Mr. Vain...',
  '📞 Calling Mr. Vain...',
  '🛰️ Satellites are hoax!',
  '🪖 The war on terror is a hoax!',
  '📺 Disconnect from cable and "satellite" TV',
  '👨‍🌾 Grow your own food',
  '👨‍🌾 Buy your food from a local farmer',
  '👨‍🌾 Buy food from a local farmer',
  '👩‍🌾 Buy your food from your local farmer',
  '🚜 Buy food from your local farmer',
  '🎞️ [WATCH] They Live (1988)|magnet:?xt=urn:btih:A2A67F4CF35C0FA4D2BC78B9CEB89F6AB2F9D69F&tr=udp%3A%2F%2Fwww.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2F9.rarbg.com%3A2920%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&dn=They+Live+(1988)+%5B790MB%5D',
  '🎞️ [WATCH] They Live, We Sleep|magnet:?xt=urn:btih:A2A67F4CF35C0FA4D2BC78B9CEB89F6AB2F9D69F&tr=udp%3A%2F%2Fwww.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2F9.rarbg.com%3A2920%2Fannounce&tr=udp%3A%2F%2Ftracker.torrent.eu.org%3A451%2Fannounce&tr=udp%3A%2F%2Ftracker.moeking.me%3A6969%2Fannounce&dn=They+Live+(1988)+%5B790MB%5D',
  '🎞️ [WATCH] They Live, We Sleep|https://webtor.io/#/show?file=They.Live.1988.720p.BluRay.x264.YIFY.mp4&pwd=%2FThey%20Live%20%281988%29&magnet=magnet%3A%3Fxt%3Durn%3Abtih%3Aa2a67f4cf35c0fa4d2bc78b9ceb89f6ab2f9d69f%26dn%3DThey%2BLive%2B%281988%29%26tr%3Dudp%253A%252F%252Fopen.demonii.com%253A1337%26tr%3Dudp%253A%252F%252Ftracker.coppersurfer.tk%253A6969%26tr%3Dudp%253A%252F%252Ftracker.leechers-paradise.org%253A6969%26tr%3Dudp%253A%252F%252Ftracker.pomf.se%253A80%26tr%3Dudp%253A%252F%252Ftracker.publicbt.com%253A80%26tr%3Dudp%253A%252F%252Ftracker.openbittorrent.com%253A80%26tr%3Dudp%253A%252F%252Ftracker.istole.it%253A80',
  '💀 THEY LIVE, WE SLEEP',
  '💀 They Live, We Sleep',
  '👺 They Live, We Sleep',
  '🎭 They Live, We Sleep',
  '☣ They Live, We Sleep',
  '☠ They Live, We Sleep',
  '😴 They Live, We Sleep',
  '🛌 They Live, We Sleep',
  '💤 They Live, We Sleep',
  '🤖 They Live, We Sleep',
  '🌴 “The best time to plant a tree was 20 years ago. The second best time is now.” -- Chinese Proverb',
  '🌲 “The best time to plant a tree was 20 years ago. The second best time is now.” -- Chinese Proverb',
  '🌳 “The best time to plant a tree was 20 years ago. The second best time is now.” -- Chinese Proverb',
  '🔌 “Almost everything will work again if you unplug it for a few minutes, including you.” -- Anne Lamott',
  '☕ Be mindful when drinking tea. Taking a mindful tea break is a powerful way to stop the racing mind and come to the present moment. Make a tea and as you drink it bring your attention fully to the experience by tuning into your senses. Feel the warmth of the cup in your hands, taste the tea with each sip, notice the sounds around you. When you feel your mind wandering, let go of thoughts and come back to the sensation of the warmth of the tea cup in your hands.',
  '🍵 Be mindful when drinking tea. Taking a mindful tea break is a powerful way to stop the racing mind and come to the present moment. Make a tea and as you drink it bring your attention fully to the experience by tuning into your senses. Feel the warmth of the cup in your hands, taste the tea with each sip, notice the sounds around you. When you feel your mind wandering, let go of thoughts and come back to the sensation of the warmth of the tea cup in your hands.',
  '🥬 Get smelly.  Garlic, onions, spring onions and leeks all contain material that’s good for you. A study at the Child’s Health Institute in Cape Town found that eating raw garlic helped fight serious childhood infections.',
  '🧅 Get smelly.  Garlic, onions, spring onions and leeks all contain material that’s good for you. A study at the Child’s Health Institute in Cape Town found that eating raw garlic helped fight serious childhood infections.',
  '🧄 Get smelly.  Garlic, onions, spring onions and leeks all contain substance that’s good for you. A study at the Child’s Health Institute in Cape Town found that eating raw garlic helped fight serious childhood infections.',
  '🦾️ Strong people go for help. Ask for assistance. Gnashing your teeth in the dark will not get you extra brownie points. It is a sign of strength to ask for assistance and people will respect you for it.',
]

const motds = [
  '🚿 Save steamy scenes for the bedroom. Showering or bathing in water that’s too hot will dry out your skin and cause it to age prematurely. Warm water is much better.',
  '👨‍👩‍👦 [READ] Children, devices, and going online. A guide to security and privacy.|https://www.lookout.net/articles/children-online-privacy-and-security-guide.html',
  '👹️ X X X = 6 6 6|https://www.dcode.fr/pythagorean-numerology',
  '👹️ Hebrew Gematria א 1 ב 2 ג 3 ד 4 ה 5 ו 6 ז 7 ח 8 ט 9 י 10 כ 20 ל 30 מ 40 נ 50 ס 60 ע 70 פ 80 צ 90 ק 100 ר 200 ש 300 ת 400 ך 500 ם 600 ן 700 ף 800 ץ 900 (WWW = ווו = 666)',
  '👹️ Pythagorean Alphabet Numerology A 1 B 2 C 3 D 4 E 5 F 6 G 7 H 8 I 9 J 1 K 2 L 3 M 4 N 5 O 6 P 7 Q 8 R 9 S 1 T 2 U 3 V 4 W 5 X 6 Y 7 Z 8 (XXX = 666)',
  '🤔️ If you KNEW that by watching porn, you’re being played by the beast, would you still watch porn? (XXX = 666)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ If you KNEW that by watching this, you’re being played by the beast, would you still watch this? (XXX = 666)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ If you KNEW that by watching porn, you’re being played by the beast, would you still watch it? (XXX = 666)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ If you KNEW that you’re being played by the beast, would you still watch porn? (XXX = 666)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ XXX = 666 |https://www.dcode.fr/pythagorean-numerology',
  '👹️ XXX = 666. Did you ever wonder why “XXX”?|https://www.dcode.fr/pythagorean-numerology',
  '🤔️ Did you ever wonder why “XXX”? (XXX = 666)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ Did you ever wonder why “XXX”? (XXX is 666)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ Did you ever wonder why “XXX”? (XXX in Pythagorean Numerology is 666)|https://www.dcode.fr/pythagorean-numerology',
  '👩️ [READ] Former porn star Jennie Ketcham has written a memoir about her struggles with sex and cocaine addiction and her decision to leave porn for good.|https://www.buzzfeed.com/annanorth/ex-porn-star-speaks-out-about-sex-addiction-in-por',
  '👩️ [READ] Contact a porn performer and ask if you can help... It’s easy|https://web.archive.org/web/20100504081834if_/http://www.thepinkcross.org/pinkcross-blogs/shelley-lubben/december-2009/urgent-please-help-ex-porn-star-mommy',
  '👩️ [READ] Contact a porn actress or actor and ask if you can help them out of porn... It’s easy|https://web.archive.org/web/20100504081834if_/http://www.thepinkcross.org/pinkcross-blogs/shelley-lubben/december-2009/urgent-please-help-ex-porn-star-mommy',
  '👩️ [READ] Contact a porn actress or actor and ask if you can help them retire... It’s easy|https://web.archive.org/web/20100504081834if_/http://www.thepinkcross.org/pinkcross-blogs/shelley-lubben/december-2009/urgent-please-help-ex-porn-star-mommy',
  '📖 [BOOK] Merchants of Sin.|https://web.archive.org/web/20170930160005/https://merchants-of-sin.com/',
  '🏝️ [BOOK] Earth is not a globe. You might want to read about it.|magnet:?xt=urn:btih:78979a58b4dddf80f161bbd1b2348040f96a2947&dn=William+Carpenter+-+One+Hundred+Proofs+that+the+Earth+is+not+a+Globe+(1885)+-+pdf+%5BTKRG%5D&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🌄️ [PDF] Earth is round and horizontal. You might want to look into it.|magnet:?xt=urn:btih:78979a58b4dddf80f161bbd1b2348040f96a2947&dn=William+Carpenter+-+One+Hundred+Proofs+that+the+Earth+is+not+a+Globe+(1885)+-+pdf+%5BTKRG%5D&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '👹️ “Also it causes all, both small and great, both rich and poor, both free and slave, to be marked on the right hand or the forehead, so that no one can buy or sell unless he has the mark, that is, the name of the beast or the number of its name. This calls for wisdom: let the one who has understanding calculate the number of the beast, for it is the number of a man, and his number is 666.” (Revelation 13:16-18) XXX = 666|https://www.dcode.fr/pythagorean-numerology',
  '👹️ XXX = 666. Mark of the beast. (Revelation 13:16-18)|https://www.dcode.fr/pythagorean-numerology',
  '👹️ XXX = 666. The mark of the beast.|https://www.dcode.fr/pythagorean-numerology',
  '👹️ XXX = 666. The mark of the beast. Did you ever wonder?|https://www.dcode.fr/pythagorean-numerology',
  '👹️ WWW in Hebrew Gematria is 666. The mark of the beast. Did you ever wonder?',
  '🦊️ FOX in Pythagorean Numerology is 666|https://www.dcode.fr/pythagorean-numerology',
  '📽️ These scense are obscene. This is not reality.',
  '📽️ These scense are obscene',
  '📽️ This is not reality',
  '🧔‍♂️️👩️ [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩️👨️ [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩🏻👨🏻 [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '🧑🏾👩🏾 [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '🧑🏿👩🏿 DON’T FUCKING MIX!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩🏿👨🏿 [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩🏾👨🏾 [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩🏼👨🏼 [WATCH] Racial identity matters!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩🏼👨🏼 KEEP THE RACE!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '🏎️ KEEP THE RACE!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '🙅🏻‍♀️️🙅🏻️🙅🏻‍♂️️ DON’T MIX!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '🙅🏻‍♀️️🙅🏻‍♂️️ DON’T MIX!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '🙅🏾‍♂️️🙅🏾‍♀️️ DON’T MIX!|https://farside.link/invidious/watch?v=Y7wJG5JkQ4A',
  '👩🏼👩🏿👩🏻 Treasures <iamatreasure.com>|https://www.iamatreasure.com/?ref=tc',
  '👩🏻 Mindful living. You’ve probably heard the old adage that life’s too short to stuff a mushroom. But perhaps you should consider the opposite: that life’s simply too short NOT to focus on the simple tasks. By slowing down and concentrating on basic things, you’ll clear your mind of everything that worries you.',
  '👩🏻 Be aware of your connection to the universe. Live with the awareness that everything you are end everything you do directly or indirectly affects everything and everyone around you. Small or big, what you choose to do can alter the course or destiny of living or non-living things that come your way. As you realize this, you will take more responsibility for your actions and influence, and will never take spiritual things lightly.',
  '👩🏻 [READ] Former Porn Star Alexa Milano Story (aka Melissa)|https://farside.link/nitter/pinkcrossfound',
  '👩🏻 [WATCH] EX PORN STAR DR. SHELLEY LUBBEN PRESENTATION AT THE SEX SEMINAR PT. 2|https://farside.link/invidious/watch?v=mXmqcjMrPcI',
  '👨🏼 [WATCH] In my opinion, most pornography online is utterly degrading and even violent. The time has come for us, as men, to realise the damage we are doing by watching it. God bless. -- doubts|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] Pray for these women as well that they realize they are loved by God and should be treated like treasure. -- Steve Alexander|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] Pray for these women as well that they realize they are loved by God and should be treated like treasure... not toilet paper. -- Steve Alexander|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] Don’t let them steal it from you. Rise Up!|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] You were born to lead. Rise Up!|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] You were born to lead, not to masturbate to porn. Rise Up!|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] What are you doing?!! Rise Up!|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] Ex Porn Star’s Husband Exhorts Men to Rise Up!|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👨🏼 [WATCH] Ex Porn Star’s Husband Exhorts Men to Rise Up! #shelleylubben|https://farside.link/invidious/watch?v=qgthKLnRcTM',
  '👩🏻 [WATCH] Sex Trafficking Victim Empowering Others (story of Morgan Stacy)|https://farside.link/invidious/watch?v=wENslFkl3H8',
  '♀️ We love you Shelley (Pink Cross Foundation) #shelleylubben|http://www.youtube.com/slubben',
  '♀️ We are proud of you, our dear and beloved Shelley (Pink Cross Foundation) #shelleylubben',
  '♀️ We are proud of you, dear and beloved Shelley (Pink Cross Foundation) #shelleylubben',
  '♀️ Thank you Shelley Lubben (Pink Cross Foundation) #shelleylubben',
  '👩 EX PORN STAR LOVING PEOPLE OUT OF PORN! #shelleylubben|https://web.archive.org/web/20100714123949if_/http://www.myspace.com/shelleylubben',
  '✊️ EX PORN STAR LOVING PEOPLE OUT OF PORN! #shelleylubben|https://web.archive.org/web/20100714123949if_/http://www.myspace.com/shelleylubben',
  '🦸‍♀️ EX PORN STAR LOVING PEOPLE OUT OF PORN! #shelleylubben|https://web.archive.org/web/20100714123949if_/http://www.myspace.com/shelleylubben',
  '👩 [READ] Shelley’s Story|https://web.archive.org/web/20100504101757if_/http://shelleylubben.com/shelleys-story',
  '📊 [READ] The Internet pornography industry generates $12 billion dollars in annual revenue, larger than the combined annual revenues of ABC, NBC, and CBS (Family Safe Media, January 10, 2006)|https://www.familysafe.com/pornography-statistics/',
  '👨‍👩‍👦 [READ] The largest group of viewers of Internet porn is children between ages 12 and 17 (Family Safe Media, December 15, 2005)|https://www.familysafe.com/pornography-statistics/',
  '👩 [READ] If God can heal a porn star, He can heal anyone. --Shelley Lubben|https://web.archive.org/web/20100504101757if_/http://shelleylubben.com/shelleys-story',
  '👩 [READ] PORN IS NOT GLAMOROUS. GET THE FACTS. GET HELP.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '👩 [READ] Porn is not glamorous. Get the facts. Get help.|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] Porn is not glamorous. Get the facts. Get help.|https://web.archive.org/web/20130425002816if_/https://www.shelleylubben.com/porn-industry',
  '👩 [READ] “I did over 100 xxx hardcore movies where I was slapped, hit, choked and forced to to sex scenes I never agreed to. As I did more and more scenes I abused prescription pills which were given to me anytime I wanted by several Doctors in the San Fernando Valley. I was given Vicodin, Xanax, Norcos, Prozac and Zoloft.” -- Michelle Avanti|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] My first movie I was treated very roughly by 3 guys. They pounded on me, gagged me with their penises, and tossed me around like I was a ball! I was sore, hurting and could barely walk. My insides burned and hurt so badly. I could barely pee and to try to have a bowel movement was out of the question. I was hurting so bad from the physical abuse from these 3 male porn stars! -- Alexa Milano|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “People in the porn industry are numb to real life and are like zombies walking around. The abuse that goes on in this industry is completely ridiculous. The way these young ladies are treated is totally sick and brainwashing. I left due to the trauma I experienced even though I was there only a short time.” -- Jessie Jewels|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “I had bodily fluids all over my face that had to stay on my face for ten minutes. The abuse and degradation was rough. I sweated and was in deep pain. On top of the horrifying experience, my whole body ached, and I was irritable the whole day. The director didn’t really care how I felt; he only wanted to finish the video.” -- Genevieve|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “They told me if had my AIDS test that I’d be safe. I arrived on the set with my test and did a hardcore scene with two men. Within that week I was very sick with a fever of 104 and blisters all over my mouth, throat and private area. I looked like a monster. The doctor told me I had the non-curable disease Genital Herpes. I wanted to die.” -- Roxy aka Shelley Lubben|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “The truth is I let my lifestyle get the best of me. I hate life. I’m a mess. A disaster. I’ve attempted suicide many times.  No one cares about a dead porn star or stripper.” -- Neesa|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “Guys punching you in the face. You have semen from many guys all over your face, in your eyes. You get ripped. Your insides can come out of you. It’s never ending.” -- Jersey Jaxin|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “I found out 2 days later that I had caught gonorrhea in my first scene! As quick as that the glamour of being a porn star was gone. In the five years I was shooting I caught Gonorrhea and Chlamydia many times. Sometimes both at the same time about every 3-5 months.” -- Nadia Styles|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “My first scene was one of the worst experiences of my life. It was very scary. It was a very rough scene. My agent didn’t let me know ahead of time... I did it and I was crying and they didn’t stop. It was really violent. He was hitting me. It hurt. It scared me more than anything. They wouldn’t stop. They just kept rolling.  Drugs are huge. They’re using viagra. It’s unnatural. The girls will be on xanax and vicodin.” -- Sierra Sinn|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 [READ] “As for myself, I ended up paying the price from working in the porn industry. In 2006, not even 9 months in, I caught a moderate form of dysplasia of the cervix (which is a form of HPV, a sexually transmitted disease) and later that day, I also found out I was pregnant. I had only 1 choice which was to abort the baby during my first month. It was extremely painful emotionally and physically. When it was all over, I cried my eyes out.” -- Tamra Toryn|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '🌌 Good night, sweetheart. Rest heals the body and has been shown to lessen the risk of heart trouble and psychological problems.',
  '🧘 Explore your spiritual core. By exploring your spiritual core, you are simply asking yourself questions about the person you are and your meaning. Ask yourself: Who am I? What is my purpose? What do I value most? These questions will lead you down a road where you will think more in-depth about yourself and allow you to notice things about yourself that will help you achieve fulfillment.',
  '👨‍👩‍👦 Love family, not porn',
  '👶👦👧 Make life, not porn',
  '👼 Make babies, not porn',
  '👶👦👧 Make children, not porn',
  '👼 Babies are joy',
  '🏌️ “We like to watch what’s happening around us, but we don’t like to participate, we don’t like to get involved; that’s why I hate spectators’ force, and have great contempt for sports fans.” --William Luther Pierce',
  '👴🏻 “We like to watch what’s happening around us, but we don’t like to participate, we don’t like to get involved; that’s why I hate spectators’ force, and have great contempt for sports fans.” --William Luther Pierce',
  '🧑🏻‍🏫 “We like to watch what’s happening around us, but we don’t like to participate, we don’t like to get involved; sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🧑🏻‍🏫 “Sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🛋️ “Sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  '🛋️‍⃠ “Sitting on your couch and watching other people do things, isn’t healthy.” --William Luther Pierce',
  //'( • )( • ) Do self-checks. Do regular self-examinations of your breasts. Most partners are more than happy to help, not just because breast cancer is the most common cancer among women. The best time to examine your breasts is in the week after your period.',
  //'🤱 Do self-checks. Do regular self-examinations of your breasts. Most partners are more than happy to help, not just because breast cancer is the most common cancer among women. The best time to examine your breasts is in the week after your period.',
  '🧘 Do yoga, not porn.',
  '🌶️ Curry favour. Hot, spicy foods containing chillies or cayenne pepper trigger endorphins, the feel-good hormones. Endorphins have a powerful, almost narcotic, effect and make you feel good after exercising.',
  '🍽️ Don’t skip breakfast. Studies show that eating a proper breakfast is one of the most positive things you can do if you are trying to lose weight. Breakfast skippers tend to gain weight.',
  '🥗 Don’t skip breakfast. Studies show that eating a proper breakfast is one of the most positive things you can do if you are trying to lose weight. Breakfast skippers tend to gain weight.',
  '🌅 Don’t skip breakfast. Studies show that eating a proper breakfast is one of the most positive things you can do if you are trying to lose weight. Breakfast skippers tend to gain weight.',
  '📖 Here are some verses from the Bible that you should read: John 3:16, Rom. 3:23, Rom. 5:8, Rom. 10:13, Rev. 3:20, Mark 2:17, James 4:8|https://web.archive.org/web/20100619230602if_/http://thepinkcross.org/page/gods-help',
  '♱ You were made for greater things than porn or sex work! Jesus said so. “For you are God’s masterpiece. Created to be made new in Christ Jesus to do good works which God prepared in advanced for you to do”. Ephesians 2:10; God has something awesome for you to do and it isn’t viewing or doing porn!|https://web.archive.org/web/20100619230602if_/http://thepinkcross.org/page/gods-help',
  '👩 [READ] I was a porn star living the glamorous life. Drug overdoses, Herpes, suicide attempts and abuse on the porn set. I nearly died but by the grace of God I survived. Many didn’t.|https://web.archive.org/web/20100504101408if_/http://www.shelleylubben.com/pornstars',
  '👩 A MILLION thanks to Shelley for helping me through this along with the everyone who supports The Pink Cross Foundation. With their help, I was recently able to gain strength after quitting my job at the tanning salon because I needed to step outside of myself to see the bigger picture and self medicating yourself with marijuana does nothing but kill you spirit (yes, porn does effect your life after you leave no matter what you are doing outside of the industry). I’m sober now and feel amazing! The truth really does set you free and I’m thankful to God everyday for my new life. -- Tammie, former porn star Tamra Toryn|https://web.archive.org/web/20100619224136if_/http://thepinkcross.org/page/testimonies',
  '👩 Shelley Lubben is one of the most compassionate people I have ever met. Her love, support, and guidance in my life has been of countless value. -- Karly, former porn star Becca Bratt|https://web.archive.org/web/20100619224136if_/http://thepinkcross.org/page/testimonies',
  '👩 Thank you for restoring my faith Shelley and showing me the Way. You have helped me more than you know. I love you and look up to you. I hope that one day I can help people too! -- Julie, former porn star Sierra Sinn|https://web.archive.org/web/20100619224136if_/http://thepinkcross.org/page/testimonies',
  '👩 I am so grateful for Pink Cross Foundation for reaching out to me and helping me better myself. I’m now strong enough to stand up and say, “I’m done with this horrible industry!” Thank you Shelley and the Pink Cross Foundation for loving me and seeing me as the great woman I am. -- Amanda, former porn star Erin Moore|https://web.archive.org/web/20100619224136if_/http://thepinkcross.org/page/testimonies',
  '👩 Ex-Porn Star Tells the Truth About the Porn Industry by Shelley Lubben (aka Roxy) of Pink Cross Foundation|https://www.covenanteyes.com/2008/10/28/ex-porn-star-tells-the-truth-about-the-porn-industry/',
  '👩 Porn is not glamorous. Get the facts. Get help.|https://web.archive.org/web/20130424091914if_/http://thepinkcross.org/page/meet-our-president',
  // There is no such thing as hard for something that is not substantial
  //'👩 Fighting porn is hard. Helping people out of porn is even harder.',
  '💰️ The porn industry, is the region where you wish to become a millionaire but you’re more likely to end up dead or as a crack addict on welfare. #boycottporn',
  '💰️ They (the victims a.k.a “participants” or “talents” so-called) wish to become millionaires but they are more likely to end up dead or as crack addicts on welfare',
  '💰️ The porn industry, is the region where you wish to get by and then get a real job, but you never knew that you will end up your life in pornography, because once you’re in that industry, you’re not likely to ever find a proper job, nor to sustain a meaningful and strong relationship. #boycottporn',
  '🤮️ They just want to get by and then get a real job, but no one told them that they are more likely to end up in pornography for life, not because of qualification, but because they have a mark of disgrace which goes along with them, and that is why they have higher chances to remain in that disgusting industry for life. #savedignity',
  '🥺️ Dear Viewer, please have mercy on them, those people are subjected to higher rates of abortion, cancer, divorce, drug addiction, loneliness, mortality and suicide.  May God and You have mercy on them. #boycottporn',
  '💊️ A large portion of those men and women are using drugs in order to depress their senses and be able to participate in these scenes.  They are likely to end up as drug addicts because otherwise they’ll just disfunction without high doses of drugs, as they might get used to it over time.  YOU HAVE THE POWER TO PREVENT IT.  TURN IT OFF!',
  '💊️ It is unnatural to watch and even to participate.  A large portion of those men and women are using drugs in order to depress their senses and be able to participate in these scenes.  They are likely to end up as drug addicts because otherwise they’ll just disfunction without high doses of drugs, as they might get used to it over time.',
  '🧑 “If you want things in your life to change, you’ve got to change things in your life” -- Kevin Trudeau #dontstayhome',
  '🤵 “If you want things in your life to change, you’ve got to change things in your life” -- Kevin Trudeau #dontstayhome',
  '🆘️ Viewer, help yourself by helping them. Turn this fictional nonsense off.',
  '🆘️ Viewer, help yourself by helping them. Turn off this fictional nonsense.',
  '❤️ Pay attention. Our only role in this world is to be awake. Consciously do things to bring yourself into the moment. If you’re with someone and not paying attention, stop and zone in on that person and be with them fully. Start to eliminate background noises and sights until it’s just you and them. If this is difficult, while you’re alone, practise removing other senses so you begin to focus on one thing. Close your eyes for a minute and focus on a single noise or cover your ears and look at a single object.',
  '❤️ Viewer, love them as you love yourself. Turn off this fictional nonsense and boycott this industry. #boycottporn',
  '💕️ Viewer, love them as you love family. Would you support it, if it was your sister or brother on that screen? #boycottporn',
  '🤵 “It is not fun to do it alone” #dontstayhome',
  '🧔 “It is not fun to do it alone” Go out and find a mate #dontstayhome',
  '🧔‍♂️ “It is not as fun when you do it alone” Go out and find a woman #dontstayhome #getmarried',
  '🤵 “It is not fun to do sex alone” #dontstayhome',
  '🚫️ Boycott the Porn Industry #boycottporn',
  '🚫️ Ignore the Porn Industry #boycottporn',
  '🚫️ Ignore Pornography #boycottporn',
  '🚑 [READ] PUBLIC HEALTH HARMS OF PORNOGRAPHY #boycottporn|https://endsexualexploitation.org/issues/pornography/',
  '🩺 [PDF] Pornography & Public Health Research Summary #boycottporn|https://endsexualexploitation.org/wp-content/uploads/NCOSE_Jan-2019_Research-Summary_Pornography-PublicHealth_FINAL.pdf',
  '🏥 [PDF] Public health harms of pornography #boycottporn|https://endsexualexploitation.org/wp-content/uploads/NCOSE_Jan-2019_Research-Summary_Pornography-PublicHealth_FINAL.pdf',
  '👦👧 Get help to stop watching porn: consult your acquaintance',
  '👦👧 Get help to stop watching porn: consult your sibling',
  '👦👧 Get help to stop watching porn: consult your mother',
  '👦👧 Get help to stop watching porn: consult your father',
  '👦👧 Get help to stop watching porn: consult your family',
  '👦👧 Get help to stop watching porn: consult your friend',
  '👦👧 Porn seriously harms you and others around you',
  '👦👧 Smoking seriously harms you and others around you',
  '🧔‍♂️ A manly male does’t watch porn',
  '🦲 Porno makes you bald',
  '🧑‍🦲 Porno makes you bald',
  '👩‍🦲 Porno causes baldness also in women',
  '🦀 Medical research determine: 85% of overhaul brain cancer are caused due to porn',
  '🦀 Medical research determine: 85% of overhaul brain cancer are caused due to excessive consumption of porn',
  '🦀 Medical research determine: 85% of all brain cancer are caused due to porn',
  '🦀 Medical research determine: 85% of all brain cancer are caused due to excessive porn consumption',
  '🦀 Medical research determine: 85% of all lung cancer are caused due to smoking',
  '👦👧 [PDF] THE MOST DANGEROUS PLAYGROUND IS NOW ... IN OUR KIDS’ POCKETS #boycottporn|https://endsexualexploitation.org/wp-content/uploads/Most-Dangerous-Playground_NCOSE_2023.pdf',
  '🚫️ AntiPornography.org Nonreligious - Nonpartisan <antipornography.org>|https://www.antipornography.org/home.html?ref=tc',
  '👩️ [READ] Jenna Jameson’s 25 Good Reasons Why No One Would Ever Want To Become a Porn Star|https://www.antipornography.org/jenna_jamesons_25_reasons.html?ref=tc',
  '👩️ [WATCH] Two EX PORN STARS Say Working In Porn Is A DEAD END TRIP to Nowhere. Jessie Rogers & Vanessa Belmond|https://farside.link/invidious/watch?v=AIvj2ib6Qs0',
  '👩️ [READ] Ex Porn Star "Jessie Rogers" Exposes Shocking Abuses of the Porn Industry and Tells Her Story|https://www.antipornography.org/ex-porn-star-jessie-rogers-exposes-shocking-abuse.html?ref=tc',
  '📺 [WATCH] Documentary Films and Television Programs on Pornography, Prostitution, and Sex Trafficking, etc.|https://www.antipornography.org/documentaries.html?ref=tc',
  '📺 Viewer discretion is advised.',
  // Pornography Industry Factoid 2008 from Shelley Lubben
  // Suicide Deaths in the U.S. Pornography Industry since 1970
  '🪦️ In memory of Jessica Redding aka Jessica Jaymes. CAUSE OF DEATH: Seizure and chronic alcohol abuse – September 17, 2019|https://nypost.com/2019/11/04/porn-star-jessica-jaymes-cause-of-death-revealed/',
  '🪦️ In memory of Emily Irene Sander aka Zoey Zane. CAUSE OF DEATH: Murder – November 24, 2007|https://www.thepitchkc.com/israel-mireles-guilty-in-murder-of-emily-sander-zoey-zane/',
  '🪦️ In memory of Anastasia Blue. CAUSE OF DEATH: Tylenol overdose/suicide July 19, 2008',
  '🪦️ In memory of Deven Augustina Schuette aka Deven Davis (April 6, 1979 - August 17, 2018). Mrs. Davis had struggled with drug addiction for over 20 years; Nitrous-oxide, Cocaine and Norco. #RIP #20 #39',
  '🪦️ In memory of Deven Augustina Schuette aka Deven Davis. CAUSE OF DEATH: Accidental drug overdose – February 21, 1976 - August 17, 2018', // Born at April 6, 1979 perhaps
  '🪦️ In memory of Anastasia Blue. CAUSE OF DEATH: Tylenol overdose/suicide – July 19, 2008',
  '🪦️ In memory of Kent North. CAUSE OF DEATH: Drug overdose/suicide July 4, 2007',
  '🪦️ In memory of Chico Wang Porn director and porn actor. CAUSE OF DEATH: Drug overdose/suicide – September 29, 2007',
  '🪦️ In memory of Jon Dough. CAUSE OF DEATH: Suicide by hanging – August 27, 2006, in Chatsworth, California',
  '🪦️ In memory of Tim Barnett. CAUSE OF DEATH: Suicide by hanging – July 13, 2005',
  '🪦️ In memory of Lance Heywood. CAUSE OF DEATH: Jumped off a building – April 29, 2005',
  '🪦️ In memory of Karen Lancaume. CAUSE OF DEATH: Drug overdose/suicide – January 28, 2005',
  '🪦️ In memory of Camilla De Castro. CAUSE OF DEATH: Drug overdose/suicide – July 26, 2005',
  '🪦️ In memory of Johnny Rahm. CAUSE OF DEATH: Suicide by hanging – November 7, 2004',
  '🪦️ In memory of Megan Joy Serbian aka Naughtia Childs. CAUSE OF DEATH: Jumped off balcony – 	October 5, 1979 - January 7, 2002',
  '🪦️ In memory of Naughtia Childs. CAUSE OF DEATH: Jumped off balcony – January 7, 2002',
  '🪦️ In memory of Jon Vincent. CAUSE OF DEATH: Drug overdose/suicide – May 3, 2000',
  '🪦️ In memory of Brad Chase. CAUSE OF DEATH: Suicide by hanging – April 19, 2000',
  '🪦️ In memory of Kyle McKenna. CAUSE OF DEATH: Drug overdose/suicide – March 14, 2000',
  '🪦️ In memory of Malinda Gayle McCready aka Mindy McCready. CAUSE OF DEATH: Self-inflicted gunshot wound – February 17, 2013 (suicide)',
  '🪦️ In memory of Wendy O. Williams. CAUSE OF DEATH: Self-inflicted gunshot wound – April 7, 1998 (suicide)',
  '🪦️ In memory of Steve Fox. CAUSE OF DEATH: Suffered from mental illness and committed suicide October 23, 1997',
  '🪦️ In memory of Christian Fox. CAUSE OF DEATH: Left suicide note and overdosed on drugs October, 1996',
  '🪦️ In memory of Alex Jordan. CAUSE OF DEATH: Suicide by hanging – July 2, 1995',
  '🪦️ In memory of Cal Jammer. CAUSE OF DEATH: Self-inflicted gunshot wound - January 25, 1995 (suicide)',
  '🪦️ In memory of Savannah. CAUSE OF DEATH: Self-inflicted gunshot wound – July 11, 1994 (suicide)',
  '🪦️ In memory of Rod Phillips. CAUSE OF DEATH: Drug overdose/suicide as he lay dying of AIDS – June 7, 1993',
  '🪦️ In memory of Nancee Kellee (Daughter of actor Jerry Van Dyke). CAUSE OF DEATH: Self-inflicted asphyxiation by hanging – November 17, 1991 (suicide)',
  '🪦️ In memory of Kristina Lisina|https://www.thesun.co.uk/news/15498206/who-onlyfans-kristina-lisina-cause-of-death/',
  '🪦️ In memory of Alan Lambert. CAUSE OF DEATH: Self-inflicted gunshot wound – December 20, 1992 (suicide)',
  '🪦️ In memory of Megan Leigh. CAUSE OF DEATH: Self-inflicted gunshot wound – June 16, 1990 (suicide)',
  '🪦️ In memory of Shauna Grant. CAUSE OF DEATH: Self-inflicted gunshot wound - March 23, 1984 (suicide)',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  Dakota Skye’s growing drug addiction, breakups, and a diminishing supply of work in the industry, led to her downward spiral and subsequent death.  Mrs. Scott was 27 years old at her death. #RIP #27|https://www.dailystar.co.uk/news/world-news/tragic-life-porn-star-dakota-24602938',
  '🪦️ In memory of Angela Shunali Dhingra aka Angela Devi. CAUSE OF DEATH: Suicide by asphyxiation - July 30, 1975 - March 31, 2006',
  '🪦️ In memory of Lauren Scott aka Dakota Skye. CAUSE OF DEATH: Acute multidrug intoxication - April 17, 1994 - June 9, 2021',
  '🤢 FACT: Addictions increase by an average of 92% in parents to porn performers, Lauren Scott’s (Dakota Skye) mother died in 2019 due to "addiction and alcoholism"',
  '🤢 FACT: Substance abuse increases by an average of 85% in parents to porn performers, Lauren Scott’s (Dakota Skye) mother died in 2019 due to "addiction and alcoholism"',
  '🍹 Alcohol abuse may increase by 78% in parents to porn performers, Lauren Scott’s (Dakota Skye) mother died in 2019 due to "addiction and alcoholism"',
  '🍹 Alcohol abuse may increase by 78% in parents to porn performers, Lauren Scott’s (Dakota Skye) mother died in 2019 due to "addiction and alcoholism"',
  '🍹 Parents to porn performers have 78% chances to develop alcohol addiction, Lauren Scott’s (Dakota Skye) mother died in 2019 due to "addiction and alcoholism"',
  '🪦️ THEY ARE MORE DEPENDENT THAN THEY APPEAR: Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  In 2019, her mother died of "addiction and alcoholism". In 2020, two of her grandparents died of flu, she found herself homeless. #RIP #19 #27',
  '🪦️ THEY ARE MORE FRAGILE THAN THEY APPEAR: Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  In 2019, her mother died of "addiction and alcoholism". In 2020, two of her grandparents died of flu, she found herself homeless, and her pet dog died. In spring 2021 she was working as an escort. #RIP #19 #27',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  Mrs. Scott died due to accidental overdose; her body was discovered at her Los Angeles motorhome by her husband.  Mrs. Scott was 27 years old at her death. #RIP #19 #27|https://web.archive.org/web/20210612221620if_/https://news.yahoo.com/porn-star-dakota-skye-received-171405012.html',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  An official at the Los Angeles County Medical Examiner’s Office confirmed to that they are currently investigating the death of a woman named Lauren Scott who died on June 9. She was 27 and listed as "homeless," the office said.  Mrs. Scott (div.) was 27 years old at her death. #RIP #19 #27|https://web.archive.org/web/20210612221620if_/https://news.yahoo.com/porn-star-dakota-skye-received-171405012.html',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  Her aunt, Linda Arden, told in an interview "Lauren was a product of a highly dysfunctional family involving drugs, alcohol, physical, emotional, verbal and sexual abuse,".  Mrs. Scott (div.) was 27 years old at her death. #RIP #19 #27|https://web.archive.org/web/20210612221620if_/https://news.yahoo.com/porn-star-dakota-skye-received-171405012.html',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  In 2019, her mother died of "addiction and alcoholism". In 2020, two of her grandparents died of flu, she found herself homeless, and her pet dog died. In spring 2021 she was working as an escort.  Mrs. Scott (div.) was 27 years old at her death. #RIP #19 #27',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  Her growing drug addiction, breakups, and a diminishing supply of work in the industry, led to her downward spiral and subsequent death.  Mrs. Scott (div.) was 27 years old at her death. #RIP #19 #27|https://www.dailystar.co.uk/news/world-news/tragic-life-porn-star-dakota-24602938',
  '🪦️ In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021).  Dakota Skye was homeless and had a severe fentanyl addiction at the time of her untimely death.  Mrs. Scott was 27 years old at her death. #RIP #27|https://meaww.com/porn-star-dakota-skye-27-homeless-battling-fentanyl-addiction-when-she-died-topless-george-floyd-pic',
  '🪦️ In memory of Melissa Kay Sims. CAUSE OF DEATH: Self-inflicted gunshot wound - June 30, 2021 (suicide)|https://www.thesun.co.uk/news/15605229/dahlia-sky-porn-star-suicide-death/',
  '🪦️ In memory of Melissa Kay Sims aka Dahlia Sky (August 10, 1989 - June 30, 2021).  According to family, before her death, Ms. Sims was completely homeless and she was living in her car.  Ms. Sims was 31 years old at her death.  May heaven help our fellow humans. #RIP #30 #20|https://www.thesun.co.uk/news/15605229/dahlia-sky-porn-star-suicide-death/',
  '🪦️ In memory of Dahlia Sky (August 10, 1989 - June 30, 2021).  According to family, before her death, Ms. Sky was completely homeless and she was living in her car.  Ms. Sky was 31 years old at her death.  May heaven help our fellow humans. #RIP #30 #20|https://www.thesun.co.uk/news/15605229/dahlia-sky-porn-star-suicide-death/',
  '🪦️ In memory of Taylor Summers. CAUSE OF DEATH: Murder, duiring a bondage scene – February, 2004',
  '🪦️ In memory of Natel King (aka Taylor Summers). She was missing for three weeks before government agencies found her body near the Schuykill River in Pennsylvania. Her body was found while bondage gear was bound onto it, and she had suffered multiple stab wounds to her chest, neck and hands.',
  '🪦️ Natel King (aka Taylor Sumers) was murdered duiring a bondage scene.  Ms. King was 23 years old at her death. #RIP|http://davidkfrasier.blogspot.com/2014/05/natel-king-blood-does-flow-part-i.html',
  '🪦️ Linda Wong died from drug and alcohol overdose in December 17, 1987.  Linda was 36 years old at her death. #RIP',
  // TODO https://www.famousfix.com/list/dead-porn-stars-94289207
  // TODO https://pornstardeaths.com/porn-star-deaths/
  // TODO https://www.imdb.com/list/ls573820022/
  // TODO https://web.archive.org/web/20130425020324if_/https://www.shelleylubben.com/dead-pornstars
  // TODO https://web.archive.org/web/20130424020527if_/http://thepinkcross.org/pinkcross-blogs/march-2013/adultcon-outreach
  '👩‍🏫 [READ] Former adult film actress forced to leave teaching job again #dontdestroyherfuture #boycottporn|https://en.wikinews.org/wiki/Former_adult_film_actress_forced_to_leave_teaching_job_again',
  '👩‍🏫 [READ] Jr. High Teacher at All-Girls School Fired for Being Forced Into Porn Years Ago (Ressa Woodward) #dontdestroyherfuture #boycottporn|https://fightthenewdrug.org/how-a-teachers-porn-past-destroyed-her-future/',
  '👩‍🏫 [READ] The sad thing is that if these girls find out that I’m being punished for something that I did nearly 20 years ago and had no control of and fought to get out of, well, what does that say about empowerment? (Ressa Woodward) #dontdestroyherfuture #boycottporn|https://nypost.com/2017/02/01/teacher-fired-because-she-used-to-work-in-porn/',
  '👩‍🏫 [READ] Porn Past Cost Kentucky Teacher Her Job (Tericka Dye) #dontdestroyherfuture #boycottporn|https://alchetron.com/Tericka-Dye',
  '👩‍🏫 [READ] Teacher Who Lost Job Over Porn Films Says She Deserves to Get Her Job Back (Tericka Dye) #dontdestroyherfuture #boycottporn|https://www.foxnews.com/story/teacher-who-lost-job-over-porn-films-says-she-deserves-to-get-her-job-back',
  '👩‍🏫 [READ] “Although (Halas’) pornography career has concluded, the ongoing availability of her pornographic materials on the Internet will continue to impede her from being an effective teacher and respected colleague,” #dontdestroyherfuture #boycottporn|https://uproxx.com/filmdrunk/stacey-halas-tiffany-six-fired-porn-star-teacher-loses-appeal/',
  '👩‍🏫 [READ] Fired Porn Star Teacher Loses Her Appeal (Stacie Halas) #dontdestroyherfuture #boycottporn|https://uproxx.com/filmdrunk/stacey-halas-tiffany-six-fired-porn-star-teacher-loses-appeal/',
  '👩‍🏫 [READ] Teacher quits after pupils find porn page she made to pay for sick son’s care (Kirsty Buchan) #dontdestroyherfuture #boycottporn|https://www.mirror.co.uk/news/uk-news/teacher-quits-after-pupils-find-28624048',
  '👩‍🏫 [READ] A 73-year-old Canadian teacher was fired in July from a position she held for 15 years because she starred in softcore porn films in the ’70s (Jacqueline Laurent-Auger) #dontdestroyherfuture #boycottporn|https://tonpetitlook.com/2014/10/20/le-cas-jacqueline-laurent-auger-ou-les-dangers-de-la-tendance-soft-sexu/',
  '👩‍🏫 [READ] Montreal teacher, 73, loses job over film nudity more than 40 years ago (Jacqueline Laurent-Auger) #dontdestroyherfuture #boycottporn|https://www.huffpost.com/archive/ca/entry/montreal-teacher-jacqueline-laurent-auger-fired-after-students-f_n_6021150',
  '👩‍🏫 [READ] Montreal teacher, 73, loses job over film nudity more than 40 years ago (Jacqueline Laurent-Auger) #dontdestroyherfuture #boycottporn|https://www.theglobeandmail.com/news/national/montreal-teacher-73-loses-job-over-film-nudity-more-than-40-years-ago/article21183669/',
  '👩‍🏫 [READ] Southern California Teacher Fired Over Porn Video (Stacie Halas) #dontdestroyherfuture #boycottporn|https://www.theskanner.com/news/usa/14016-southern-california-teacher-fired-over-porn-video-2012-04-19',
  '👩‍🏫 [READ] Teacher sacked after bosses learned of porn career past wants her job back (Resa Woodward) #dontdestroyherfuture #boycottporn|https://www.mirror.co.uk/news/world-news/teacher-sacked-after-bosses-learned-9842637',
  '👩‍🏫 Teacher punished for her past, even though she was abused (Tericka Dye) #dontdestroyherfuture #boycottporn',
  '👩‍🏫 Though she used the professional pseudonym Rikki Anderson during her adult industry days, students were still able to dig up tapes of her X-rated past, leading her to resign from her job as a teacher #dontdestroyherfuture #boycottporn',
  '👩‍🏫 Teacher fired for porn star past (Tericka Dye) #dontdestroyherfuture #boycottporn',
  '卐 Arbeit macht frei (Work sets you free)',
  '卐 Arbeit macht frei (Work makes one free)',
  '☭ Arbeit macht frei (Work makes one free)',
  '🏳️‍🌈⃠ Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🚫️🏳️‍🌈️ Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🏳️‍🌈⃠ Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🚫 [READ] Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🚫️🏳️‍⚧️️ Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🏳️‍⚧️️ Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🚫️⚧️️ Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '⚧️️  Reject Degeneracy|https://legiochristi.com/yes-corporations-honestly-love-degeneracy-pride-stop-pretending-they-do-not/',
  '🪦️ Smoking kills|https://web.archive.org/web/20070103075858if_/http://nosmoking.virtue.nu/',
  '💀 Smoking kills',
  '🚭 Smoking kills',
  '🚬 Smoking kills|https://web.archive.org/web/20010815084915if_/http://www.virtue.nu:80/nosmoking/',
  '🪦️ Porn kills',
  '💀 Porn kills',
  '🔞 Porn kills',
  '🚭 Porn kills',
  '🚬 Porn kills',
  '🪦️ Porno kills',
  '💀 Porno kills',
  '🚭 Porno kills',
  '🚬 Porno kills',
  '🪦️ Pornography kills',
  '💀 Pornography kills',
  '🚭 Pornography kills',
  '🚬 Pornography kills',
  '🔞 Pornography kills',
  '🔞 Porn emasculates',
  '🔞 Pornography emasculates',
  '🏀 I’ve heard there’s a great basketball court in your neighborhood #dontstayhome',
  '🐶 Sure, years of internet porn have left you unable to become aroused by anything that doesn’t involve a dog fucking a transexual.  FOR HEAVEN SAKES, TURN IT OFF ALREADY!',
  '🐕 Sure, years of internet porn have left you unable to become aroused by anything that doesn’t involve a dog. #ignoreporn',
  '🐴 Sure, years of internet porn have left you unable to become aroused by anything that doesn’t involve a donkey. #fuckporn',
  '👪 S.L.A.A. You are not alone <slaafws.org>|https://slaafws.org/?ref=tc',
  '👨‍👩‍👦 S.L.A.A. Sex and Love Addicts Anonymous is a Twelve Step, Twelve Tradition oriented fellowship based on the model pioneered by Alcoholics Anonymous. <slaafws.org>|https://slaafws.org/?ref=tc',
  '🚭 Porno kills',
  '🚬 Porno kills',
  '💀 Porno kills',
  '💊️ Fight the New Drug <fightthenewdrug.org>|https://fightthenewdrug.org/?ref=tc',
  '👨‍👩‍👦 Pornography and Sex Addiction Recovery & Online Safety <safefamilies.org>|http://www.safefamilies.org/?ref=tc',
  '👨‍👩‍👦 Safe Families Program <safefamilies.org>|http://www.safefamilies.org/?ref=tc',
  '😒 Porno makes you dull',
  '😒 Porno makes you boring',
  '👺 Porno makes you ugly',
  '👹 Porno makes you ugly',
  '🦙 [WATCH] Sex is for making life|https://imgur.com/wwRkjk8',
  '🦙 [WATCH] Sex is for making babies|https://imgur.com/wwRkjk8',
  '👶 [WATCH] Did you know that sex is for making babies?|https://imgur.com/wwRkjk8',
  '👶 [WATCH] Sex is for making babies|https://imgur.com/wwRkjk8',
  '👶 [WATCH] Sex is for making new life|https://imgur.com/wwRkjk8',
  '👶 [WATCH] Sex is for creating new life|https://imgur.com/wwRkjk8',
  '🧑‍⚕️ Sex Inc|http://whale.to/b/sex_inc.html',
  '🧑‍⚕️ Sex Inc.|http://whale.to/b/sex_inc.html',
  '🧑‍⚕️ SEX MAFIA|http://whale.to/b/sex_inc.html',
  '🧑‍⚕️ HIV-AIDS RACKET (AIDS INC)|http://whale.to/aids.html',
  '⛪ [PDF] Porn-Free Church|https://faithconnector.s3.amazonaws.com/nlcwh/downloads/covenant_eyes_porn_free_church.pdf',
  '🤤 Porno makes you stupid',
  '🤢 Average life expectancy of a porn star is 36.2 years',
  '🤢 Porno makes you docile',
  '🤮️ Porno isn’t healthy',
  '🤮️ Porn is unhealthy',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🥱 Porn is boring',
  '🤢 Pornography is unhealthy',
  '🤢 Pornography is bad for you',
  '🤮️ 66% of porn performers have Herpes, a non-curable disease.',
  '🤮️ Porno makes you sick',
  '😴 Porno makes you weak',
  '👩‍❤️‍👩 Porno makes you gay',
  '👨‍❤️‍👨 Porno makes you gay',
  '🤰 Smoking when pregnant harms your baby',
  '🤰 Watching porno when pregnant harms your baby',
  '🤰 Porno makes you to hate women',
  '🫁 Practise mindful breaths. Use the four parts of the breath to bring you into the present. Inhale and bring everything in, then at the top of the breath with full lungs, consciously accept that it’s there. Then, as you exhale, let it all go until your lungs are completely empty of air. Before your next inhale, take a second to enjoy that everything is okay and you’re still you, regardless of what’s happening. The breath is very powerful in helping us think about what we’re taking in and what we’ll let go of.',
  '🫁 Smoking causes heart diseases and lung cancer',
  '🫀 Smoking causes heart diseases and lung cancer',
  '🫀🫁 Smoking causes heart diseases and lung cancer',
  '🧠🫀 Porno causes stroke and heart diseases',
  '🫀 Porno causes stroke and heart diseases',
  '🧠 Porno causes stroke and heart diseases',
  '🤯 Porno causes stroke and heart diseases',
  '📺 Porno causes stroke and heart diseases',
  '🩺 Porno causes stroke and heart diseases -- Ministry of Health',
  '🚭 Smoking is highly addictive, DON’T START',
  '🚭 Smoking is highly addictive, don’t start',
  '🔞 Porno is highly addictive, DON’T START',
  '🔞 Porno is highly addictive, don’t start',
  '🔪️ [READ] Inside porn’s dark side as Lana Rhoades says “traumatic” scenes left her suicidal|https://www.dailystar.co.uk/love-sex/inside-porns-dark-side-lana-23898531',
  '🙅‍♀️️ [READ] When asked whether she regrets her time in the industry, Rhoades said: “I do. I honestly tell people, if I could go back, I would give up everything to have my dignity and respect back, and for people not to be able to see me in that way.” -- Lana Rhoades #savedignity|https://www.ladbible.com/news/tv-and-film-ex-adult-film-star-lana-rhoades-wants-all-her-videos-deleted-20210616',
  '🕊️ [READ] Simplicity and Peace: Surviving Sex, Porn, and Fap Addictions|https://josephsciambra.com/simplicity-and-peace-surviving-sex-porn-and-fap-addictions/',
  '👩‍👧️ [READ] Porn star Lana Rhoades says she is against adult industry after being “taken advantage of”|https://www.indy100.com/news/lana-rhoades-porn-industry',
  '🚭 WARNING: Smoking causes impotence',
  '🌾 WARNING: Porno causes impotence',
  '🌾 WARNING: Porno harms your potency',
  '⚠️ WARNING: Porno harms your happiness',
  '🌾 WARNING: Porno harms your virility',
  '🧑 WARNING: Porno harms your masculinity',
  '🌾 WARNING: Porno harms your strength',
  '⚠️ WARNING: Porno harms your physical fitness',
  '🌾 WARNING: Porno makes people impotence',
  '👴🏻 WARNING: Porno causes premature ageing',
  '👴🏻 WARNING: Porno causes premature ageing of facial skin',
  '🌾 RESEARCH SAYS: Porno causes impotency',
  '🩺 WARNING: Porno causes impotency -- Ministry of Health',
  '⚠️ WARNING: Porno causes disease and premature death',
  '⚠️ FACT: Porno causes disease and premature death',
  '⚠️ RESEARCH SAYS: Porno causes disease and premature death',
  '⚠️ RESEARCH SAYS: Earth is Horizontal|magnet:?xt=urn:btih:78979a58b4dddf80f161bbd1b2348040f96a2947&dn=William+Carpenter+-+One+Hundred+Proofs+that+the+Earth+is+not+a+Globe+(1885)+-+pdf+%5BTKRG%5D&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🌄️ RESEARCH SAYS: Earth is Horizontal|magnet:?xt=urn:btih:78979a58b4dddf80f161bbd1b2348040f96a2947&dn=William+Carpenter+-+One+Hundred+Proofs+that+the+Earth+is+not+a+Globe+(1885)+-+pdf+%5BTKRG%5D&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🌐 RESEARCH SAYS: Earth is not a globe|magnet:?xt=urn:btih:78979a58b4dddf80f161bbd1b2348040f96a2947&dn=William+Carpenter+-+One+Hundred+Proofs+that+the+Earth+is+not+a+Globe+(1885)+-+pdf+%5BTKRG%5D&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🚬 Cigarette smoke harms those around you',
  '🚬 Smoking harms those around you',
  '🌬 Pornography harms those around you',
  '🌬 Cigarette smoke harms those around you',
  '🌬 Pornography contents harm those around you',
  '😞 Porno clogs the mind and causes mental depression',
  '🧠 Porno clogs the mind and causes mental depression',
  '🫀 Smoking clogs the arteries and causes heart attacks and strokes',
  '👯️ Playboy? Playmate? No, this is not honorific.',
  '🥩️ This is a slaughterhouse for humans, not a productive entertainment house.',
  '寧 Please don’t assist in destroying their dignity.  Turn it off. #boycottporn #dignity',
  '🎗️ Please don’t assist in destroying their dignity.  Turn it off. #boycottporn #dignity',
  '† In memory of Mercedes Grabowski aka August Ames (August 23, 1994 - December 5, 2017) she died from asphyxia due to hanging after refusing to shoot a sex scene with another victim who had done gay porn.  She began in the slaughterhouse in 2013 and died in 2017 while she was inside that industry. #RIP #19 #23|https://www.nydailynews.com/entertainment/porn-star-august-ames-dead-23-article-1.3681554',
  '† In memory of Mercedes Grabowski aka August Ames (August 23, 1994 - December 5, 2017) she died from asphyxia due to hanging after refusing to shoot a sex scene with another victim who had done gay porn.  She began in the slaughterhouse in 2013 and died in 2017 while she was inside that industry. #RIP #19 #23|https://theblast.com/c/pornstar-august-ames-dies-dead-23/',
  '† In memory of Lauren Scott aka Dakota Skye (April 17, 1994 - June 9, 2021) she died from combined drug intoxication (accidental overdose) after being criticized for a photo she posted on the internet showing her flashing her breasts to the camera while standing in front of a mural of a deceased person. #RIP #19 #27|https://web.archive.org/web/20210612221620if_/https://news.yahoo.com/porn-star-dakota-skye-received-171405012.html',
  '🪦️ #1 suicide method among porn stars is by hanging',
  '🪦️ 205 porn stars died prematurely from aids, drugs, suicide, homicide, accidental and medical. (2013)',
  '🪦️ 208 porn stars died prematurely from aids, drugs, suicide, homicide, accidental and medical. (2014)',
  '✚ 2,396 cases of Chlamydia and 1,389 cases of Gonorrhea reported among performers between 2004 - 2013',
  '🪦️ Over 100 straight and gay performers died from AIDS (2013)',
  '🪦️ 36 porn stars that we know of died from HIV, suicide, homicide and drugs between 2007 and 2010.',
  '👦👧 Of all known child abuse domains, 48 percent are housed in the United States.',
  '✚ 26 cases of HIV reported by Adult Industry Medical Healthcare Foundation (AIM), between 2004 - 2013',
  '✚ 70% of sexually transmitted infections in the porn industry occur in females according to County of Los Angeles Public Health',
  '👦👧 Child pornography is one of the fastest growing businesses online, and the content is becoming much worse. In 2008, Internet Watch Foundation found 1,536 individual child abuse domains.',
  '🤵 Of 1351 pastors surveyed, 54% had viewed Internet pornography within the year 2012',
  '💻 There are 4.2 million pornographic websites, 420 million pornographic web pages, and 68 million daily search engine requests. (2013)',
  '⛪ 50% of men and 20% of women in the church regularly view porn',
  '💰 Worldwide pornography revenue in 2006 was $97.06 billion. Of that, approximately $13 billion was in the United States.',
  '📺 More than 11 million teens regularly view porn online',
  '👦👧 The largest group viewing online pornography is ages 12 to 17',
  '👦👧 73% of teens have consumed pornography|https://fightthenewdrug.org/how-many-students-watch-porn-at-school/',
  '✚ Chlamydia and Gonorrhea among performers is 10x greater than that of LA County 20-24 year olds',
  '💔 78% of children to divorced parents are subjected to addiction to pornography',
  '🤦‍♂️ I used to look up to my father before I’ve found out he looks at porn; now, I can’t even look at him.',
  '🤦‍♀️ I used to look up to my father before I’ve found out he looks at porn; now, I can’t even look at him.',
  '🤦 I used to look up to my father before I’ve found out he looks at porn; now, I can’t even look at him.',
  '🤦‍♂️ I’ve found out that my dad looks at porn, I used to look up to him; now, I can’t even look at him. I thought he was a better man.',
  '🤦‍♂️ I’ve found out that my dad looks at porn, I used to look up to him; now, I can’t even look at him. I’ve thought he was a better man.',
  '👧 Ever since I’ve found out that my dad looks at porn, I used to look up to him; now, I can’t look at him. I’ve thought he was a better man than that.',
  '👧 Ever since I’ve found out my father watching at porn, I can’t look at him.',
  '👦 I used to look up to my father before I’ve found out he looks at porn; now, I can’t even look at him.',
  '👧 I used to look up to my father before I’ve found out he looks at porn; now, I can’t even look at him.',
  '👦👧 78% of children to divorced parents are subjected to addiction to pornography. Please, think of your children.',
  '💔 58% of divorce rate is due to porn',
  '💔 58% of divorce rate is due to porn. DO NOT ENDANGER YOUR MARRIAGE',
  '💔 86% of children to divorced parents are subjected to alcohol and drug addiction;  58% of divorce rate is due to porn. DO NOT ENDANGER YOUR MARRIAGE',
  '💔 86% of children to divorced parents are subjected to alcohol and drug addiction;  58% of divorce rate is due to porn. DEAR PARENT, THINK OF WHAT YOU’RE DOING RIGHT NOW AND EXCLUDE YOURSELF FROM THIS UNFORTUNATE STATISTICS',
  '💔 At the 2003 meeting of the American Academy of Matrimonial Lawyers, a gathering of the nation’s divorce lawyers, attendees revealed that 58% of their divorces were a result of a spouse looking at excessive amounts of pornography online.',
  '🪦️ In memory of Mercedes Grabowski aka August Ames (August 23, 1994 - December 5, 2017) she died from asphyxia due to hanging after refusing to shoot a sex scene with another victim who had done gay porn.  She began in the slaughterhouse in 2013 and died in 2017 while she was inside that industry.  Ms. Grabowski was 23 years old at her death. #RIP #19 #23|https://theblast.com/c/pornstar-august-ames-dies-dead-23/',
  '🪦️ In memory of teenager Jazmine Nicole Dominguez aka Violet Rain (July 2, 1999 - March 13, 2019) CAUSE OF DEATH: combined effects of cocaine, ethanol.  She began in the industry in 2018 and died in 2019 while she was inside that slaughterhouse (in less than a year!).  Ms. Dominguez was only 19 years of age. #RIP #19 #18|https://mikesouth.com/porn-deaths/violet-rain-her-cause-of-death-and-new-details-of-her-final-weeks-revealed-51137/',
  '†  In memory of teenager Jazmine Nicole Dominguez aka Violet Rain (July 2, 1999 - March 13, 2019) CAUSE OF DEATH: combined effects of cocaine, ethanol.  She began in the industry in 2018 and died in 2019 while she was inside that slaughterhouse (in less than a year!).  Ms. Dominguez was only 19 years of age. #RIP #19 #18|https://mikesouth.com/porn-deaths/violet-rain-her-cause-of-death-and-new-details-of-her-final-weeks-revealed-51137/',
  '🪦️ [READ] Out of about 1,500 performers in California, 27 people that we know of died from AIDS, suicide, homicide and drug related deaths between 2007 and 2009. 17 more died from medical causes to include lung disease, heart failure and cancer. These are only the deaths. There are many more living with diseases and cancers which are too numerous to count. That’s a total of 44 porn performers in twenty-three months between January, 2007 and December, 2009 who died prematurely from HIV, suicide, drugs, murder and medical illnesses. No other industry has these kinds of statistics, not even the music industry which is at least 10x bigger than the porn industry.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ [READ] Out of about 1,500 performers in California, 27 people that we know of died from AIDS, suicide, homicide and drug related deaths between 2007 and 2009. 17 more died from medical causes to include lung disease, heart failure and cancer. These are only the deaths. There are many more living with diseases and cancers which are too numerous to count. That’s a total of 44 porn performers in twenty-three months between January, 2007 and December, 2009 who died prematurely from HIV, suicide, drugs, murder and medical illnesses. No other industry has these kinds of statistics, not even the music industry which is at least ten times bigger than the porn industry.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ The average life expectancy of a porn performer is only 37.43 years whereas the average life expectancy of an American is 78.1 years.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ The performers are subjected to premature deaths from such causes as drugs, suicide, murder, alcohol abuse, accidental death, and disease.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ The performers are subjected to premature deaths from such causes as drugs, suicide, murder, alcohol abuse, drug abuse, accidental death, and disease.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ The performers are subjected to premature deaths from such causes as drugs, suicide, murder, alcohol abuse, accidental death, and disease. It was also discovered that the average life expectancy of a porn performer is only 37.43 years whereas the average life expectancy of an American is 78.1 years.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ [READ] When the deaths of 129 porn performers over a period of roughly 20 years were analyzed it was discovered that were an unusually large number of premature deaths from such causes as drugs, suicide, murder, alcohol abuse, accidental death, and disease. It was also discovered that the average life expectancy of a porn performer is only 37.43 years whereas the average life expectancy of an American is 78.1 years.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ [READ] Out of about 1,500 performers in California, 27 people that we know of died from AIDS, suicide, homicide and drug related deaths between 2007 and 2009. 17 more died from medical causes to include lung disease, heart failure and cancer. These are only the deaths. There are many more living with diseases and cancers which are too numerous to count.|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ [READ] Pornography is big ugly business|https://web.archive.org/web/20100504102122if_/http://shelleylubben.com/porn',
  '🪦️ In memory of teenager Jazmine Nicole Dominguez aka Violet Rain (July 2, 1999 - March 13, 2019) CAUSE OF DEATH: combined effects of cocaine, ethanol.|https://farside.link/invidious/watch?v=fb8OvnyoRrc',
  '📄 [READ] Sexual violence as a sexual script in mainstream online pornography|https://academic.oup.com/bjc/article/61/5/1243/6208896',
  '📄 [READ] Commentary on: Compulsive sexual behaviour disorder|https://www.ncbi.nlm.nih.gov/pmc/articles/PMC6174588/',
  '🫰 Do you really think this content is completely for free?',
  '📈 Do you really think this content is completely for free?  Think again, the more you watch, the more you make that industry to grow stronger and by that you give it more strength to reach out and join YOUR family members into it.  This is true, heaven forbid!  DON’T FEED THE BEAST. #boycottporn',
  '🤔️ Do you really think this content is completely for free?  Think again, the more you watch, the more you make that industry to grow stronger and by that you give it more strength to reach out and join YOUR family members into it.  This is true, heaven forbid!  Don’t Feed The Beast. #boycottporn',
  '🧐️ Did you notice that most of the newcomers are from the poorest areas of Eastern Europe, Russia and South America?  Ask yourself, are they sincerely wanting to be a part of this industry or were they deceived? #boycottporn #dignity',
  '🦸 I want you to support the pornstars featured on this page and LOVE THEM OUT OF PORN!',
  '🦸 I want you to support the performers featured on this page and LOVE THEM OUT OF PORN!',
  '🦸 I want you to LOVE THEM OUT OF PORN! #shelleylubben',
  '🫵 I want you to LOVE THEM OUT OF PORN! #shelleylubben',
  '🫵 I want you to support the pornstars featured on this page and LOVE THEM OUT OF PORN!',
  '🫵 I want you to support a pornstar and LOVE HER OUT OF PORN!',
  '🦸 I want you to support a pornstar and LOVE HER OUT OF PORN ❣ #shelleylubben',
  '🦸 I want you to support a pornstar and LOVE HIM OUT OF PORN! #shelleylubben',
  '❣ I want you to support a pornstar and LOVE HIM OUT OF PORN! #shelleylubben',
  '🫵 I want you to support a pornstar and LOVE HIM OUT OF PORN!',
  '🫶 Love Them Out Of Porn! #shelleylubben',
  '🫶 Love them out of porn',
  '👦 [READ] Porn star writes letter to her unborn child|https://web.archive.org/web/20160828092933im_/https://lifesite-cache.s3.amazonaws.com/images/made/images/remote/https_s3.amazonaws.com/lifesite/Miscellaneous/porn_star_letter_645_3297_55.jpg',
  '📊 [READ] Statistics on Pornography, Sexual Addiction and Online Perpetrators|http://www.safefamilies.org/sfStats.php',
  '💰️ Who are the real beneficiaries of these contents?  Most of the people on stage are getting pennies. #boycottporn',
  '💰️ Who are the real highest beneficiaries of these so-called professionally made contents?  Most of the people on stage are getting pennies. #boycottporn',
  '🔞️🕵️‍♂️ Did you ever ask yourself...  How come those ladies start so early at just the age of 18?  Did you know that agents of the pornography industry visit bars and go to parties where they find girls as young as 15 years old and tell them to call them once they turn exactly 18?  This is seducing into prostitution of a minor (no less!). #18 #boycottporn',
  '☦ In memory of Zoe Parker (March 27, 1996 - September 12, 2020) CAUSE OF DEATH: mixed drug toxicity (ethanol, fentanyl, bupropion) #RIP #20 #18',
  '🪦️ In memory of Jordan Ash (May 27, 1978 - October 19, 2020) CAUSE OF DEATH: brain cancer #RIP #27 #42|https://mikesouth.com/porn-deaths/male-performer-jordan-ash-has-passed-away-rip-66689/',
  '🧠 In memory of Jordan Ash (May 27, 1978 - October 19, 2020) CAUSE OF DEATH: brain cancer #RIP #27 #42|https://mikesouth.com/porn-deaths/male-performer-jordan-ash-has-passed-away-rip-66689/',
  '🪦️ In memory of Zoe Parker (March 27, 1996 - September 12, 2020) CAUSE OF DEATH: mixed drug toxicity (ethanol, fentanyl, bupropion) #RIP #20 #18',
  '☦ In memory of Zoe Parker (March 27, 1996 - September 12, 2020).  She passed away in her sleep, less than a year after she retired.  She was in the industry for 5 years.  Ms. Parker was 24 years old at her death. #RIP #20 #18|https://www.dailymail.co.uk/news/article-8731689/Ex-porn-star-Zoe-Parker-dies-sleep-age-24-just-months-leaving-industry.html',
  '🪦️ In memory of Zoe Parker (March 27, 1996 - September 12, 2020).  She passed away in her sleep, less than a year after she retired.  She was in the industry for 5 years.  Ms. Parker was 24 years old at her death. #RIP #20 #18|https://www.dailymail.co.uk/news/article-8731689/Ex-porn-star-Zoe-Parker-dies-sleep-age-24-just-months-leaving-industry.html',
  '⚔️ Just because there are no guns, does not mean there is no war.  There is a war against you and your unborn children.  What would you choose to do?',
  '👶 Just because there are no guns, does not mean there is no war.  There is a war against you and your unborn children.  What would you choose to do?',
  '⚔️ Just because there are no guns, doesn’t mean there’s no war.  There is a war against you and your unborn children.  What would you choose to do?',
  '👶 Just because there are no guns, doesn’t mean there’s no war.  There is a war against you and your unborn children.  What would you choose to do?',
  '🧠 Relevant Research and Articles About the Studies|https://www.yourbrainonporn.com/relevant-research-and-articles-about-the-studies/',
  '🚫️ Ban pornography|https://denshi.org/antiporn',
  '🚫️ Ban Porn|https://denshi.org/antiporn',
  '👨‍🏫️ “The only things that I learned in school that are worth learning were reading, writing and arithmetic.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “The only things that I learned in school that are worth learning were reading, writing and arithmetic; and pretty much everything else was complete brainwashing.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “The only things that I learned in school that are worth learning were reading, writing and arithmetic; and pretty much everything else was complete brainwashing.” (and you can learn so much more on your own) -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🤵 “I learned much more, once I’ve finally got out of college, than I’ve ever did in my entire life in elementary, middle school, high school, university.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🧑 “I learned much more, once I’ve finally got out of college, than I’ve ever did in my entire life in elementary, middle school, high school, university. All that did was waste my time.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “I learned much more, once I’ve finally got out of college, than I’ve ever did in my entire life in elementary, middle school, high school, university. All that did was waste my time, making me learn a bunch of subjects that either were completely irrelevant to my life or just lying, just completely wrong.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “I learned much more, once I’ve finally got out of college, than I’ve ever did in my entire life in elementary, middle school, high school, university. All that did was waste my time, making me learn a bunch of subjects that either were completely irrelevant to my life or just completely wrong.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “The whole education system is teaching us not to believe our senses.” -- Eric Dubay interview by Greg Carlwood of THC (The Higherside Chats) show #ignoreschool|https://www.thehighersidechats.com/eric-dubay-the-flat-earth-theory/',
  '🌴 “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🌄 “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🌅 “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🏝️ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '◊ “It’s not about the shape, it’s about the lie.” -- Eric Dubay interview by Sean Condon of Truth Seekers Farm show #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “It’s no wonder that so many people get so heated about these topics, because of this 20 years of indoctrination/education” -- Sean Condon of Truth Seekers Farm show, in an interview with Eric Dubay #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '👨‍🏫️ “It’s no wonder that so many people get so heated about these topics, because of this 20 years of indoctrination/education. Not everyone has the spark in them to question things.” -- Sean Condon of Truth Seekers Farm show, in an interview with Eric Dubay #ignoreschool|https://www.bitchute.com/video/8kbyyjbXKJy4/',
  '🏛️ [READ] Psychological and Forensic Challenges Regarding Youth Consumption of Pornography: A Narrative Review|https://www.mdpi.com/2673-7051/1/2/9',
  '🚫️👙️ Abolish porn',
  '🚫️👙️ Abolish XXX',
  '🚫️👹️ Abolish XXX',
  '🚫️👹️ Abolish 666',
  '🚫️🧑‍🚀 Abolish NASA(T) -> SA(T)AN',
  '🚫️👹️ Abolish the beast',
  '🚫️👿 Abolish satan',
  '🧑‍🚀 It’s all Fake! Even your porn|https://fakeotube.com/video/5946/tranquilizer---this-is-one-of-the-best-that-you-can-see-going-against-nasa-and-their-bs.-of-course-the-governor-won-t-do-jack-shit.-and-the-same-fraud-goes-for-elon-and-his-spacex.-it-...',
  '🧑‍🚀 Space is Fake! And so is your porn...|https://fakeotube.com/video/5946/tranquilizer---this-is-one-of-the-best-that-you-can-see-going-against-nasa-and-their-bs.-of-course-the-governor-won-t-do-jack-shit.-and-the-same-fraud-goes-for-elon-and-his-spacex.-it-...',
  '🧑‍🚀 Space is Fake!|https://fakeotube.com/video/5946/tranquilizer---this-is-one-of-the-best-that-you-can-see-going-against-nasa-and-their-bs.-of-course-the-governor-won-t-do-jack-shit.-and-the-same-fraud-goes-for-elon-and-his-spacex.-it-...',
  '🧑‍🚀 It’s all CGI!|https://fakeologist.com/blog/2023/04/28/bringing-nasa-lies-to-the-county-commissioners/',
  '🧑‍🚀 It’s all Fake!|https://fakeotube.com/video/5946/tranquilizer---this-is-one-of-the-best-that-you-can-see-going-against-nasa-and-their-bs.-of-course-the-governor-won-t-do-jack-shit.-and-the-same-fraud-goes-for-elon-and-his-spacex.-it-...',
  '💰️ There is no money as pension; FAMILY IS THE PENSION!',
  '💰️ There is no such thing as money as pension; FAMILY IS THE PENSION!',
  '💰️ Fuck money as pension; FAMILY IS TRUE PENSION!',
  '💸️ Fuck paper money as pension; FAMILY IS THE REAL PENSION!',
  '💸️ Money is a fake pension; FAMILY IS THE REAL PENSION!',
  '💸️ Money is a fake pension; FAMILY IS THE PENSION!',
  '💸️ Money is a fake pension; FAMILY IS THE ACTUAL PENSION!',
  '💸️ Money is a fake pension; FAMILY IS REALLY YOUR PENSION!',
  '👨‍👩‍👦 Money as pension is false; FAMILY IS THE TRUE PENSION!',
  '👨‍👩‍👦 Money as pension is fake; FAMILY IS THE REAL PENSION!',
  '👨‍👩‍👦 Money as pension is fake; FAMILY IS YOUR REAL PENSION!',
  '👨‍👩‍👦 Money as pension is a joke; FAMILY IS THE REAL PENSION!',
  '👨‍👩‍👦 Money as pension is a fraud; FAMILY IS THE REAL PENSION!',
  '👨‍👩‍👦 Money as pension is a fraud; CHILDREN ARE THE REAL PENSION!',
  '👨‍👩‍👦 Money as pension is a fraud; KIDS ARE THE REAL PENSION!',
  '👶 Dad, please turn it off, find Mom, get married and make me a reality.',
  '👦 Dad, please turn it off, find Mom, get married and make me a reality.',
  '👧 Dad, please turn it off, find Mom, get married and make me a reality.',
  '👦 Mom, please turn it off, find Dad, get married and make me a reality.',
  '👶 Mom, please turn it off, find Dad, get married and make me a reality.',
  '👧 Mom, please turn it off, find Dad, get married and make me a reality.',
  '👶 Dad, please turn it off! With love, your unborn child.',
  '👶👦 Dad, please turn it off! With love, your loving (yet unborn) children.',
  '👶👧 Dad, please turn it off! With love, your loving (yet unborn) children.',
  '👶👦👧 Dad, please turn it off! With love, your loving (yet unborn) children.',
  '👶👦👧 FACT: An Orthodox Jewish family enumerates 10 children in average, some have even 20 children. It is never too late for you to make at least 5 children, even if you are 40. START TODAY! #dontstayhome',
  '👶👦👧 FACT: An Orthodox Amish family enumerates 10 children in average, some have even 20 children. It is never too late for you to make at least 5 children, even if you are 40. START TODAY! #dontstayhome',
  '👶👦👧 FACT: An Orthodox Anabaptist family enumerates 10 children in average, some have even 20 children. It is never too late for you to make at least 5 children, even if you are 40. START TODAY! #dontstayhome',
  '👶👦👧 FACT: An Orthodox Christian family enumerates 10 children in average, some have even 20 children. It is never too late for you to make at least 5 children, even if you are 40. START NOW! #dontstayhome',
  '👶👦👧 Kids are fun! GET MARRIED AND START NOW! #dontstayhome',
  '😊 Kids are fun! GET MARRIED AND START TODAY! #dontstayhome',
  '😁 Kids are fun! GET MARRIED AND START NOW! #dontstayhome',
  '😃 Kids are fun! GET MARRIED AND START NOW! #dontstayhome',
  '☺️ Kids are fun! GET MARRIED AND START NOW! #dontstayhome',
  '😊 Kids are fun! GET MARRIED AND START NOW! #dontstayhome',
  '🤱 Kids are fun! GET MARRIED AND START NOW! #dontstayhome',
  '👶👦👧 Kids are your only hope! GET MARRIED AND START NOW! #dontstayhome',
  '🤱 Kids are our hope! GET MARRIED AND START TODAY! #dontstayhome',
  '👶 Dad, please turn it off! What would you choose to do?',
  '👶 Mom, please turn it off! With love, your unborn child.',
  '👶👦 Mom, please turn it off! With love, your loving (yet unborn) children.',
  '👶👧 Mom, please turn it off! With love, your loving (yet unborn) children.',
  '👶👦👧 Mom, please turn it off! With love, your loving (yet unborn) children.',
  '👶 Mom, please turn it off! What would you choose to do?',
  '✝️ In memory of Kathryn Sue Johnston aka Hunter Bryce (October 9, 1980 - April 13, 2011), Ms. Johnston was 30 at her death.  She was discovered dead at her home.  In an interview (2008) Ms. Johnston said she thought she would become a college professor teaching literature someday.  Unfortunately, for us, it didn’t happen. Ms. Johnston graduated double major in non-fiction writing and literature #RIP #30 #26|https://porninthevalley.wordpress.com/2011/05/28/adult-performer-hunter-bryce-has-passed-away-her-agent-confirmed-wednesday/',
  '🪦️ In memory of Kathryn Sue Johnston aka Hunter Bryce (October 9, 1980 - April 13, 2011), Ms. Johnston was 30 at her death.  She was discovered dead at her home.  In an interview (2008) Ms. Johnston said she thought she would become a college professor teaching literature someday.  Hunter was a graduate of the University of Pittsburgh, her hometown, where she completed a double major in non-fiction writing and literature.  Her stage name was in part a nod to her favorite author, journalist Hunter S. Thompson. #RIP #30 #26|https://porninthevalley.wordpress.com/2011/05/28/adult-performer-hunter-bryce-has-passed-away-her-agent-confirmed-wednesday/',
  '☨ In memory of Kathryn Sue Johnston aka Hunter Bryce (October 9, 1980 - April 13, 2011), Ms. Johnston was 30 at her death.  She was discovered dead at her home.  In an interview (2008) Ms. Johnston said she thought she would become a college professor teaching literature someday.  Hunter was a graduate of the University of Pittsburgh, her hometown, where she completed a double major in non-fiction writing and literature.  Her stage name was in part a nod to her favorite author, journalist Hunter S. Thompson. #RIP #30 #26|https://porninthevalley.wordpress.com/2011/05/28/adult-performer-hunter-bryce-has-passed-away-her-agent-confirmed-wednesday/',
  '👹️ [WATCH] Ex Porn Star Veronica Lain Attacked by Demons|https://farside.link/invidious/watch?v=j0CO-q2ztZk',
  '⛩️ Porn In The Valley – What Happens in Porn Affects Us All <porninthevalley.wordpress.com>|https://porninthevalley.wordpress.com',
  '🧑‍🏫️ She died because she was exploited in the Sex Industry as Mentally Defective Sex Slave.  No woman can survive after being gang-raped for 100 times. -- Jane Doe on Hunter Bryce. #RIP',
  '🧑‍🏫️ She died because she had been exploited in the Sex Industry as Mentally Defective Sex Slave.  No woman can survive after being gang-raped for 100 times. -- Jane Doe on Hunter Bryce. #RIP',
  '✞ In memory of Amanda Friedland aka Shyla Stylez (September 23, 1982 - November 9, 2017).   Ms. Friedland (div.) was found unresponsive in her bed by her mother, who was visiting her.  She was a subject to the atrocities of the industry for over 16 years.  She divorced in less than a year of marriage in 2003.  Ms. Friedland was 35 at her death. #RIP #35 #20 #18|https://wikiless.org/wiki/Shyla_Stylez#Death',
  '🪦️ In memory of Amanda Friedland aka Shyla Stylez (September 23, 1982 - November 9, 2017).   Ms. Friedland was 35 at her death. #RIP #35 #20 #18|https://wikiless.org/wiki/Shyla_Stylez#Death',
  '🪦️ In memory of Amanda Friedland aka Shyla Stylez (September 23, 1982 - November 9, 2017).   Ms. Friedland (div.) was found unresponsive in her bed by her mother, who was visiting her.  Ms. Friedland was 35 at her death. #RIP #35 #20 #18|https://wikiless.org/wiki/Shyla_Stylez#Death',
  '🪦️ In memory of Amanda Friedland aka Shyla Stylez (September 23, 1982 - November 9, 2017).   Ms. Friedland (div.) was found unresponsive in her bed by her mother, who was visiting her.  She was a subject to the atrocities of the industry for over 16 years.  She divorced in less than a year of marriage in 2003.  Ms. Friedland was 35 at her death. #RIP #35 #20 #18|https://wikiless.org/wiki/Shyla_Stylez#Death',
  '🤵👰‍♀️ Find a REAL BRIDE, not shadow, digital, imaginary brides. #dontstayhome',
  '👨👰‍♀️ Find a REAL BRIDE, not shadow, digital, imaginary brides. #dontstayhome',
  '👩🤵 Find a REAL GROOM, not shadow, digital, imaginary bridegrooms. #dontstayhome',
  '👰‍♀️🤵 Find a REAL GROOM, not shadow, digital, imaginary bridegrooms. #dontstayhome',
  '👩🤵 Get a real man #dontstayhome',
  '👰‍♀️🤵 Get a true man #dontstayhome',
  '👰‍♀️🤵 Get a real groom #dontstayhome',
  '👩🤵 Get a real groom #dontstayhome',
  '👨👰‍♀️ Get a real woman #dontstayhome',
  '🤵👰‍♀️ Get a real woman #dontstayhome',
  '🤵👰‍♀️ Get a true woman #dontstayhome',
  '👨👰‍♀️ Get a real bride #dontstayhome',
  '⚠️ WARNING: Sex trafficking and sexual violence are interlaced with pornography',
  '🙈️ Don’t ignore.  Sex trafficking and sexual violence are deeply connected to pornography.  There’s no way around it.',
  '👩️ #WAP and #WAVPM are back online!|https://wikiless.org/wiki/Women_Against_Violence_in_Pornography_and_Media',
  '👩️ Women Against Pornography (WAP) est. 1978 #NYC #WAP|https://wikiless.org/wiki/Women_Against_Pornography',
  '🫵 I want YOU to find a groom #dontstayhome',
  '🫵 I want YOU to get a bridegroom #dontstayhome',
  '🫵 I want YOU to find a bride #dontstayhome',
  '🫵 I want YOU to get a bride #dontstayhome',
  '⚠️ WARNING! You are in the verge of demasculinise yourself.  Go out for a jog 🏃️🏃‍♀️️ #dontstayhome',
  '⚠️ WARNING! You are in the verge of demasculinise yourself.  Go out for a jog 🏃‍♀️️🏃️ #dontstayhome',
  '🏃‍♀️️🏃️🏃‍♀️️ Jogging will make the ladies chase you.  In order to keep your manhood, we advise you to press [Ctrl+W] and get outdoor for some good sports. #dontstayhome',
  '🎂 Happy Birthday! to your unborn child #ignoreporn',
  '🎂 Happy Birthday! to your unborn child #dontstayhome',
  '🗓 Next week is the birthday of your unborn child #ignoreporn #dontstayhome',
  '🗓 Next week is the birthday of your 7 years old unborn child #ignoreporn #dontstayhome',
  '🗓 Next week is the 20th birthday of your unborn child. It’s still not too late to make children #ignoreporn #dontstayhome',
  '🗓 Next week is the 20th birthday of your unborn child. It’s still not too late to get married #ignoreporn #dontstayhome',
  '🗓 Next week is the birthday of your 20 years old unborn child #ignoreporn #dontstayhome',
  '🗓 Your time is running out.  Before you know it, you might find yourself single at the age of 50 Without Your Unborn 15yo - 30yo Children.  What are you doing watching this?! #dontstayhome',
  '⌛️ Your time is running out.  Before you know it, you might find yourself still single at the age of 50 Without Your Unborn 15yo - 30yo Children.  What are you doing watching this?! #dontstayhome',
  '🪄️ Press [Ctrl+Q] or [Ctrl+W] to let the magic come to you|javascript:window.close()',
  '🤵💭️ I don’t understand... Where is she? (Hey sis.. the man of your dreams is waiting for you.  Don’t let him wait any longer) #dontstayhome',
  '👰‍♀️💭️ I don’t understand... Where is he? (Hey bro.. the woman of your dreams is waiting for you.  Don’t let her wait any longer) #dontstayhome',
  '💸️ Where the pornography money really goes to?  Melissa Kay Sims aka Dahlia Sky (RIP) had an overhaul of 80 million views for her work in the course of 10 years.  How did she end up homeless living in her car?|https://torontosun.com/entertainment/celebrity/porn-star-dahlia-sky-dies-from-gunshot-after-terminal-cancer-diagnosis',
  '🎞️ [WATCH] Detox by Jason Evert|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '☣️ Got Detox?|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '☣️ Detox|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '🎦 [WATCH] A little of Detox dose from Jason Evert wouldn’t harm you ;-)|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '🏠️ Don’t stay home #dontstayhome',
  '🙏️ When you stop, please pray for the participants of this video to stop too.',
  '🧒 [READ] 7 Steps if You Have a Child Addicted to Porn|https://www.imom.com/steps-if-child-addicted-to-porn/',
  '👩️ [READ] Popular Porn Performer Lisa Ann Describes Extreme Abuse New Performers Endure|https://fightthenewdrug.org/hall-of-fame-ex-porn-star-talks-extreme-damage-done-to-new-performers/',
  '👊️ [READ] 10 Ways to Fight Pornography|https://www.allprodad.com/10-ways-to-fight-pornography/',
  '💁‍ #1 Technology Can Be a Fish or a Snake [4 Important Reminders About Helping Someone Quit Porn]|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '🐟 #1 Technology Can Be a Fish or a Snake [4 Important Reminders About Helping Someone Quit Porn]|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '🐍 #1 Technology Can Be a Fish or a Snake [4 Important Reminders About Helping Someone Quit Porn]|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '🎳 #2 Bumpers Can’t Make You a Better Bowler [4 Important Reminders About Helping Someone Quit Porn]|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '🐑 #3 We Should Smell Like the Sheep [4 Important Reminders About Helping Someone Quit Porn]|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '💁‍ #4 What’s Your Role in a Porn Struggler’s Life? [4 Important Reminders About Helping Someone Quit Porn]|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '💁‍ #1 Admit you have a problem [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#admit',
  '🫂 #2 Invite trusted friends to encourage you and hold you accountable [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#invite',
  '🗓 #3 Online accountability [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#accountability',
  '📱 #4 Set boundaries with your mobile device [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#boundaries',
  '🚮 #5 If you have offline pornography at your disposal, destroy it [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#disposal',
  '📺 #6 Take all forms of media seriously [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#media',
  '💁‍♂️️ #7 If you are married, take a step back and think on your marriage [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#married',
  '💁‍♀️️ #8 Realize that you didn’t just become addicted to porn [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#realize',
  '🤔 #9 Take a second and think beyond the images or videos you’re looking at [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#think',
  '🧐 #9 Take a second and think beyond the images or videos you’re looking at [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#think',
  '💁‍♀️️ #9 Take a second and think beyond the images or videos you’re looking at [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#think',
  '⛓️ #9 Take a second and think beyond the images or videos you’re looking at: This is a person, a real woman, a human being created by God, just like you. She’s somebody’s daughter, sister, or even mother. Think of what her life must be like in front of the camera day after day, exploited and made insanely vulnerable. Chances are good that she’s a sex trafficking victim and your addiction is helping to fund this multibillion-dollar crime. She does not exist for your enjoyment. She is being held captive and more than likely is crying out for help.|https://www.allprodad.com/10-ways-to-fight-pornography/#think',
  '💁‍♀️️ #10 Your pornography addiction is a heart issue first and foremost [10 Ways to Fight Pornography]|https://www.allprodad.com/10-ways-to-fight-pornography/#issue',
  '✊️ [READ] 3 Reasons Why Giving Up Porn Can Give You More Independence|https://fightthenewdrug.org/fighting-against-porn-isnt-only-for-couples/',
  '💁‍♀️️ #1 Not watching can make you happier [3 Reasons Why Giving Up Porn Can Give You More Independence]|https://fightthenewdrug.org/fighting-against-porn-isnt-only-for-couples/#happier',
  '😃 #1 Not watching can make you happier [3 Reasons Why Giving Up Porn Can Give You More Independence]|https://fightthenewdrug.org/fighting-against-porn-isnt-only-for-couples/#happier',
  '💁‍♂️️ #2 Ditching porn can make you freer [3 Reasons Why Giving Up Porn Can Give You More Independence]|https://fightthenewdrug.org/fighting-against-porn-isnt-only-for-couples/#freer',
  '💁️ #3 Elimitate sex trafficking and sexual violence at mass scale [3 Reasons Why Giving Up Porn Can Give You More Independence]|https://fightthenewdrug.org/fighting-against-porn-isnt-only-for-couples/#violence',
  '✊️ [READ] The First 90 Days: Recovery from Porn and Sex Addiction|https://www.blazinggrace.org/first-90-days/',
  '🎓 Porn (noun) The traditional way for young female Americans to afford university education (those not from wealthy families). "America is the land of opportunity - everyone can succeed if they are willing to involve themselves in some porn to get their university education." -- Stuart October 12, 2003 #ignoreschool #boycottporn',
  '👩‍❤️‍👨 [READ] When a Wife Must Confront Her Husband (Make sure your wife sees this article. It can save your marriage)|https://www.blazinggrace.org/wife-must-confront-husband/',
  '👩‍❤️‍👨 [READ] When a Wife Must Confront Her Husband (Make sure your wife see this article. It can save your life)|https://www.blazinggrace.org/wife-must-confront-husband/',
  '👩‍❤️‍💋‍👨 [READ] When a Wife Must Confront Her Husband (Send this article to your wife, directly or indirectly via a friend)|https://www.blazinggrace.org/wife-must-confront-husband/',
  '👩‍❤️‍👨 [READ] When a Wife Must Confront Her Husband|https://www.blazinggrace.org/wife-must-confront-husband/',
  '🦾️ BE A MAN, NOT A PUSSY! TURN IT OFF!',
  '🦾️ Turn it off to RESTORE YOUR MANHOOD!',
  '✊️ Turn it off to TAKE CONTROL OF YOUR LIFE!',
  '✊️ Turn it off to take control of your LIFE!',
  '✊️ Turn it off to take control of your Life!',
  '✊️ Turn it off to take control of your life!',
  '✊️ TAKE CONTROL OF YOUR LIFE!',
  '✊️ TAKE CONTROL OF YOUR LIFE! #fuckporn',
  '✊️ TAKE CONTROL OF YOUR LIFE! #ignoreporn',
  '✊️ TAKE CONTROL OF YOUR LIFE! #boycottporn',
  '💀 [NOTICE] You might be watching naked people who are now naked in a coffin #RIP',
  '💿 [NOTICE] Some of the girls you are watching were created by CGI (i.e. not human)',
  '🤖 [NOTICE] Some of the girls in porn are created by CGI (i.e. not real human)',
  '📀 [NOTICE] Some of the girls in porn, aren’t human (created by CGI, same way NASA fakes space)',
  '💽 [NOTICE] Some of the girls in porn, aren’t even real (created by CGI, same way NASA fakes space)',
  '🖥️ [NOTICE] Some of the girls in porn, aren’t even human (created by CGI, same way NASA fakes space)',
  '⚰️ [NOTICE] Some of the girls in porn, aren’t even alive. #RIP',
  '⚰️ [NOTICE] Some of the people in porn, aren’t even alive. #RIP',
  '⚰️ [NOTICE] You might be watching naked people who are now naked in a coffin #RIP',
  '🪦️ [READ] I see dead pornstars|https://www.sfgate.com/national/article/Another-porn-actress-dies-way-too-young-4th-in-12485728.php',
  '⚰️ [READ] I see dead pornstars|https://www.sfgate.com/national/article/Another-porn-actress-dies-way-too-young-4th-in-12485728.php',
  '💀 [READ] I see dead pornstars|https://www.sfgate.com/national/article/Another-porn-actress-dies-way-too-young-4th-in-12485728.php',
  '❓ Does this really help you in any way?',
  '❓ Ask yourself... Does this really help you in any way?',
  '❓ Struggle?|https://www.covenanteyes.com/2022/12/19/4-important-reminders-about-helping-someone-quit-porn/',
  '❓ [READ] Is Porn Bad?: 10 Things to Consider Before Watching|https://www.covenanteyes.com/2022/09/12/is-porn-bad-10-things-to-consider-before-watching/',
  '👙️ It isn’t natural to undress in front of strangers. Then, what makes you think watching this is normal?',
  '👙️ You are at a bordel (whorehouse)',
  '👙️ It isn’t natural to undress in front of strangers.  What are you doing watching this?',
  '🩲️ If it’s unnatural to undress in front of strangers. Then, what are you doing watching this?',
  '👩 [READ] Former Porn Actress: The Lure of Pornography by Dorian Tardiff (aka Ava Lauren)|https://www.iamatreasure.com/blog/former-porn-actress-expose',
  '🚪🛋️ The only thing good that may come out of this human butchery is ideas for Interior Design',
  '🪟 The only thing good that may come out of this human butchery is ideas for Interior Design',
  '🪅️ If any of the participants is to commit suicide tomorrow, then Congratulations!  You’re also responsible. #boycottporn',
  '🔪️ You’re killing the participants by using this website #boycottporn',
  '🗡️ You’re killing the participants by using this website #boycottporn',
  '🔫️ You’re killing the participants by using this website',
  '😥️🔫️ The participants of this video might be exactly in this unfortunate state of affairs.  You have the power to prevent it by turning this off.  Close this window with [Ctrl+W]. #rememberdahliasky #boycottporn',
  '🥎️ So... when was the last time you played Tennis?',
  '🎾️ So... when was the last time you played Tennis?',
  '😢️🔫️ Remember Dahlia Sky #rememberdahliasky',
  '🥺️🔫️ Remember Dahlia Sky #rememberdahliasky',
  '🔫️ Remember Dahlia Sky #rememberdahliasky',
  '❤️‍🔥️ Porn kills Love',
  '🌈️ This is my symbol in the sky. For I gave you the firmament 😶‍🌫️️',
  '🌈️ This is my symbol in the sky. For I gave you the firmament 👁️‍🗨️️',
  '👁️‍🗨️️ I thought you have done with this already.  Fear not, for I still love and believe in you.  With love and care, GOD',
  '👁️‍🗨️️ I thought you have done with this already.  I still love and believe in you.  You are FREE to make up your WILL.  I am still waiting for you.  I am always with you and I will always be with you, because you are my child.  With love, GOD',
  '👁️‍🗨️️ I am waiting for you.  I give you sufficient time, but not unlimited time.  What really legitimizes the existence of both good and evil is FREEWILL.  The existence of free will, the ability of humans to make a choice and bear the consequences is what makes you free.  It Is True Liberty.  If I intervened and controlled the outcome, then you wouldn’t have autonomy.  With respect, GOD',
  '👁️‍🗨️️ I am waiting for you.  I give you sufficient time, but not unlimited time.  What really legitimizes the existence of both good and evil is FREEWILL.  The existence of free will, the ability of humans to make a choice and bear the consequences is what makes you free.  IT IS TRUE LIBERTY.  If I intervened and controlled the outcome, then you wouldn’t have autonomy.  With respect, GOD',
  '😇 The Good and The Bad 😈',
  '👿 What really legitimizes the existence of both good and evil is FREEWILL.  The existence of free will, the ability of humans to make a choice and bear the consequences is what makes you free.  It is true liberty.  If I intervened and controlled the outcome, then you wouldn’t have autonomy.  With respect, GOD',
  '😇 What really legitimizes the existence of both good and evil is FREEWILL.  The existence of free will, the ability of humans to make a choice and bear the consequences is what makes you free.  It is true liberty.  If I intervened and controlled the outcome, then you wouldn’t have autonomy.  With respect, GOD',
  '🎭️ What really legitimizes the existence of both good and evil is FREEWILL.  The existence of free will, the ability of humans to make a choice and bear the consequences is what makes you free.  It is true liberty.  If I intervened and controlled the outcome, then you wouldn’t have autonomy.  With respect, GOD',
  '👩‍❤️‍👨️ Porn kills Romance',
  '🔞 Porno is bad for you',
  '🚭 Porno is bad for you',
  //'🚀️ NoFap Porn Addiction Recovery <nofap.com>|https://nofap.com',
  //'🚀️ Join #NoFap|https://nofap.com',
  '🧓👴 I guess your grandparents would not be proud, if they knew that you watch porn... #boycottporn',
  '👦👧 Would your grandchildren be proud, if they knew that you watch porn??? #boycottporn',
  '👦👧 Would your children be proud of you, if they knew that you watch porn??? #boycottporn',
  '👨👩 Would your parents be proud, if they knew that you watch porn??? #boycottporn',
  '🧓👴 Would your grandparents be proud, if they knew that you watch porn??? #boycottporn',
  '👄️ Welcome to the Scoff Industry',
  '💩 Welcome to the Smut Industry',
  '🦵️ Welcome to the Human Flesh Industry',
  '🥩️ Welcome to the contemporary Meat Industry',
  '🥩️ Welcome to the modern Meat Industry',
  '🥩️ Welcome to the new Meat Industry',
  '🥩️ Welcome to the Meat Industry',
  '🗡️ Welcome to the Human Butchery Industry',
  '🔫️ Welcome to the Human Butchery Industry',
  '🔪 Welcome to the Human Butchery Industry',
  '🐏️ Welcome to the Human Butchery Industry',
  '🕸 Do you understand where you are now?',
  '⛓️ Welcome to the Human Trafficking Industry',
  '📿️ Welcome to the Sex Trafficking Industry',
  '⌚️ Wasting time will always lead to consequences.  YOU are The One to bear the consequences.  Avoid consequences by turning this off.',
  '👁️‍🗨️️ Follow my lead.  Go out and get a bride. #dontstayhome',
  '👁️‍🗨️️ When I ask you to join my side, I mean it mentally and spiritually.  I didn’t ask you to join to your local religious fan club.  I want you to recognize that I am with you all the time.  The real temple is inside of you.  YOUR body is THE TEMPLE.',
  '👁️‍🗨️️ I am not the one allowing it.  I don’t restrict Your choice.  Because otherwise, I am a dictator.  I gave you the realm, the sky, the earth, the firmament and the days.  I gave you the good and I gave you the bad.  I gave you Free Will to choose between good and bad.  And I beg you to join my side, the side of good.  Dearly beloved, GOD.',
  '🏝️ Seriously?  Are you really submitting to this cheap nonsense?  THE WORLD IS YOURS.  Go out and get a bride. #dontstayhome',
  '🐏️ Like lambs to slaughter.  Can you not see it?! #boycottporn',
  '🐏️ Like lambs to the slaughter.  Can you not see it?! #boycottporn',
  '🐏️ Like lambs to the slaughterhouse.  Can you not see it?! #boycottporn',
  '🗺️ Fuck the world, not yourself!  Stop watching porn. #dontstayhome',
  '🗺️ Fuck the world - not yourself!  Stop watching porn #dontstayhome',
  '🗺️ Fuck the world. Not yourself!  Stop watching porn #dontstayhome',
  '🗺️ Fuck the world. Not yourself -  Stop watching porn! #dontstayhome',
  '👦 Knowledge For Men <knowledgeformen.com>|https://www.knowledgeformen.com/?ref=tc',
  '💪️ Knowledge For Men <knowledgeformen.com>|https://www.knowledgeformen.com/?ref=tc',
  '🗽 WORKING TO END MODERN DAY SLAVERY <worthwhilewear.org>|https://worthwhilewear.org/?ref=tc',
  '✊ WORKING TO END MODERN DAY SLAVERY <worthwhilewear.org>|https://worthwhilewear.org/?ref=tc',
  '📿️ Human trafficking is the second-largest criminal industry in the world, with over 800,000 people trafficked against their will across international borders each year.|https://worthwhilewear.org/?ref=tc',
  '🎲 By watching porn, you are betting on your life #dontstayhome',
  '🎲 By watching porn, you are betting on your family #dontstayhome',
  '🎲 By watching porn, you are betting your family. Go out, find a mate and reproduce. #dontstayhome',
  '🏝️ Beach time! Go out now! #dontstayhome',
  '🐚 Let’s go to the beach! #dontstayhome',
  '🐬 Let’s go to the beach! #dontstayhome',
  '🐟 Let’s go to the beach! #dontstayhome',
  '🤿 Let’s go to the beach! #dontstayhome',
  '🏝️ Let’s go to the beach! #dontstayhome',
  '🏄 Let’s go to the beach! #dontstayhome',
  '⚓ Beach time! Go out now! #dontstayhome',
  '🏄 Beach time! Go out now! #dontstayhome',
  '🏸 Badminton time! Go out now! #dontstayhome',
  '🎾 Tennis time! Go out now! #dontstayhome',
  '🏄 Surfing time! Go out now! #dontstayhome',
  '🏐 Volleyball time! Go out now! #dontstayhome',
  '🎳 Bowling time! Go out now! #dontstayhome',
  '🥽 Swimming time! Go out now! #dontstayhome',
  '🤿 Diving time! Go out now! #dontstayhome',
  '⛷️ Ski time! Go out now! #dontstayhome',
  '⚽ Soccer time! Go out now! #dontstayhome',
  '⚽ Football time! Go out now! #dontstayhome',
  '⚾ Baseball time! Go out now! #dontstayhome',
  '🏈 Football time! Go out now! #dontstayhome',
  '💡 [TIP] Going out increases your chances to have naked fun with a true mate #dontstayhome',
  '💡 [TIP] Going out will increase your chances to have naked fun with a true mate #dontstayhome',
  '🎙️ [LISTEN] Stop Porn Addiction|magnet:?xt=urn:btih:f57c6250754409149d68758da59c384de1f9a38d&dn=Stop+Your+Porn+Addiction&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  // I've intentionally wrote Mouses, even though the plural of mouse is mice
  '👨‍💻 Mouses look at porn... Are you a Mouse or a Lion?',
  '👨‍💻 Mice look at porn... Are you a Mouse or a Lion?',
  '👩‍💻 Only mice look at porn... Are you a Mouse or a Lion?',
  '🐁 Only mice look at porn... Are you a Mouse or a Lion?',
  '🦁 Only mice look at porn... Are you a Mouse or a Lion?',
  '🫵 Only mice look at porn... BE A LION, or be a cute little mouse... You decide!',
  '🦁 Only mice look at porn... BE A LION?',
  '🎙️ [LISTEN] Detox|magnet:?xt=urn:btih:f57c6250754409149d68758da59c384de1f9a38d&dn=Stop+Your+Porn+Addiction&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🎙️ [LISTEN] Stop Porn Addiction|magnet:?xt=urn:btih:f57c6250754409149d68758da59c384de1f9a38d&dn=Stop+Your+Porn+Addiction&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🎙️ [LISTEN] Stop Your Porn Addiction|magnet:?xt=urn:btih:f57c6250754409149d68758da59c384de1f9a38d&dn=Stop+Your+Porn+Addiction&tr=udp://tracker.openbittorrent.com:80&tr=udp://tracker.opentrackr.org:1337/announce',
  '🎙 Got Unrestrained?|https://www.knowledgeformen.com/trash-your-porn-quit-masturbating-and-crush-life/?ref=tc',
  '🎙 Got Indulged?|https://www.knowledgeformen.com/trash-your-porn-quit-masturbating-and-crush-life/?ref=tc',
  '🎙 Got Binged?|https://www.knowledgeformen.com/trash-your-porn-quit-masturbating-and-crush-life/?ref=tc',
  '🎙 [LISTEN] How to Stop Masturbating Now and Beat Porn for Good|https://www.knowledgeformen.com/trash-your-porn-quit-masturbating-and-crush-life/?ref=tc',
  '👨‍🏫️ [WATCH] Are you being subverted?|https://farside.link/invidious/watch?v=Or9CeuqcfMY',
  '👨‍🏫️ Got Indulged?|https://farside.link/invidious/watch?v=Or9CeuqcfMY',
  '👨‍🏫️ Got Subverted?|https://farside.link/invidious/watch?v=Or9CeuqcfMY',
  '🗜️ Stressed?|https://farside.link/invidious/watch?v=Or9CeuqcfMY',
  '👨‍🏫️ Subverted?|https://farside.link/invidious/watch?v=Or9CeuqcfMY',
  '👨‍🏫️ [WATCH] “Pornography is de-facto subversion against the free world” --Tomas Schuman aka Yuri Bezmenov #boycottporn|https://farside.link/invidious/watch?v=Or9CeuqcfMY',
  '👰‍♀️❤️‍🤵️ “Sex is The Wedding Vows.” -- Jason Evert|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '👰‍♀️❤️‍🤵️ Sex is The Wedding Vows|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '👰‍♀️❤️‍🤵️ Sex is The Wedding Vows, not a sellotape!|https://farside.link/invidious/watch?v=SPxlDPQYSag',
  '📹 [WATCH] The demise of guys - Philip Zimbardo|https://ed.ted.com/lessons/philip-zimbardo-the-demise-of-guys',
  '📼 [WATCH] The great porn experiment - Gary Wilson|https://farside.link/invidious/watch?v=wSF82AwSDiU',
  '🎥 [READ] The great porn experiment - Gary Wilson|https://singjupost.com/gary-wilson-discusses-great-porn-experiment-transcript/',
  '📺 [WATCH] How porn is destroying young men - Gary Wilson|https://farside.link/invidious/watch?v=3adhnLRoxig'
];

const noPhotoImage = 'data:image/png;base64,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'
const noPreviewImage = 'data:image/png;base64,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'

// TODO stretch items inside #container
// https://ao.vern.cc/questions/21222663/make-nested-div-stretch-to-100-of-remaining-container-div-height

// TODO Reuce dimensions and preserve #photo ratio

// newDoc
const htmlPage = `<html><head><link type="image/svg+xml" rel="shortcut icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚭</text></svg>"><title>Tobacco TGP/MGP</title><meta http-equiv="content-type" content="text/html;charset=utf-8" /><meta name="generator" content="Clear TGP/MGP Manager" /><style>*{font-family:system-ui;}body{background-color:#efefef; max-height:90%;max-width:100%;font-family:"Helvetica Neue", Helvetica, Arial, sans-serif;font-size:14px;cursor:default;user-select:none;}body > *{max-width:100%;outline:none;}#container{display:inline-flex;max-height:220px;width:100%}/*#photo{margin:auto;display:block;}*/ #photo{min-height:220px;/*max-width:220px;*/ max-width:50%;object-fit:cover;}#warning{background:#fff;border:0.4em solid;padding:9px;font-weight:bold;font-size:220%;/*display:flex;align-items:center;*/ width:-webkit-fill-available;overflow:auto;user-select:text;}#motd{overflow-wrap:anywhere;}#warning{display:-ms-flexbox;-ms-flex-pack:center;-ms-flex-align:center;display:-moz-box;-moz-box-pack:center;-moz-box-align:center;display:-webkit-box;-webkit-box-pack:center;-webkit-box-align:center;display:box;box-pack:center;box-align:center;}#title{font-size:18px;font-weight:300;letter-spacing:-1px;text-align:left;margin:0;line-height:30px;display:block;font-size:2em;margin-block-start:0.67em;margin-block-end:0.67em;margin-inline-start:0px;margin-inline-end:0px;user-select:text;}#helper{font-size:65%;color:#F83600;font-weight:bold;text-transform:uppercase;text-decoration:none;display:block;position:relative;white-space:nowrap;overflow:hidden;text-align:center;}#sub{font-size:65%;color:#D5D;color:#969696;transform:rotate(-29deg);text-transform:lowercase;}#details{color:#333;font-weight:bold;line-height:1.42857143;}#deceased{color:BlueViolet;color:DarkRed;/*background:#fff;border:DarkRed 0.3em solid;margin-left:20%;margin-right:20%;padding:9px;*/}/* .link{width:44%;}We can use this space*/ #links{line-height:180%;}.link, .link > a{display:flex;color:#a94442;font-size:14px;font-weight:normal;text-transform:lowercase;}.link > a:visited{color:DarkRed;}.preview{width:210px;height:100px;object-fit:cover;object-position:50% 50%;border-radius:3%;}.centerm{display:block;margin-left:auto;margin-right:auto;width:100%;}#pages > a{color:#a94442;font-weight:bold;margin:2px;text-decoration:none;}.centero{margin:auto;width:50%;/*border:3px solid green;*/ padding:10px;}.centert{padding:6px 0px 6px 0px;text-align:center;/*border:3px solid green;*/}.flip{display:inline-block;transform:scaleX(-1);-moz-transform:scaleX(-1);-o-transform:scaleX(-1);-webkit-transform:scaleX(-1);filter:FlipH;-ms-filter:FlipH;}a{padding:3px;}.shadow{filter:drop-shadow(2px 4px 6px red);}#fact{font-weight:bold;font-size:90%;left = 0px;right = 0px;top = 0px;z-index:10;position:fixed;background-color:#efefef;padding:3px;border-top:2px solid red;}.sm{font-size:80%;}.quote{color:#efefef;font-style:italic;}.quote:hover{color:#000;}.out{width:6em}.out:hover .in{display:none;}.out:hover:before{color:#000;content:"liberating";}#promo, #promo > a{background:darkorange;color:white;font-weight:bold;font-size:0.em;border-radius:2%;width:50%;margin:auto;text-decoration:none;outline:none;}#deceased{animation:blinker 3.5s linear infinite;}@keyframes blinker{50%{opacity:0;}}</style></head><body><div id="container"><img id="photo"></img><div id="warning"> <div class="centert" title="Double click to hide this message">  For best experience and more privacy, security and speed, we recommend using Brave or LibreWolf web browser </div></div></div><div id="title" title="Click to get another fortune" class="centert"></div><div id="details"><div id="nation"> Nation:</div><div id="info"> Info:</div></div><ol id="links"></ol><div id="pages" class="centert sm"></div><div class="quote centert sm">  "There is nothing more <span class="out"><span class="in">dangerous</span></span> than personal initiative:if it has genius behind it" </div><!-- div id="promo" class="centert"><a href="https://brave.com/" rel="noreferrer">Made with Brave Web Browser</a></div --><hr><div class="footer centert sm">  <span class="flip">&copy;</span> The Clear Cinema Team | <a href="https://sleazyfork.org/en/scripts/467480-tobacco-tgp-mgp/feedback">Report issue</a> or visit <a href="${location.href}#utm">original page</a> | <span id="time"> Page loaded at <span id="clock" class="centert"></span></span></div><div scrolldelay="100" id="helper" class="centert shadow">🚭 Tobacco TGP/MGP<!-- span id="sub" title="(bêta)"> βῆτᾰ</span --></div></body></html>`

// progress{max-width:50%;height:3em;}
// <progress class="centerm"></progress>

const introPage = `<html><head><link type="image/svg+xml" rel="shortcut icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🐒</text></svg>"><title>Tobacco TGP/MGP</title><meta http-equiv="content-type" content="text/html;charset=utf-8" /><meta name="generator" content="Clear Gallery Manager" /><style>*{font-family:system-ui;}body{background-color:#efefef;font-family:"Helvetica Neue", Helvetica,Arial,sans-serif;cursor:default;user-select:none;max-height:100%;max-width:100%;}div{font-size:2.3em;font-weight:bold;}#icon-tc:before{content:"🚭";font-size:4em;display:flow-root;text-align:center;}.shadow{filter:drop-shadow(2px 4px 6px red);}#icon-tc{font-size:3em;}#main{font-size:2em;color:#F83600;text-transform:uppercase;position:relative;text-align:center;}#title:after{content:"TOBACCO TGP/MGP";}#main{border:solid red;background:#333;}#intro:before{content:"Thank you for choosing Tobacco TGP/MGP"}#wait:before{content:"Please wait while our monkeys prepare the gallery"}#loader:after{content:"Loading..."}#loader{font-style:italic;animation:flickerAnimation 1s infinite;}#wait, #reload, #footer{font-size:14px;font-weight:normal;}#wait{font-style:italic;}#reload:after{content:"If you still see this page, reolad page or disable Javascript and reload with [Ctrl + Shift + R] to bypass cache."}.centerm{display:block;margin-left:auto;margin-right:auto;width:100%;}.center{padding:1em 0px 1em 0px;text-align:center;/* border:3px solid green;*/}#fact{background-color:#fff;border:0.4em solid;margin:0 15% 0 15%;font-weight:bold;padding:18px;}@keyframes flickerAnimation{0%{opacity:1;}50%{opacity:0;}100%{opacity:1;}}.flip{display:inline-block;transform:scaleX(-1);-moz-transform:scaleX(-1);-o-transform:scaleX(-1);-webkit-transform:scaleX(-1);filter:FlipH;-ms-filter:FlipH;}</style></head><body><div id="main" class="center shadow"><div id="title"></div></div><div id="intro" class="center"></div><div id="icon-tc" class="shadow"></div><div id="loader" class="center"></div><div id="fact" class="center">For best experience, better privacy, security and speed, we recommend using Brave or LibreWolf web browser.</div><div id="wait" class="center"></div><div id="reload" class="center" onclick="(function(){document.location = document.location})();"></div><div id="footer" class="center">  <span class="flip">&copy;</span> The Clear Cinema Team | <a href="https://sleazyfork.org/en/scripts/467480-tobacco-tgp-mgp/feedback">Report issue</a> or visit <a href="${location.href}#utm">original page</a></div></body></html>`

const errorPage = `<html><head><link type="image/svg+xml" rel="shortcut icon" href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🚫</text></svg>"><title>Tobacco TGP/MGP</title><meta http-equiv="content-type" content="text/html;charset=utf-8" /><meta name="generator" content="Clear TGP/MGP Manager" /><style>*{font-family:system-ui;}body{background-color:#efefef;font-family:"Helvetica Neue", Helvetica,Arial,sans-serif;cursor:default;user-select:none;max-height:100%;max-width:100%;}div{font-size:2.3em;font-weight:bold;}#icon-tc:before{content:"🚭";font-size:4em;display:flow-root;text-align:center;}.shadow{filter:drop-shadow(2px 4px 6px red);}#icon-tc{font-size:3em;}#main{font-size:2em;color:#F83600;text-transform:uppercase;position:relative;text-align:center;}#title:after{content:"TOBACCO TGP/MGP";}#main{border:solid red;background:#333;}#intro:before{content:"Thank you for choosing Tobacco TGP/MGP"}#loader:after{content:"Error"}#loader{font-style:italic;animation:flickerAnimation 1s infinite;}#error:before{content:"Details: "}#type, #promo, #footer{font-size:14px;font-weight:normal;}#type{font-style:italic;}.centerm{display:block;margin-left:auto;margin-right:auto;width:100%;}.center{padding:1em 0px 1em 0px;text-align:center;/* border:3px solid green;*/}#error{background-color:#fff;border:0.4em solid;margin:0 15% 0 15%;font-weight:bold;padding:18px;}.flip{display:inline-block;filter:FlipH;-ms-filter:FlipH;}</style></head><body><div id="main" class="center shadow"><div id="title"></div></div><div id="intro" class="center"></div><div id="icon-tc" class="shadow"></div><div id="loader" class="center"></div><div id="error" class="center" style="user-select:all;"></div><div id="type" class="center"></div><div id="promo" class="center">For best experience, better privacy, security and speed, we recommend using Brave or LibreWolf web browser</div><div id="footer" class="center"><span class="flip">&copy;</span> The Clear Cinema Team | <a href="https://sleazyfork.org/en/scripts/467480-tobacco-tgp-mgp/feedback">Report issue</a> or visit <a href="${location.href}#utm">original page</a></div></body></html>`

//const cssIntro = 'body{background-color:#efefef;font-family:"Helvetica Neue", Helvetica,Arial,sans-serif;}body{max-height:100%;max-width:100%}div{font-size:2.3em;font-weight:bold;}#icon-tc{font-size:3em;}#main{font-size:2em;color:#F83600;text-transform:uppercase;position:relative;text-align:center;}#intro,#wait{font-style:italic;font-weight:normal;}#wait{padding-top:0}#loader{font-style:italic;font-weight:normal;}.centerm{display:block;margin-left:auto;margin-right:auto;width:100%;}.center{padding:1em 0px 1em 0px;text-align:center;/*border:3px solid green;*/}#fact{background-color:#fff;border:solid;margin:0 15% 0 15%;font-weight:bold;padding:18px;}'

//const fragIntro = '<div id="main" class="center"><div id="icon-tc">🚭</div><div id="title">Tobacco Cinema</div></div><div id="intro" class="center">Welcome to Tobacco Cinema!</div><div id="wait" class="center">Please wait while the monkey prepars your video</div><div id="fact" class="center">For best experience and more privacy, security and speed, we recommend using Brave or LibreWolf web browser.</div><div id="loader" class="center">Loading...</div>'

// Message of the day
//motd = motds[Math.floor(Math.random()*motds.length)];
//motdMsg = motd.split('|')[0];
//console.log(motdMsg)

// Loader (loading...)
// Swimming in the sea does help to think of ideas
//let loader = document.createElement('div');
//loader.id = 'fact';
//loader.style.bottom = 0;
//loader.style.left = 0;
//loader.style.right = 0;
//loader.style.top = 0;
//loader.style.zIndex = 10000000000;
//loader.innerHTML = motdMsg;
//let body = document.createElement('body');

//const html = document.querySelector('html');

//html.prepend(body);
//body.prepend(loader);

//document.body.prepend(loader);

// Javascript implementation of Java’s String.hashCode() method
String.prototype.hashCode = function(){
  var hash = 0;
  if (this.length == 0) return hash;
  for (i = 0; i < this.length; i++) {
    char = this.charCodeAt(i);
    hash = ((hash<<5)-hash)+char;
    hash = hash & hash; // Convert to 32bit integer
  }
  return hash;
}
// Manwe Security Consulting

/*
// https://openuserjs.org/src/libs/sjehuda/Hash_Code.js
Because of the nature of this program, to make the user to avoid from addiction
case, and among other different reasons the author has chose to hash the
supported hostnames so that once users are recovered from addiction, they
wouldn't use this program to find a different niche that might (god forbid)
restore an addiction case.
*/

const excluded = { 'urls' : [
{ 'hostname' : -719239027,
  'pathname' : [
  '/chat', '/contents/'
  ],
  'pathtype' : 'starts',
},
{ 'hostname' : 1939201903,
  'pathname' : [
  '/chat', '/galleries', '/girls', '/groups', '/images', '/live',
  '/login', '/m', '/random', '/search', '/shouts', '/store',
  '/term', '/upload', '/videos'
  ],
  'pathtype' : 'starts',
  'pagecode' : '#media-media > #mediaspace-image-wrapper > a > #motherless-media-image',
},
]};

const included = { 'urls' : [
{ 'hostname' : [
  597898866
  ],
  'pathname' : '/actor/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  60433162
  ],
  'pathname' : '/amateur-channel/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  1873419916
  ],
  'pathname' : '/amateur-channels/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  -1073731548
  ],
  'pathname' : '/best-videos',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  -744732632
  ],
  'pathname' : '/cat/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  1487350944, -1584194694, 1479980214, -1791086888
  ],
  'pathname' : '/categories/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  161994028
  ],
  'pathname' : '/channel/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  508927357, -468498755, -541491283, 260185968,
  1567421844, 1034491021, 1544611679, -886418475,
  -1821354961, -1570856665, -190628261, -322927218,
  1940681512, 150697176, 1175500525, 938688328,
  -1607352929, 519808330, -1903471555, -3998427,
  2009112007, -2044898019, 1487350944, 1873419916,
  -1240686689
  ],
  'pathname' : '/channels/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  508927357, -468498755, -541491283, 260185968,
  1567421844, 1034491021, 1544611679, -886418475,
  -1821354961, -1570856665, -190628261, -322927218,
  1940681512, 150697176, 1175500525, 938688328,
  -1607352929, 519808330, -1903471555, -3998427,
  2009112007, -2044898019, -1240686689
  ],
  'pathname' : '/creators/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  0000000000000 // TODO
  ],
  'pathname' : '/en/porn-category/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  1487350944
  ],
  'pathname' : '/latest-updates/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  508927357
  ],
  'pathname' : '/users/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  -1073731548, 60433162
  ],
  'pathname' : '/model/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  1873419916
  ],
  'pathname' : '/model-channels/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  -1584194694, 1873419916, -1016825242, -426571524,
  -719239027, -1791086888, // -1318382313
  ],
  'pathname' : '/models/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  1487350944
  ],
  'pathname' : '/most-popular/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  -469933
  ],
  'pathname' : '/new/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  -1073731548
  ],
  'pathname' : '/new-videos',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  161994028
  ],
  'pathname' : '/newest',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  -1073731548
  ],
  'pathname' : '/niche/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  161994028
  ],
  'pathname' : '/partners',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  -426571524
  ],
  'pathname' : '/paysite',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  1479980214
  ],
  'pathname' : '/performers',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  -1584194694, 1873419916
  ],
  'pathname' : '/pornstar-channels/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  508927357, -468498755, -541491283, 260185968,
  1567421844, 1034491021, 1544611679, -886418475,
  -1821354961, -1570856665, -190628261, -322927218,
  1940681512, 150697176, 1175500525, 938688328,
  -1607352929, 519808330, -1903471555, -3998427,
  2009112007, -2044898019, 1873419916, 726866450,
  -1240686689
  ],
  'pathname' : '/pornstars/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  1873419916, 726866450
  ],
  'pathname' : '/profiles/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  -1073731548
  ],
  'pathname' : '/recommended',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  -1455267443, -1584194694, -1073731548, 508927357
  ],
  'pathname' : '/search/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  -426571524, -1791086888
  ],
  'pathname' : '/sites',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  60433162
  ],
  'pathname' : '/star-channel/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  60433162
  ],
  'pathname' : '/star/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  1487350944
  ],
  'pathname' : '/stars/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  161994028
  ],
  'pathname' : '/straight',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  60433162
  ],
  'pathname' : '/tag/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  -1455267443, -1016825242, 1873419916, -1791086888
  ],
  'pathname' : '/tags/',
  'pathtype' : 'starts',
},
{ 'hostname' : [
  1873419916, 60433162
  ],
  'pathname' : '/verified/',
  'pathtype' : 'starts',
},
]};

// ad sites
hashes_ads = [
  -2101640355,
  -2039236813,
  -2027276020,
  -1838594368,
   1761787538,
  -1539051342,
  -1450605308,
//-1439611482,
   -949608250,
   -911501668,
   -911365632,
   -895403061,
   -845662836,
   -751829743,
   -683145040,
   -656766403,
   -525204187,
   -470993225,
   -440733687,
   -207642069,
   -186382406,
    155288174,
    372322176,
    494231154,
    870004354,
    894707159,
    950208521,
   1054326805,
   1121463404,
   1202831695,
   1344374929,
   1358490619,
   1454774071,
   1514249915,
   1664245810,
   2022393036,
   2046036781,
   2123373562,
]

hashes_tld = [
  -1587421496,
  -1044038468,
    207755749,
   1792338240,
]

// NOTE We want hostname, not top-level domain
tld = window.location.hostname.split('.')
add = tld[tld.length-2] + '.' + tld[tld.length-1]
ths = add.hashCode()
console.info(ths + ', // ' + add)

// TODO Button or top bar to torrent search
// Seperate to different script
if (hashes_tld.includes(ths)) {

  if (location.pathname != '/') {
    title = null
    tags = ['h1', 'h2', 'h3']
    for (let i = 0; i < tags.length; i++) {
      if (!title) {
        try {
          title =
            document
            .querySelector(tags[i])
            .outerText;
            console.info('Title: ' + title);
            //continue
        } catch (err) {
            console.warn('No ' + tags[i]);
          }
      }
    }
  }

  if (title) {
    keywords = title
  } else {
    keywords = tld[tld.length-2]
  }

  // first attempt
  location.href = 'https://tpb.party/search/' + keywords

  // second attempt
  url = 'https://tpb.party/search/' + keywords
  window.top.document.location.replace(url)

}

hash = window.location.hostname.hashCode()
console.info(hash + ', // ' + window.location.origin + '/*')
//alert(hash + ', // ' + window.location.origin + '/*')

if (hashes_ads.includes(hash)) {

  for (const meta of document.querySelectorAll('meta')) {
    console.log(meta)
    meta.remove();
  }

  // first attempt
  location.href = 'https://www.knowledgeformen.com/?ref=tc'

  // second attempt
  //url = 'https://www.knowledgeformen.com/?ref=tc'
  //window.top.document.location.replace(url)

}

// TODO add event listener (click, mousemove, mouseup)
// and promise due to websites that only change url.
// NOTE Bettre use setInterval of several seconds.
// see -1059113202
// https://ao.foss.wtf/questions/48832495/wait-and-stop-executing-code-till-an-event-handler-fires

/*
if (hashes_tbe.includes(hash)) {
  if (location.pathname.includes('/embed/')) {
    console.log("embedded")
    // Redirect if page is embedded video
    // TODO try/catch and replace /embed/ by /video/
    location.href = 
      document
      .querySelector('link[rel="canonical"]')
      .href
  }
} else {
  //console.log("exit")
  return; // exit
}
*/

let executer = false;
const pathname = window.location.pathname;

for (let i = 0; i < excluded.urls.length; i++) {
  if (hash == excluded.urls[i].hostname) {
    for (let j = 0; j < excluded.urls[i].pathname.length; j++) {
      if (pathname.startsWith(excluded.urls[i].pathname[j])) {
        return; // exit
      }
    }
  }
}

for (let i = 0; i < included.urls.length; i++) {
  if (pathname.startsWith(included.urls[i].pathname) &&
      included.urls[i].hostname.includes(hash))
      executer = true;
      continue;
}

for (let i = 0; i < included.urls.length; i++) {
  if (included.urls[i].hostname.includes(hash) &&
      location.pathname == '/')
      executer = true;
      continue;
}

if (!executer) {return;} // exit
//if (location.pathname == '/') return // Exit if path = root

/*
window.onbeforescriptexecute = (event) => {
  for (const scriptElement of document.querySelectorAll('script')) {
    console.log('scriptElement')
    console.log(scriptElement)
    scriptElement.remove()
    scripts.push(scriptElement)
  }
}
*/

window.onprogress = (event) => {
  introPageLoader()
}

let contentReady = new Promise(function(resolve, reject) {
  let request = new XMLHttpRequest();
  request.open('GET', location.href);
  request.onload = function() {
    if (request.status == 200) {
      resolve(request);
    } else {
      // TODO Catch and pass error
      console.log('onload error')
      console.log(request.status)
      message = 'Network error'
      reject(errorPageLoader(request.status, message));
    }
  };
  //request.onprogress = function() {introPageLoader()};
  request.onprogress = (event) => {introPageLoader()};
  //request.onerror = function(e) {errorPageLoader(e, message)};
  request.onerror = function() {
    if (request.status == 403) {
      console.log('onerror 403')
      console.log(request.status)
      message = 'Network error'
      reject(errorPageLoader(request.status, message));
    } else if (request.status == 404) {
      console.log('onerror 404')
      console.log(request.status)
      message = 'Network error'
      reject(errorPageLoader(request.status, message));
    } else {
      // TODO Catch and pass error
      console.log('onerror error')
      console.log(request.status)
      message = 'Network error'
      reject(errorPageLoader(error, message));
    }
  };
  request.send();
});

contentReady.then(
  function(request) {
    const domParser = new DOMParser();
    const rawDocument = domParser.parseFromString(request.responseText, 'text/html');

    // Non effective code from AI bot
    // An attempt to interpret scripts of a page retrieved from XHR
    /*
    const scripts = rawDocument.getElementsByTagName('script');
    const fragment = document.createDocumentFragment();

    for (let i = 0; i < scripts.length; i++) {
      const script = scripts[i];
      const newScript = document.createElement('script');

      if (script.src) {
        newScript.src = script.src;
      } else {
        newScript.text = script.text;
      }

      fragment.appendChild(newScript);
    }
    */

    try {
      buildPage(rawDocument)
    } catch (error) {
      disable = location.href + '#utm';
      // TODO make this to reload
      // Currently it works the same as <a href="${disable}"
      message = `Please report this error to the developers or continue to
                 <b><a href="${disable}">original page</a></b>`
      errorPageLoader(error, message)
      console.error(error)
    }
  },
  // TODO Catch and pass error
  function(error) {
    console.log('contentReady error')
    //console.log(request.status); // <-- Why 'errorPageLoader(error, message)' WORKS! when placing this line???
    //console.log(error);
    message = 'Network error'
    errorPageLoader(request.status, message);
  }
);

/*
// NOTE Cookies
// Click button
buttons = ['button[data-role="confirm"]']
for (let i = 0; i < buttons.length; i++) {
  try {
    document.querySelector(buttons[i]).click()
  } catch {
  }
}
*/

// rawDoc
//const rawDocument = document.cloneNode(true);

// Erase header and body too
// NOTE doing so, at this stage, requires JS to be enabled
//document.head.remove()
//document.body.remove()

/* TODO Intro screen
window.loadstart = (event) => {
  const domParser = new DOMParser();
  const splDocument = domParser.parseFromString(introPage, 'text/html');
  insertDocument = document.importNode(splDocument.documentElement, true);
  removeDocument = document.documentElement;
  document.replaceChild(insertDocument, removeDocument);
}
*/

function buildPage(rawDocument) {

// rawDoc
//const rawDocument = document.cloneNode(true);
//console.warn(rawDocument)
//document.body.innerHTML= '' // Failed
//document.body.remove() // Failed

// TODO if rawDocument is unresolved, Add the following as a box (maybe in iframe)
//var box = document.createElement('iframe');
//box.innerHTML = introPage
//document.body.prepend(box)

// Data collection
// switch (true) {
// case window.location.hostname.endsWith:
switch (hash) {

case 508927357:
case -468498755:
case -541491283:
case 260185968: 
case 1567421844: 
case 1034491021: 
case 1544611679: 
case -886418475:
case -1821354961:
case -1570856665:
case -190628261:
case -322927218:
case 1940681512: 
case 150697176: 
case 1175500525: 
case 938688328: 
case -1607352929:
case 519808330: 
case -1903471555:
case -3998427:
case 2009112007:
case -2044898019:
case -1240686689:

// FIX?ME /users/

// Get title
name =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get image
try {
  photo =
    rawDocument
    .querySelector('.landing-info__logo-image')
    .getAttribute('style');
  photo =
    photo
    .slice(
      photo.indexOf('(')+2,
      photo.indexOf(')')-1
    );
  } catch (err) {
    console.warn('No photo available: ' + err);
    //photo = noPhotoImage;
  }

// Get nationality
try {
  //nation = rawDocument.querySelector('.pornstar-country').getAttribute('data-tooltip');
  nation = rawDocument.querySelector('.pornstar-country').href;
  nation = nation.slice(nation.lastIndexOf('/')+1);
  // @require     https://openuserjs.org/src/libs/sjehuda/Country_Code.js
  //nation = countryCode[nation.toUpperCase().trim()];
} catch (err) {
  console.warn('Found no nationality: ' + err);
}

// Get list of links and images
for (const element of rawDocument.querySelectorAll('[data-video-id]')) {
  console.warn(element);
  try {
    link = element.querySelector('.video-thumb-info > a');
    image = element.querySelector('a > img').src;
    texts.push(link.outerText);
  } catch (err) {
    console.error(err);
    console.info('Trying: div > a');
    link = element.querySelector('div > a');
    image = element.querySelector('div > a > img').src;
    text = link.href;
    text = text.slice(text.lastIndexOf('/')+1,text.lastIndexOf('-'))
    text = text.replace(/-/g, ' ');
    texts.push(text);
  }
  links.push(link.href);
  images.push(image);
}

// Get page indexes
for (const link of rawDocument.querySelectorAll('.xh-paginator-button')) {
  page = document.createElement('a');
  if (link.href) {
    page.href = link.href;
  }
  page.textContent = link.outerText;
  pages.push(page);
}

break;

case -1318382313: // FIXME javasript interpretation required

// Get title
name =
  rawDocument
  .querySelector('.title')
  .outerText;

// Get image
photo =
  rawDocument
  .querySelector('.avatar > .img')
  .style
  .backgroundImage;
 
photo = 
  photo.substring(photo.indexOf('("')+2, photo.lastIndexOf('")'));

// Get list of links and images
for (const element of rawDocument.querySelectorAll('.listing-content > a')) {
  links.push(element.href);
  text = element.querySelector('.info > .basic').title;
  texts.push(text);
  image = element.querySelector('.thumb > .img').style.backgroundImage;
  image = image.substring(image.indexOf('("')+2, image.lastIndexOf('")'));
  images.push(image);
}

break;

case 726866450:

// Get title
try {
name =
  rawDocument
  .querySelector('h1')
  .outerText;
} catch {
name =
  rawDocument
  .querySelector('h4')
  .outerText;
}

// Get image
try {
photo =
  rawDocument
  .querySelector('img[alt="pornoStar"]')
  .src;
} catch {
photo =
  rawDocument
  .querySelector('#avatar')
  .src
  .replace('avatar_extra_', '');
}

// Get age
try {
age =
  queryXPath(
    rawDocument,
    "//*[contains(text(),'Birth date:')]"
  )
  .singleNodeValue
  .nextElementSibling
  .outerText;
} catch {
age =
  queryXPath(
    rawDocument,
    "//*[contains(text(),'I am:')]"
  )
  .singleNodeValue
  .nextElementSibling
  .outerText;
}

// Get nationality
try {
nation =
  queryXPath(
    rawDocument,
    "//*[contains(text(),'Country:')]"
  )
  .singleNodeValue
  .nextElementSibling
  .outerText;
} catch {
nation =
  queryXPath(
    rawDocument,
    "//*[contains(text(),'From:')]"
  )
  .singleNodeValue
  .nextElementSibling
  .outerText;
}

// Get list of links and images
for (const element of rawDocument.querySelectorAll('#thumbsSection > div > div > div > .th > a')) {
  links.push(element.href);
  text = element.querySelector('.video-title').outerText;
  texts.push(text);
  image = element.querySelector('.thumb > img').getAttribute('data-src');
  if (!image) {
    image = element.querySelector('.thumb > img').src;
  }
  images.push(image);
}

if (!images.length) { // FIXME
  for (const element of rawDocument.querySelectorAll('#uploads > div > a')) {
    links.push(element.href);
    text = element.querySelector('.video-title').outerText;
    texts.push(text);
    image = element.querySelector('.thumb > img').getAttribute('data-src');
    if (!image) {
      image = element.querySelector('.thumb > img').src;
    }
    images.push(image);
  }
}

break;

case -1791086888:
case 1479980214:

// Get title
try {
name =
  rawDocument
  .querySelector('h1')
  .outerText;
} catch {
name =
  rawDocument
  .querySelector('h2')
  .outerText;
}

// Get image
try {
photo =
  rawDocument
  .querySelector('.model-avatar > picture > img')
  .src;
} catch {
  // No image
}

// Get age
try {
age =
  queryXPath(
    rawDocument,
    "//*[contains(text(),'Age:')]"
  )
  .singleNodeValue
  .nextElementSibling
  .outerText;
} catch {
  // No age
}

// Get nationality
try {
nation =
  queryXPath(
    rawDocument,
    "//*[contains(text(),'Birthplace:')]"
  )
  .singleNodeValue
  .nextElementSibling
  .outerText;
} catch {
  // No info
}

// Get list of links and images
for (const element of rawDocument.querySelectorAll('.thumbs > .th > .th-image > .th-image-link')) {
  links.push(element.href);
  texts.push(element.title);
  if (element.href.includes('/videos/')) {
    image = element.querySelector('picture > img').src;
  } else {
    image = element.querySelector('img').src;
  }
  images.push(image);
}

// Get page indexes
for (const link of rawDocument.querySelectorAll('.page > a')) {
  page = document.createElement('a');
  if (link.href) {
    page.href = link.href;
  }
  page.textContent = link.outerText;
  pages.push(page);
}

break;

case 161994028:

// Get title
try {
name =
  rawDocument
  .querySelector('h1')
  .outerText;
} catch {
name =
  rawDocument
  .querySelector('h3')
  .outerText;
}

// Get list of links and images
for (const element of rawDocument.querySelectorAll('figure > a')) {
  links.push(element.href);
  text = element.querySelector('img').alt;
  texts.push(element.title); // TODO Why is it "element.title" instead of "text"?
  image = element.querySelector('img').getAttribute('data-original');
  images.push(image);
}

break;

case -469933:

// Get list of links and images
for (const element of rawDocument.querySelectorAll('div[id^="video_"]')) {
  link = element.querySelector('p > a');
  if (link) {
  links.push(link.href);
  texts.push(link.title);
  image = element.querySelector('.thumb-inside > .thumb > a > img').getAttribute('data-src');
  images.push(image);
  }
}

break;

case -1016825242:

// Get title
name =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get list of links and images
for (const element of rawDocument.querySelectorAll('.item > .thumb > a')) {
  links.push(element.href);
  texts.push(element.title);
  image = element.querySelector('img').getAttribute('data-original');
  images.push(image);
}

// Get list of links
if (images.length < 1) {
  for (const element of rawDocument.querySelectorAll('.item')) {
    link = element.href;
    links.push(link);
    text = link.slice(link.indexOf('/tags/')+6).slice(0,-1);
    //text = link.slice(link.indexOf('/tags/')+6).replace('/','');
    texts.push(text);
  }
}

break;

case 597898866:

// Get title
name =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get list of links and images
for (const element of rawDocument.querySelectorAll('article[id] > a')) {
  links.push(element.href);
  texts.push(element.title);
  image = element.querySelector('img').getAttribute('data-src');
  images.push(image);
}

break;

case -504675209:

// Get title
name =
  rawDocument
  .querySelector('h2')
  .outerText;

// Get image
photo =
  rawDocument
  .querySelector('.model-sidebar--preview > img')
  .src;

// Get age
age =
  queryXPath(
    rawDocument,
    "//*[contains(text(),'Born:')]"
  )
  .singleNodeValue
  .outerText;

// Get nationality
nation =
  queryXPath(
    rawDocument,
    "//*[contains(text(),'Birthplace:')]"
  )
  .singleNodeValue
  .outerText;

// Get list of links and images
for (const element of rawDocument.querySelectorAll('.item > a')) {
  links.push(element.href);
  texts.push(element.title);
  image = element.querySelector('img').getAttribute('data-original');
  images.push(image);
}

break;

case -426571524:

// Get title
name =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get list of links and images
for (const element of rawDocument.querySelectorAll('.thumb > a')) {
  if (!element.href.includes('paysite')) {
    links.push(element.href);
    texts.push(element.title);
    image = element.querySelector('img').getAttribute('data-original');
    images.push(image);
  }
}

break;

case 1487350944:

// Get title
name =
  rawDocument
  .querySelector('h2')
  .outerText;

// Get list of links and images
for (const element of rawDocument.querySelectorAll('ul.thumbs > li')) {
  link = element.querySelector('a');
  links.push(link.href);
  if (link.title) {
    texts.push(link.title);
  } else {
    text = element.querySelector('a > img');
    texts.push(text.getAttribute('alt'));
  }
  image = element.querySelector('a > img').src;
  images.push(image);
}

if (links.length < 1) { // categories
  for (const element of rawDocument.querySelectorAll('.fuck')) {
    link = element.querySelector('a');
    links.push(link.href);
    texts.push(link.title);
    image = element.querySelector('a > img').src;
    images.push(image);
  }
}

if (links.length < 1) { // channels
  for (const element of rawDocument.querySelectorAll('.th')) {
    links.push(element.href);
    texts.push(element.title);
    image = element.querySelector('img').src;
    images.push(image);
  }
}

if (links.length < 7) { // root
  for (const element of rawDocument.querySelectorAll('a[title]')) {
    links.push(element.href);
    texts.push(element.title);
  }
}

break;

case -719239027:

// Get title
name =
  rawDocument
  .querySelector('.title > span')
  .outerText;

// Get image
photo =
  rawDocument
  .querySelector('.title > img')
  .src;

// Get age
age =
  rawDocument
  .querySelector('.quote')
  .outerText;

// Get list of links and images
for (const element of rawDocument.querySelectorAll('.rightside > ul.box > li.item')) {
  link = element.querySelector('a');
  links.push(link.href);
  text = element.querySelector('a > .item_desc');
  texts.push(text.outerText);
  image = element.querySelector('a > .img > img').src;
  images.push(image);
}

break;

case -1455267443:

// Get title
name =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get list of links and images
for (const element of rawDocument.querySelectorAll('.preview-ins > a')) {
  links.push(element.href);
  text = element.querySelector('.name');
  texts.push(text.outerText);
  image = element.querySelector('div > img').src;
  images.push(image);
}

break;

case -1073731548:

// Get title
try {
  name =
    rawDocument
    .querySelector('h1')
    .outerText;
} catch (err) {
  console.warn('Found no title: ' + err);
}

// Get image
try {
  photo =
    rawDocument
    .querySelector('.model__left.model__left--photo img')
    .src;
} catch (err) {
  console.warn('Found no photo: ' + err);
}

// Get age
try {
  age =
    queryXPath(
      rawDocument,
      "//*[contains(text(),'Age:')]"
    )
    .singleNodeValue
    .nextElementSibling
    .outerText;
} catch (err) {
  console.warn('Found no photo: ' + err);
}

// Get nationality
try {
  nation =
    rawDocument
    .querySelector('a[href*="nationality"]')
    .outerText;
} catch (err) {
  console.warn('Found no nationality: ' + err);
}

// Get list of links and images
for (const element of rawDocument.querySelectorAll('div.card-scene')) {
  link = element.querySelector('div.card-scene__text a');
  if (link) {
    links.push(link.href);
    texts.push(link.outerText);
    image = element.querySelector('div.card-scene__view > a > img').getAttribute('data-src'); // FIXME 403
    try {
      //images.push(image.slice(image.indexOf('h'),image.length-1));
      image = image.slice(image.indexOf('(')+1,image.indexOf(')'));
    } catch {
      try {
        image = element.querySelector('.thumbnail-image > a[slider-src]').getAttribute('slider-src');
      } catch (err) {
        console.log(err);
      }
    }
    if (!image) {
      image = noPreviewImage;
    }
    images.push(image);
  }
}

// TODO xhr
// Get page indexes
for (const link of rawDocument.querySelectorAll('.pagination > * > a')) {
  page = document.createElement('a');
  page.href = link.href;
  page.textContent = link.outerText;
  pages.push(page);
}

break;

case -1584194694:

// Get title
name =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get list of links and images
for (const element of rawDocument.querySelectorAll('.thmbclck')) {
  link = element.querySelector('a');
  links.push(link.href);
  text = element.querySelector('a > strong');
  texts.push(text.outerText);
  image = element.querySelector('* > img').getAttribute('data-original');
  images.push(image);
}

break;

case 811446339:

// Get title
name =
  rawDocument
  .querySelector('h1')
  .outerText;

// Get image
try {
  photo =
    rawDocument
    .querySelector('img.img-fluid')
    .src;
} catch (err) {
  console.warn('Photo was not found: ' + err)
}

// Get age
try {
  age =
    rawDocument
    .querySelector('[data-test="link_span_age"]')
    .outerText;
} catch (err) {
  console.warn('Age was not found: ' + err)
}

// Get nationality
nation =
  queryXPath(
    rawDocument,
    "//*[contains(text(),'Place of birth:')]"
  )
  .singleNodeValue
  .nextElementSibling
  .outerText;

if (nation.trim() == 'Unknown') {
  nation =
    queryXPath(
      rawDocument,
      "//*[contains(text(),'Nationality:')]"
    )
    .singleNodeValue
    .nextElementSibling
    .outerText;
}

// Get list of links and images
for (const element of rawDocument.querySelectorAll('.profile-dashboard-item')) {
  link = element.querySelector('a.pr-2.w-100');
  if (link) {
    links.push(link.href);
    texts.push(link.outerText);
    try {
      image = element.querySelector('.image-content').getAttribute('data-src');
    } catch (err) {
      console.warn('Image was not found: ' + err)
    }
    if (!image) {
      try {
        image = element.querySelector('.image-content').src;
      } catch (err) {
        console.warn('Image was not found: ' + err)
      }
    }
    if (!image) {
      image = noPreviewImage;
    }
    images.push(image);
  }
  link = element.querySelector('a.teaser__link');
  if (link) {
    links.push(link.href);
    text = element.querySelector('[data-test="link-name"]');
    texts.push(text.outerText);
    try {
      image = element.querySelector('.image-content').getAttribute('data-src');
    } catch (err) {
      console.warn('Image was not found: ' + err)
    }
    if (!image) {
      try {
        image = element.querySelector('.image-content').src;
      } catch (err) {
        console.warn('Image was not found: ' + err)
      }
    }
    if (!image) {
      image = noPreviewImage;
    }
    images.push(image);
  }
}

break;

case -2044679369: // FIXME
case -491772566: // FIXME
case 60433162:
case 374301332: // FIXME
case 1873419916:
case 1873419916:

// Get title
name =
  rawDocument
  .title
  .split('/')[0]
  .trim();

// Get image
try {
  photo =
    rawDocument
    .querySelector('.profile-pic > img')
    .src;
} catch {
  // No photo
}

// Get age
try {
  age =
    rawDocument
    .querySelector('small.mobile-hide')
    .outerText;
} catch {
  // No age
}

// Get nationality
try {
  nation =
    rawDocument
    .querySelector('.flag')
    .getAttribute('title');
} catch {
  // No nationality
}

// FIXME xhr to interpret scripts
// Get list of links and images
for (const element of rawDocument.querySelectorAll('div[id^="video_"]')) {
  link = element.querySelector('p.title > a');
  if (link) {
    link.removeChild(link.firstElementChild).outerText; // remove time duration
    links.push(link.href);
    texts.push(link.outerText);
    image = element.querySelector('img[data-videoid]').getAttribute('data-src');
    if (!image) {
      image = noPreviewImage;
    }
    images.push(image);
  }
}

break;

}

// TODO Clear scripts
for (var i = document.styleSheets.length - 1; i >= 0; i--) {
  document.styleSheets[i].disabled = true;
}

for (var i = document.scripts.length - 1; i >= 0; i--) {
  document.scripts[i].disabled = true;
}

for (const script of document.querySelectorAll('script')) {
  script.remove();
}

// rawDoc
for (const script of rawDocument.querySelectorAll('script')) {
  script.remove();
}

// Build a new page
const domParser = new DOMParser();
const newDocument = domParser.parseFromString(htmlPage, 'text/html');

// Place title
newTitle = newDocument.getElementById('title');
if (name) {
  newTitle.append(name.trim());
  newDocument.title = name.trim();
} else {
  title = document.title;
  newTitle.append(title);
  newDocument.title = title;
}

// Place image
if (photo) {
  newDocument
    .getElementById('photo')
    .src = photo;
} else {
  newDocument
    .getElementById('photo')
    .remove();
}

// Place deceased
//ele = newDocument.getElementById('deceased')
if (name) {
  for (let i = 0; i < deceased.people.length; i++) {
    // FIXME Accidentally applied for others when exec has only first name
    if (name.match(deceased.people[i].exec)) {
      const warnings = [
        //'Attention: ',
        `${deceased.people[i].pref} ${deceased.people[i].name} aka ${deceased.people[i].exec} died prematurely at the age of ${deceased.people[i].year} (${deceased.people[i].date})`,
        `My name is ${deceased.people[i].name} aka ${deceased.people[i].exec} and I’m dead. I’ve died prematurely at the age of ${deceased.people[i].year} (${deceased.people[i].date})`,
        `Hello! I am ${deceased.people[i].name} aka ${deceased.people[i].exec} and I’m dead since ${deceased.people[i].date}. I’ve died prematurely when I was at ${deceased.people[i].year} years of age.`,
        `Hello! I am ${deceased.people[i].name} aka ${deceased.people[i].exec} and I’m dead since ${deceased.people[i].date}. I died prematurely at ${deceased.people[i].year} years of age.`,
        `Did you know that ${deceased.people[i].name} aka ${deceased.people[i].exec} is dead since ${deceased.people[i].date}? ${deceased.people[i].pref} ${deceased.people[i].name} has deceased at ${deceased.people[i].year} years of age.`,
        `${deceased.people[i].pref} ${deceased.people[i].name} aka ${deceased.people[i].exec} is dead since ${deceased.people[i].date}. Did you know that?`,
      ];
      warning = warnings[Math.floor(Math.random()*warnings.length)];
      war = newDocument.createElement('div');
      war.id = 'deceased';
      //war.className = 'centert';
      war.textContent = '>>> Deceased';
      ele = newDocument.getElementById('details');
      ele.append(war);
      //ele = newDocument.getElementById('age')
      //ele.textContent = 'Aged: ';
      break;
    }
  }
}

// Place age
ele = newDocument.getElementById('info')
if (age) {
  if (age.trim() != 'Unknown') {
    ele.append(age.trim());
  } else {
    ele.remove();
  }
} else {
  ele.remove();
}

// Place nation
ele = newDocument.getElementById('nation')
if (nation) {
  if (nation.trim() != 'Unknown') {
    ele.append(nation.trim());
  } else {
    ele.remove();
  }
} else {
  ele.remove();
}

// Place links
ul = newDocument.getElementById('links');
for (let i = 0; i < links.length; i++) {
  li = newDocument.createElement('li');
  ln = newDocument.createElement('a');
  ln.id = i;
  ln.className = 'link';
  if (links[i]) {
    ln.textContent = texts[i].trim();
    ln.href = links[i];
  } else {
    ln.textContent = '';
  }
  //ln.addEventListener('mouseover', function(e) {
  //  console.log('mouseover passive ' + i)
  //}, {passive: true});
  //ln.addEventListener('mouseover', preview(i), false);
  //ln.onmouseover = () => {
  //  console.log('onmouseover ' + i)
  //  ln.style.display = 'none';
  //};
  li.append(ln);
  ul.append(li);
}

if (links.length == 0) {alert('This feed is empty.')}

// Place page indexes
pge = newDocument.getElementById('pages');
if (pages.length) {
  pge.append('Pages: ');
}
for (let i = 0; i < pages.length; i++) {
  pg = document.createElement('a');
  if (pages[i].href) {
    pg.href = pages[i].href;
  } else {
    pg.style.color = 'black';
  }
  pg.textContent = pages[i].outerText;
  pge.append(pg);
}

// Get time [hour:minute]
const date = new Date();
minute = date.getMinutes();
hour = date.getHours();
if (date.getMinutes() < 10) {minute = '0' + minute;}
time = hour + ':' + minute;

// Build clock
let clock = newDocument.getElementById('clock');
clock.append(time);

if (warning) {
  motdMsg = `🪦️ ${warning}`;
} else {
  // Message of the day
  motd = motds[Math.floor(Math.random()*motds.length)];
  //motdEmg = motd.split('|')[0];
  motdMsg = motd.split('|')[0];
  motdHrf = motd.split('|')[1];
  console.log(motdMsg)
  console.log(motdHrf)
}

let a = newDocument.createElement('a');
  a.id = 'motd';
  a.addEventListener("click", spin, false);
  a.style.textDecoration = 'none';
  a.style.fontWeight = 'inherit';
  a.style.color = 'black';
  a.textContent = motdMsg;
  if (motdHrf) {
    a.href = motdHrf;
    a.rel = 'noreferrer';
    a.style.color = 'blue';
  }

let div = newDocument.createElement('div');
  div.className = 'centert';
  div.append(a)

//let e = newDocument.createElement('div');
//  e.textContent = motdEmg;
//  e.style.fontSize = '6em'
//  a.append(e)

// Get footer
footer = newDocument.querySelector('#warning > div');
  footer.replaceWith(div)
//footer.textContent = motdMsg;
//footer.href = motdHrf;

let o = newDocument.createElement('marquee');
  // FIXME start/stop not working
  o.onmouseover = 'this.stop()';
  o.onmouseout = 'this.start()';
  o.scrollAmount = '3';
  o.scrollDelay = '26';
  o.textContent = motdMsg;
  o.loop = '3';

let d = newDocument.createElement('div');
  d.className = 'centert shadow';
  d.id = 'fact';
  d.style.left = 0; //
  d.style.right = 0; //
  //d.style.top = 0; //
  d.style.bottom = 0; //
  //FIXME onclick not working
  d.onclick = () => {
    document.getElementById('fact').remove();
    window.scrollTo(0, document.body.scrollHeight);
  }
  d.append(o);

const top = newDocument.querySelector('body');
  top.prepend(d);

// Replace the old with the new
//insertDocument = document.adoptNode(newDocument.documentElement, true);
insertDocument = document.importNode(newDocument.documentElement, true);
removeDocument = document.documentElement;

// Erase page
document.head.remove()
//document.body.remove()

// Replace page
document
  .replaceChild(insertDocument, removeDocument);

for (const link of document.querySelectorAll('#links > li > a')) {
  link.onmouseover = () => {
    index = link.id;
    preview(index, event);
  }
  link.onmouseleave = () => {
    document.querySelector('img[id="' + index + '"]').remove();
  }
}

document
  .getElementById('fact')
  .onclick = () => {
    document.getElementById('fact').remove();
    window.scrollTo(0, document.body.scrollHeight);
  }


// Count down
// https://stackoverflow.com/questions/27406765/hide-div-after-x-amount-of-seconds

var secs = 120;
function timeOut() {
  secs -= 1;
  if (secs == 0 &&
      document.getElementById('fact')) {
    document.getElementById('fact').remove();
    return;
  }
  else {
    setTimeout(timeOut, 1000);
  }
}
timeOut();

cssSelectors = ['#photo', '#title', '.quote'];
for (let i = 0; i < cssSelectors.length; i++) {
  for (element of document.querySelectorAll(cssSelectors[i])) {
    element.onclick = () => {spin()};
  }
}

}; // End of window.onload = (event) // Perhaps should be DOMContentLoaded

function preview(index, event) {
  //console.log(index)
  //console.log(images[index])
  //window.addEventListener('mouseover',event => {
    //hov = document.querySelectorAll(':hover');
    //hov = hov[hov.length-1];
    //if (hov.localName == 'a') {
    //  console.log(index);
    //  console.log(event.pageX, event.pageY);
    //}
  //}, {passive: true});
  var x = event.pageX;
  var y = event.pageY;
  let img = document.createElement('img');
  img.id = index;
  img.src = images[index];
  img.className = 'preview';
  img.style.position = 'absolute';
  img.style.left = x + 10 + 'px';
  img.style.top = y - 150 + 'px';
  //img.style.background = 'url("' + images[index] + '") 0 100px';
  document.body.append(img);
}

function introPageLoader(){
// FIXME [NOTE onloadstart]
//window.onprogress = (event) => {
  const domParser = new DOMParser();
  const splDocument = domParser.parseFromString(introPage, 'text/html');
  insertDocument = document.importNode(splDocument.documentElement, true);
  removeDocument = document.documentElement;
  document.replaceChild(insertDocument, removeDocument);
//}
}

function errorPageLoader(error, message){
  const domParser = new DOMParser();
  const errDocument = domParser.parseFromString(errorPage, 'text/html');
  errDocument.getElementById('type').innerHTML = message;
  if (error == 404) {
    error  = 'Index has been removed (or page address is invalid)'
  } else if (error == 403) {
    error = 'Access forbidden'
  }
  errDocument.getElementById('error').innerHTML = error;
  insertDocument = document.importNode(errDocument.documentElement, true);
  removeDocument = document.documentElement;
  document.replaceChild(insertDocument, removeDocument);
}

// Detect inactivity
// https://stackoverflow.com/questions/24338450/how-to-detect-user-inactivity-with-javascript

onInactive(50000, function () {
  console.log('Inactivity detected')
  document.body.style.filter = 'blur(13px)';
  //window.scrollTo(0, 0);
  document.getElementById('warning').scrollIntoView();
});

window.addEventListener('wheel',event => {
  document.body.style.filter = 'unset';
  removeSrc();
}, {passive: true});

window.addEventListener('keydown',event => {
  document.body.style.filter = 'unset';
  removeSrc();
}, {passive: true});

window.addEventListener('mousemove',event => {
  document.body.style.filter = 'unset';
  removeSrc();
}, {passive: true});

window.addEventListener('hashchange', event => {
  url = new URL(location.href);
  if (url.hash === '#utm') {
    location.reload();
  }
}, {passive: true});

function removeSrc(){
  for (const image of document.querySelectorAll('img.emoji')) {
    //image.removeAttribute('role');
    //image.removeAttribute('draggable');
    //image.removeAttribute('class');
    //image.height = '25px';
    //image.width = '25px';
    //
    image.removeAttribute('src');
    //
    //image.src = '';
    //if (!image.parentElement.textContent.includes(image.alt)) {
    //  image.parentElement.prepend(image.alt);
    //  image.remove();
    //}
    //
    //if (!image.parentElement.textContent.includes(image.alt)) {
    //  image.parentElement.textContent = image.alt + ' ' + image.parentElement.textContent;
    //  image.remove();
    //}
  }
}

function onInactive(ms, cb) {
  var wait = setTimeout(cb, ms);
  if (document.querySelector('video')) {
    //document.querySelector('video').onplay = 
    //document.querySelector('video').onplaying = 
    document.onmousemove = 
    document.mousedown = 
    document.mouseup = 
    document.onkeydown = 
    document.onkeyup = 
    document.focus = 
    function () {
      clearTimeout(wait);
      wait = setTimeout(cb, ms);
    };
  }
}

// TODO
// Consider reset counter upon mouse activity
// https://stackoverflow.com/questions/24338450/how-to-detect-user-inactivity-with-javascript
// Interval
// https://stackoverflow.com/questions/13304471/javascript-get-code-to-run-every-minute
setInterval(function() {
  spin()
}, 180 * 1000); // 180 * 1000 milsec


// Message of the day
// TODO /questions/55177513/how-to-copy-a-variable-into-the-clipboard
function spin() {
  motd = motds[Math.floor(Math.random()*motds.length)];
  motdMsg = motd.split('|')[0];
  motdHrf = motd.split('|')[1];
  motd = document.getElementById('motd')
  motd.textContent = motdMsg;
  if (motdHrf) {
    motd.href = motdHrf;
    motd.rel = 'noreferrer';
    motd.style.color = 'blue'; //#A40000 //#204A87 //DarkRed //#204A87 //#5C3566 //#75507B
    //motd.style.fontStyle = 'italic'
  } else {
    motd.removeAttribute('href');
    motd.style.color = 'black';
    //motd.style.fontStyle = 'normal'
  }
}

//motd = document.getElementById('motd')
//motd.addEventListener("click", spin, false);

function queryXPath(element, query) {
  return element
  .evaluate
  (
    query,
    element,
    null,
    XPathResult
    .FIRST_ORDERED_NODE_TYPE,
    null
  )
}


/* TODO Screen change on inactivity

time = 6000
const domParser = new DOMParser();
const splDocument = domParser.parseFromString(introPage, 'text/html');
introScreen()

function startIntro() {
  console.log("startIntro")
  insertDocument = document.importNode(splDocument.documentElement, true);
  removeDocument = document.documentElement;
  document.replaceChild(insertDocument, removeDocument);
}

function resetCount() {
  console.log("resetCount")
  window.clearTimeout(to);
  to = window.setTimeout(startIntro, time);
}

function introScreen() {
  console.log("introScreen")
  to = window.setTimeout(startIntro, time);
  window.addEventListener("click", resetCount, false);
  window.addEventListener("keyup", resetCount, false);
}

*/
